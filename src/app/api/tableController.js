const { Table } = require("../models");

class TableController {
  // Lấy danh sách tất cả bàn
  async getAllTables(req, res) {
    try {
      const tables = await Table.findAll();
      res.status(200).json(tables);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Lấy thông tin một bàn theo ID
  async getTableById(req, res) {
    try {
      const { id } = req.params;
      const table = await Table.findByPk(id);
      if (!table) {
        return res.status(404).json({ error: "Bàn không tồn tại" });
      }
      res.status(200).json(table);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi lấy thông tin bàn" });
    }
  }

  // Thêm một bàn mới
  async createTable(req, res) {
    try {
      const { table_name, status } = req.body;
      const newTable = await Table.create({ table_name, status });
      res.status(201).json(newTable);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tạo bàn" });
    }
  }

  // Cập nhật thông tin bàn
  async updateTable(req, res) {
    try {
      const { id } = req.params;
      const { table_name, status } = req.body;
      const table = await Table.findByPk(id);

      if (!table) {
        return res.status(404).json({ error: "Bàn không tồn tại" });
      }

      table.table_name = table_name || table.table_name;
      table.status = status || table.status;
      await table.save();

      res.status(200).json({
        response: true,  
        table,
      });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi cập nhật bàn" });
    }
  }

  // Xóa bàn theo ID
  async deleteTable(req, res) {
    try {
      const { id } = req.params;
      const table = await Table.findByPk(id);

      if (!table) {
        return res.status(404).json({ error: "Bàn không tồn tại" });
      }

      await table.destroy();
      res.status(200).json({ message: "Xóa bàn thành công" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xóa bàn" });
    }
  }
}

module.exports = new TableController();
