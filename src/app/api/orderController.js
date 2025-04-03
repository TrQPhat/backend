const {
  sequelize,
  Order,
  Product,
  OrderDetail,
  Payment,
  Delivery,
} = require("../models");
const paypal = require("../../config/payment/paypalService");

class OrderController {
  async createOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const { user_id, type, totalPrice, payment_method, deliveryAddress, products } = req.body;
      const io = req.io; // 🔥 Lấy socket.io từ request
  
      // Tạo thanh toán
      const payment = await Payment.create(
        { user_id, payment_method, payment_status: "Pending" },
        { transaction: t }
      );
  
      // Tạo đơn giao hàng
      const delivery = await Delivery.create(
        { address: deliveryAddress, status: "Processing" },
        { transaction: t }
      );
  
      // Tạo đơn hàng
      const order = await Order.create(
        { user_id, type, payments_id: payment.id, deliveries_id: delivery.id, totalPrice },
        { transaction: t }
      );
  
      // Tạo chi tiết đơn hàng
      for (const item of products) {
        const product = await Product.findByPk(item.product_id, { transaction: t });
  
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} does not exist`);
        }
  
        await OrderDetail.create(
          {
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: product.price,
          },
          { transaction: t }
        );
      }
  
      if (payment_method === "paypal") {
        // Tạo thanh toán PayPal
        const create_payment_json = {
          intent: "sale",
          payer: { payment_method: "paypal" },
          redirect_urls: {
            return_url: "http://localhost:3001",
            cancel_url: "http://localhost:3001",
          },
          transactions: [
            {
              amount: { currency: "USD", total: totalPrice },
              description: "Payment for coffee shop order",
            },
          ],
        };
  
        // Gửi yêu cầu thanh toán PayPal
        const paymentResponse = await new Promise((resolve, reject) => {
          paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
              reject(error);
            } else {
              resolve(payment);
            }
          });
        });
  
        const approvalUrl = paymentResponse.links.find((link) => link.rel === "approval_url")?.href;
        if (!approvalUrl) {
          throw new Error("Approval URL not found in PayPal response");
        }
  
        // Cập nhật ID thanh toán PayPal
        await payment.update(
          { paypal_payment_id: paymentResponse.id },
          { transaction: t }
        );
  
        // ✅ Commit giao dịch
        await t.commit();
  
         // 🔥 Lấy thông tin chi tiết đơn hàng trước khi gửi socket
      const fullOrder = await Order.findByPk(order.id, {
        include: [
          { model: Payment },
          { model: Delivery },
          { model: OrderDetail, include: [Product] },
        ],
      });

      // 🔥 Phát sự kiện "newOrder" kèm thông tin chi tiết
      io.emit("newOrder", fullOrder);

      return res.status(200).json({ success: true, approvalUrl });
      } else {
        // ✅ Commit giao dịch
        await t.commit();
  
         // 🔥 Lấy thông tin chi tiết đơn hàng trước khi gửi socket
      const fullOrder = await Order.findByPk(order.id, {
        include: [
          { model: Payment },
          { model: Delivery },
          { model: OrderDetail, include: [Product] },
        ],
      });

      // 🔥 Phát sự kiện "newOrder" kèm thông tin chi tiết
      io.emit("newOrder", fullOrder);

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: fullOrder,
      });
    }
    } catch (error) {
      // ❌ Rollback giao dịch nếu có lỗi
      await t.rollback();
      return res.status(500).json({ success: false, message: "Error creating order", error: error.message });
    }
  }
  
  async executePayment(req, res) {
    const { paymentId, PayerID } = req.query;
    if (!paymentId || !PayerID) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin thanh toán" });
    }

    try {
      const execute_payment_json = { payer_id: PayerID };

      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        async (error, payment) => {
          if (error) {
            console.log("Lỗi xác nhận thanh toán:", error.response);
            return res.status(500).json({
              success: false,
              message: "Lỗi xác nhận thanh toán PayPal",
              error: error.response,
            });
          } else {
            console.log(
              "✅ Thanh toán PayPal thành công:",
              JSON.stringify(payment, null, 2)
            );

            const t = await sequelize.transaction();
            try {
              // 👉 Chỉ cập nhật payment nếu có paypal_payment_id
              const updatedPayment = await Payment.update(
                { payment_status: "Completed" },
                { where: { paypal_payment_id: paymentId }, transaction: t }
              );

              if (updatedPayment[0] === 0) {
                throw new Error("Không tìm thấy thanh toán PayPal để cập nhật");
              }

              await t.commit();
              return res.status(200).json({
                success: true,
                message: "Thanh toán thành công!",
                payment,
              });
            } catch (dbError) {
              await t.rollback();
              console.error("Lỗi cập nhật database:", dbError);
              return res.status(500).json({
                success: false,
                message: "Lỗi cập nhật trạng thái đơn hàng",
              });
            }
          }
        }
      );
    } catch (error) {
      console.error("Lỗi xử lý xác nhận thanh toán:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi xử lý thanh toán",
        error: error.message,
      });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: OrderDetail,
            include: [{ model: Product, attributes: ["id"] }],
          },
          {
            model: Payment,
            attributes: ["payment_method"],
          },
          {
            model: Delivery,
            attributes: ["id","address", "status"],
          },
        ],
      });

      const response = orders.map((order) => ({
        order_id: order.id,
        user_id: order.user_id,
        type: order.type,
        payment_method: order.Payment ? order.Payment.payment_method : null,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        delivery_id: order.Delivery ? order.Delivery.id : null,
        deliveryAddress: order.Delivery ? order.Delivery.address : null,
        status: order.Delivery ? order.Delivery.status : null,
        products: order.OrderDetails.map((detail) => ({
          product_id: detail.Product.id,
          quantity: detail.quantity,
        })),
      }));

      res.status(200).json(response);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  // 🔹 Lấy đơn hàng theo ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderDetail,
            include: [{ model: Product, attributes: ["id"] }],
          },
          {
            model: Payment,
            attributes: ["payment_method"],
          },
          {
            model: Delivery,
            attributes: ["address"],
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại" });
      }

      const response = {
        user_id: order.user_id,
        type: order.type,
        payment_method: order.Payment ? order.Payment.payment_method : null,
        totalPrice: order.totalPrice,
        deliveryAddress: order.Delivery ? order.Delivery.address : null,
        products: order.OrderDetails.map((detail) => ({
          product_id: detail.Product.id,
          quantity: detail.quantity,
        })),
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  // 🔹 Lấy danh sách đơn hàng của một user theo user_id
  async getOrdersByUserId(req, res) {
    try {
      const { user_id } = req.params;
      console.log(`user_id: ${user_id}`);
      const orders = await Order.findAll({
        where: { user_id },
        include: [
          {
            model: OrderDetail,
            include: [{ model: Product, attributes: ["id"] }],
          },
          {
            model: Payment,
            attributes: ["payment_method"],
          },
          {
            model: Delivery,
            attributes: ["address", "status"],
          },
        ],
      });

      if (!orders.length) {
        return res
          .status(404)
          .json({ message: "Không có đơn hàng nào cho user này" });
      }

      const response = orders.map((order) => ({
        user_id: order.user_id,
        order_id: order.id,
        type: order.type,
        payment_method: order.Payment ? order.Payment.payment_method : null,
        totalPrice: order.totalPrice,
        deliveryAddress: order.Delivery ? order.Delivery.address : null,
        status: order.Delivery ? order.Delivery.status : null,
        products: order.OrderDetails.map((detail) => ({
          product_id: detail.Product.id,
          quantity: detail.quantity,
        })),
      }));

      res.status(200).json(response);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng của user:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

// Cập nhật trạng thái thanh toán
async updatePaymentStatus(req, res) {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{
        model: Payment, // Bao gồm bảng Payment để lấy thông tin liên quan đến payment
        attributes: ['id', 'payment_method', 'payment_status', 'paypal_payment_id']
      }]
    });

    if (!order) {
      return res.status(404).json({
        response: false,
        message: "Đơn hàng không tồn tại"
      });
    }

    // Cập nhật trạng thái thanh toán trong bảng Order
    order.payment_status = 'Completed'; // Thêm trường payment_status vào bảng Order
    order.paidAt = new Date(); // Thêm thời gian thanh toán vào bảng Order

    // Cập nhật bảng Payment tương ứng với Order
    const payment = await Payment.findByPk(order.payments_id);

    if (!payment) {
      return res.status(404).json({
        response: false,
        message: "Thanh toán không tồn tại"
      });
    }

    // Cập nhật thông tin trong bảng Payment
    payment.payment_status = 'Completed'; // Cập nhật trạng thái thanh toán trong bảng Payment
    payment.paid_at = new Date(); // Thời gian thanh toán
    payment.paypal_payment_id = "some_paypal_payment_id"; // Thay thế bằng giá trị PayPal thực tế nếu có

    // Lưu các thay đổi
    await payment.save({ transaction: t });
    await order.save({ transaction: t });

    // Commit transaction
    await t.commit();

    // Trả về kết quả
    res.status(200).json({
      response: true,
      message: "Cập nhật trạng thái thanh toán thành công",
      order: {
        id: order.id,
        user_id: order.user_id,
        payment_status: order.payment_status, // Trả về trạng thái thanh toán trong bảng Order
        paidAt: order.paidAt,
        totalPrice: order.totalPrice,
        payment: {
          id: payment.id,
          payment_method: payment.payment_method,
          payment_status: payment.payment_status,
          paid_at: payment.paid_at,
          paypal_payment_id: payment.paypal_payment_id
        }
      }
    });
  } catch (error) {
    // Rollback transaction in case of an error
    await t.rollback();

    res.status(500).json({
      response: false,
      message: "Lỗi khi cập nhật thanh toán",
      error: error.message
    });
  }
}

// Cập nhật trạng thái giao hàng
async updateDeliveryStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // Nhận trạng thái từ body

    console.log("Nhận request cập nhật trạng thái giao hàng:", { id, status });

    // Kiểm tra nếu id không hợp lệ
    if (!id || isNaN(id)) {
      return res.status(400).json({
        response: false,
        message: "ID đơn hàng không hợp lệ",
      });
    }

    // Tìm đơn hàng theo id
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        response: false,
        message: "Đơn hàng không tồn tại",
      });
    }

    console.log("Tìm thấy đơn hàng:", order);

    // Kiểm tra nếu order.deliveries_id không hợp lệ
    if (!order.deliveries_id) {
      return res.status(404).json({
        response: false,
        message: "Không tìm thấy thông tin giao hàng",
      });
    }

    // Tìm thông tin giao hàng từ bảng deliveries
    const delivery = await Delivery.findByPk(order.deliveries_id);
    if (!delivery) {
      return res.status(404).json({
        response: false,
        message: "Thông tin giao hàng không tồn tại",
      });
    }

    console.log("Tìm thấy thông tin giao hàng:", delivery);

    // Kiểm tra nếu trạng thái hợp lệ
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        response: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    console.log("Trạng thái hợp lệ, tiến hành cập nhật...");

    // Cập nhật trạng thái trong bảng deliveries
    delivery.status = status;

    // Lưu lại thay đổi
    await delivery.save();

    console.log("Cập nhật trạng thái thành công:", delivery);

    // Phát sự kiện Socket.io cho các client lắng nghe
    const io = req.io; 
    if (io) {
      io.emit('deliveryStatusUpdated', {
        orderId: order.id,
        status: delivery.status,
        message: `Trạng thái giao hàng của đơn hàng ${order.id} đã được cập nhật thành ${status}`,
      });

      console.log(`Socket.io: Đã phát sự kiện cập nhật trạng thái giao hàng cho đơn hàng ${order.id}`);
    } else {
      console.warn("Lỗi: Không tìm thấy Socket.io trong ứng dụng.");
    }

    // Trả về kết quả
    res.status(200).json({
      response: true,
      message: "Cập nhật trạng thái giao hàng thành công",
      delivery,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái giao hàng:", error);

    res.status(500).json({
      response: false,
      message: "Lỗi khi cập nhật trạng thái giao hàng",
      error: error.message,
    });
  }
}




  // Xóa đơn hàng (Admin)
  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);

      if (!order) {
        return res
          .status(404)
          .json({ response: false, message: "Đơn hàng không tồn tại" });
      }

      await order.destroy();

      res.status(200).json({
        response: true,
        message: "Xóa đơn hàng thành công",
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi xóa đơn hàng",
        error: error.message,
      });
    }
  }

  async getOrderDetails(req, res) {
    try {
      const { order_id } = req.params; // Lấy order_id từ URL
      console.log(`order_id: ${order_id}`);
      const orderDetails = await OrderDetail.findAll({
        where: { order_id },
        include: [
          {
            model: Product,
            attributes: ["id", "name", "price"], // Lấy thông tin sản phẩm
          },
        ],
        attributes: ["quantity"], // Chỉ lấy số lượng từ order_details
      });

      if (!orderDetails.length) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm cho order_id này." });
      }

      // Định dạng dữ liệu JSON
      const formattedData = orderDetails.map((item) => ({
        product_id: item.Product.id,
        product_name: item.Product.name,
        quantity: item.quantity,
        price: item.Product.price,
        totalPrice: item.quantity * item.Product.price,
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      res.status(500).json({ error: "Đã xảy ra lỗi khi truy vấn dữ liệu." });
    }
  }
}

module.exports = new OrderController();
