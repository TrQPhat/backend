const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
const axios = require("axios");

class AuthController {
  async authenticateGoogleUser(req, res) {
    try {
      const { googleToken } = req.body;
      if (!googleToken) throw new Error("Thiếu googleToken");

      // Xác thực token với Google
      const googleRes = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`
      );

      const { email, name } = googleRes.data; // sub = Google ID

      // Kiểm tra user trong database (PostgreSQL, MySQL...)
      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({
          name,
          email,
          password: "ádgsadgajs",
          phone: "00000000",
        });
      }
      // 🔹 Tạo Access Token (hết hạn sau 1 giờ)
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // 🔹 Tạo Refresh Token (hết hạn sau 7 ngày)
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // 🏷️ Lưu các thông tin vào cookie
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      };

      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.cookie("accessToken", accessToken, cookieOptions);

      // ✅ Thêm userRole và userName vào cookie
      res.cookie("userRole", user.role, { ...cookieOptions, httpOnly: false });
      res.cookie("userName", user.name, { ...cookieOptions, httpOnly: false });

      res.status(200).json({
        message: "Đăng nhập thành công",
        response: true,
        accessToken,
        refreshToken,
        UserID: user.id,
        UserName: user.name,
        RoleUser: user.role,
        isNewCustomer: true,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        reponse: false,
        message: "Đã xảy ra lỗi: " + error.message,
      });
    }
  }
}

module.exports = new AuthController();
