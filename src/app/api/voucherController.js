const { Voucher } = require("../models");

class VoucherController {
  // 📌 1. Lấy danh sách mã giảm giá (Admin)
  async getAllVouchers(req, res) {
    try {
      const vouchers = await Voucher.findAll();
      res.status(200).json({ response: true, vouchers });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi lấy danh sách mã giảm giá",
        error: error.message,
      });
    }
  }

  // 📌 2. Thêm mã giảm giá (Admin)
  async createVoucher(req, res) {
    try {
      const { code, discount, expiryDate } = req.body;

      const existingVoucher = await Voucher.findOne({ where: { code } });
      if (existingVoucher) {
        return res
          .status(400)
          .json({ response: false, message: "Mã giảm giá đã tồn tại" });
      }

      const newVoucher = await Voucher.create({ code, discount, expiryDate });

      res.status(201).json({
        response: true,
        message: "Thêm mã giảm giá thành công",
        voucher: newVoucher,
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi thêm mã giảm giá",
        error: error.message,
      });
    }
  }

  // 📌 3. Kiểm tra & áp dụng mã giảm giá
  async applyVoucher(req, res) {
    try {
      const { code } = req.body;

      const voucher = await Voucher.findOne({ where: { code } });

      if (!voucher) {
        return res.status(404).json({
          response: false,
          message: "Mã giảm giá không hợp lệ",
        });
      }

      const currentDate = new Date();
      if (new Date(voucher.expiryDate) < currentDate) {
        return res.status(400).json({
          response: false,
          message: "Mã giảm giá đã hết hạn",
        });
      }

      res.status(200).json({
        response: true,
        message: "Mã giảm giá hợp lệ",
        discount: voucher.discount,
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi kiểm tra mã giảm giá",
        error: error.message,
      });
    }
  }
}

module.exports = new VoucherController();
