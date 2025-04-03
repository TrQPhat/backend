const SMTPConfig = require("../models/smtp");
const nodemailer = require("nodemailer");

exports.getSMTPConfig = async (req, res) => {
     // Kiểm tra quyền Admin
     if (!req.user || req.user.role !== "Admin") {
        return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }

  const config = await SMTPConfig.findOne({ where: { id: 1 } });
  res.json(config);
};

exports.updateSMTPConfig = async (req, res) => {
     // Kiểm tra quyền Admin
     if (!req.user || req.user.role !== "Admin") {
        return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }

  const { host, port, username, password, secure } = req.body;
  await SMTPConfig.upsert({ id: 1, host, port, username, password, secure });
  res.json({ message: "Cập nhật SMTP thành công!" });
};

exports.sendTestEmail = async (req, res) => {
    try {
      console.log("📨 Nhận yêu cầu gửi email:", req.body);
         // Kiểm tra quyền Admin
         if (!req.user || req.user.role !== "Admin") {
            return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
        }
  
      // Kiểm tra dữ liệu đầu vào
      const { to, subject, text } = req.body;
      if (!to || !subject || !text) {
        return res.status(400).json({ message: "Thiếu thông tin email!" });
      }
  
      // Lấy config từ database
      const config = await SMTPConfig.findOne({ where: { id: 1 } });
      console.log("🔍 Cấu hình SMTP từ DB:", config);
  
      if (!config) {
        return res.status(400).json({ message: "SMTP chưa cấu hình!" });
      }
  
      // Tạo transporter
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: { user: config.username, pass: config.password },
      });
  
      console.log("📡 Kết nối SMTP...");
  
      // Gửi email
      const info = await transporter.sendMail({
        from: `"Admin" <${config.username}>`,
        to,
        subject,
        text,
      });
  
      console.log("✅ Email đã gửi thành công:", info);
  
      res.json({ message: "Gửi email thành công!" });
    } catch (error) {
      console.error("❌ Lỗi gửi email:", error);
      res.status(500).json({ message: "Lỗi gửi email!", error });
    }
  };
