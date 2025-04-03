const { sequelize } = require("../models");

class AdminController {
  async getRevenueByYear(req, res) {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      // Lấy tháng và năm từ query params, nếu không có thì lấy tháng/năm hiện tại
      const month = req.query.month || currentMonth;
      const year = req.query.year || currentYear;

      // Kiểm tra đầu vào
      if (!month || !year || isNaN(month) || isNaN(year)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid month or year" });
      }

      // Truy vấn tổng doanh thu từng ngày trong tháng
      const revenue = await sequelize.query(
        `SELECT DAY(createdAt) AS day, SUM(totalPrice) AS revenue 
           FROM orders 
           WHERE MONTH(createdAt) = :month AND YEAR(createdAt) = :year
           GROUP BY DAY(createdAt) 
           ORDER BY DAY(createdAt)`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { month, year },
        }
      );

      return res.json({ success: true, data: revenue });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
}

module.exports = new AdminController();
