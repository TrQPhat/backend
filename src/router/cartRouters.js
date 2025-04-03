const express = require("express");
const router = express.Router();

const cartController = require("../app/api/cartController.js");
const authToken = require("../middleware/authToken.js");

router.get("/getcart/:user_id", authToken, cartController.getCart); //Lấy danh sách giỏ hàng của một user
router.post("/add/", authToken, cartController.addToCart); //Thêm sản phẩm vào giỏ hàng
router.post("/update/", authToken, cartController.updateCart); //Cập nhật số lượng sản phẩm trong giỏ hàng
router.post("/delete/", authToken, cartController.removeFromCart); //Xóa sản phẩm khỏi giỏ hàng
router.post("/clear/", authToken, cartController.clearCart); //Xóa toàn bộ sản phẩm trong giỏ hàng

module.exports = router;
