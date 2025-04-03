const { Cart, Product } = require("../models");

class CartController {
  constructor() {}

  // Lấy danh sách giỏ hàng của người dùng
  async getCart(req, res) {
    const { user_id } = req.params;
    Cart.findAll({
      where: { user_id },
      include: [{ model: Product, attributes: ["name", "price", "image"] }],
    })
      .then((cartItems) => {
        res.status(200).json({ response: true, data: cartItems });
      })
      .catch((error) => {
        res.status(500).json({
          response: false,
          message: "Lỗi khi lấy giỏ hàng",
          error: error.message,
        });
      });
  }

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(req, res) {
    const { user_id, product_id, quantity } = req.body;

    Cart.findOne({ where: { user_id, product_id } })
      .then((cartItem) => {
        if (cartItem) {
          cartItem.quantity += quantity;
          return cartItem.save();
        } else {
          return Cart.create({ user_id, product_id, quantity });
        }
      })
      .then((cartItem) => {
        res.status(201).json({
          response: true,
          message: "Sản phẩm đã được thêm vào giỏ hàng",
          cartItem,
        });
      })
      .catch((error) => {
        res.status(500).json({
          response: false,
          message: "Lỗi khi thêm sản phẩm vào giỏ hàng",
          error: error.message,
        });
      });
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  async updateCart(req, res) {
    const { user_id, product_id, quantity } = req.body;

    try {
      // Kiểm tra xem sản phẩm có trong giỏ hàng không
      const cartItem = await Cart.findOne({ where: { user_id, product_id } });

      if (!cartItem) {
        return res.status(404).json({
          response: false,
          message: "Sản phẩm không tồn tại trong giỏ hàng",
        });
      }

      // Nếu `quantity` <= 0, xóa sản phẩm khỏi giỏ hàng
      if (quantity <= 0) {
        await cartItem.destroy();
        return res.status(200).json({
          response: true,
          message: "Sản phẩm đã bị xóa khỏi giỏ hàng",
        });
      }

      // Cập nhật số lượng sản phẩm
      cartItem.quantity = quantity;
      await cartItem.save();

      return res.status(200).json({
        response: true,
        message: "Cập nhật giỏ hàng thành công",
        cartItem,
      });
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
      return res.status(500).json({ response: false, message: "Lỗi server" });
    }
  }

  //Xóa sản phẩm khỏi giỏ hàng
  async removeFromCart(req, res) {
    try {
      const { user_id, product_id } = req.body;

      // Tìm sản phẩm trong giỏ hàng
      const cartItem = await Cart.findOne({ where: { user_id, product_id } });

      if (!cartItem) {
        return res.status(404).json({
          response: false,
          message: "Sản phẩm trong giỏ hàng không tồn tại",
        });
      }

      // Xóa sản phẩm khỏi giỏ hàng
      await cartItem.destroy();

      return res.status(200).json({
        response: true,
        message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      });
    } catch (error) {
      return res.status(500).json({
        response: false,
        message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
        error: error.message,
      });
    }
  }

  async clearCart(req, res) {
    const { user_id } = req.body;

    Cart.destroy({ where: { user_id } })
      .then((deletedCount) => {
        if (deletedCount > 0) {
          res
            .status(200)
            .json({ response: true, message: "Đã xóa toàn bộ giỏ hàng" });
        } else {
          res.status(404).json({
            response: false,
            message: "Không tìm thấy giỏ hàng của người dùng",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          response: false,
          message: "Lỗi khi xóa giỏ hàng",
          error: error.message,
        });
      });
  }
}

module.exports = new CartController();
