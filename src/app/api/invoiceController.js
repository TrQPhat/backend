const { Invoice, Order } = require("../models");

class InvoiceController {
  async createInvoice(req, res) {
    try {
      const { order_id } = req.body;

      const order = await Order.findByPk(order_id);
      if (!order) {
        return res
          .status(404)
          .json({ response: false, message: "Đơn hàng không tồn tại" });
      }

      const invoice = await Invoice.findOne({ where: { order_id } });
      if (invoice) {
        return res
          .status(400)
          .json({ response: false, message: "Hóa đơn đã tồn tại" });
      }
      if (!order.isPaid) {
        return res
          .status(400)
          .json({ response: false, message: "Đơn hàng chưa được thanh toán" });
      }

      // Tạo hóa đơn mới
      const newInvoice = await Invoice.create({
        order_id,
        totalAmount: order.totalPrice,
        issueDate: new Date(),
      });

      res.status(201).json({
        response: true,
        message: "Hóa đơn đã được tạo",
        invoice: newInvoice,
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi tạo hóa đơn",
        error: error.message,
      });
    }
  }

  async getAllInvoices(req, res) {
    try {
      const invoices = await Invoice.findAll({
        include: [{ model: Order }],
      });

      res.status(200).json({ response: true, invoices });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi lấy danh sách hóa đơn",
        error: error.message,
      });
    }
  }

  //Lấy danh sách hóa đơn của người dùng
  async getAllInvoicesOfUser(req, res) {
    try {
      const { user_id } = req.params;

      const invoices = await Invoice.findAll({
        include: [{ model: Order, where: { user_id } }],
      });

      res.status(200).json({ response: true, invoices });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi lấy danh sách hóa đơn",
        error: error.message,
      });
    }
  }

  // Lấy chi tiết hóa đơn
  async getInvoiceById(req, res) {
    try {
      const { id } = req.params;

      const invoice = await Invoice.findByPk(id, {
        include: [{ model: Order }],
      });

      if (!invoice) {
        return res
          .status(404)
          .json({ response: false, message: "Hóa đơn không tồn tại" });
      }

      res.status(200).json({ response: true, invoice });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi lấy hóa đơn",
        error: error.message,
      });
    }
  }
}

module.exports = new InvoiceController();
