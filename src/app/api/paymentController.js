const { Payment } = require("../models");

class VoucherController {

  async getAllPayment(req, res) {
    console.log("Da vao apiii")
    try {
      const payments = await Payment.findAll();
      console.log("VVVVVVVV")
      res.status(200).json({ response: true, payments });
    } catch (error) {
      console.log("BBBBBBBBBBB")

      res.status(500).json({
        response: false,
        message: "Lỗi khi lấy danh sách phương thức thanh toán!",
        error: error.message,
      });
    }
  }
}

module.exports = new VoucherController();
