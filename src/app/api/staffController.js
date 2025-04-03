const { Staff } = require("../models");

class StaffController {
  // 📌 1. Lấy danh sách nhân viên (Admin)
  async getAllStaff(req, res) {
    try {
      const staffs = await Staff.findAll();
      res.status(200).json({ response: true, staffs });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi lấy danh sách nhân viên",
        error: error.message,
      });
    }
  }

  // 📌 2. Thêm nhân viên (Admin)
  async createStaff(req, res) {
    try {
      const { name, email, phone, role } = req.body;

      const existingStaff = await Staff.findOne({ where: { email } });
      if (existingStaff) {
        return res
          .status(400)
          .json({ response: false, message: "Email này đã tồn tại" });
      }

      const newStaff = await Staff.create({ name, email, phone, role });

      res.status(201).json({
        response: true,
        message: "Thêm nhân viên thành công",
        staff: newStaff,
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi thêm nhân viên",
        error: error.message,
      });
    }
  }

  // 📌 3. Cập nhật thông tin nhân viên (Admin)
  async updateStaff(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, role } = req.body;

      const staff = await Staff.findByPk(id);

      if (!staff) {
        return res
          .status(404)
          .json({ response: false, message: "Nhân viên không tồn tại" });
      }

      // Chỉ cập nhật các trường có trong body
      if (name !== undefined) staff.name = name;
      if (email !== undefined) staff.email = email;
      if (phone !== undefined) staff.phone = phone;
      if (role !== undefined) staff.role = role;

      await staff.save();

      res.status(200).json({
        response: true,
        message: "Cập nhật thông tin nhân viên thành công",
        staff,
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi cập nhật nhân viên",
        error: error.message,
      });
    }
  }

  // 📌 4. Xóa nhân viên (Admin)
  async deleteStaff(req, res) {
    try {
      const { id } = req.params;

      const staff = await Staff.findByPk(id);

      if (!staff) {
        return res
          .status(404)
          .json({ response: false, message: "Nhân viên không tồn tại" });
      }

      await staff.destroy();

      res.status(200).json({
        response: true,
        message: "Xóa nhân viên thành công",
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi xóa nhân viên",
        error: error.message,
      });
    }
  }
}

module.exports = new StaffController();
