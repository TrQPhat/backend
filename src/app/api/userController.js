const { User } = require("../models/index");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
  async getAllUsers(req, res) {
    try {
      const Users = await User.findAll();
      res.status(200).json(Users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  async getUser(req, res) {
    try {
      const IDUser = req.params.IDUser;
      const user = await User.findOne({ where: { id: IDUser } });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteByID(req, res) {
    try {
      const IDUser = req.params.IDUser;
      const deleted = await User.destroy({
        where: { id: IDUser },
      });
      if (deleted) {
        res.status(200).json({ message: "Xóa thành công" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    const id = req.params.IDUser; // Lấy ID từ URL

    try {
      // Tìm user theo ID
      const user = await User.findByPk(id);
      if (!user) {
        return res
          .status(404)
          .json({ response: false, message: "Người dùng không tồn tại" });
      }
      const { name, email, password, phone, isAdmin } = req.body; // Lấy dữ liệu từ body
      // Tạo object chứa dữ liệu cần cập nhật
      const updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (isAdmin !== undefined) updateData.isAdmin = isAdmin;

      // Nếu có mật khẩu mới, mã hóa trước khi lưu
      if (password) {
        updateData.password = await bcryptjs.hash(password, 10);
      }

      // Cập nhật thông tin user
      await user.update(updateData);

      res
        .status(200)
        .json({ response: true, message: "Cập nhật thành công", user });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ response: false, message: "Đã xảy ra lỗi khi cập nhật" });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          message: "Sai tên đăng nhập hoặc mật khẩu",
          response: false,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Sai tên đăng nhập hoặc mật khẩu",
          response: false,
        });
      }

      // 🔐 Tạo Access Token (hết hạn 1h)
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // 🔐 Tạo Refresh Token (hết hạn 7 ngày)
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      // ✅ Thiết lập cookie: phải là SameSite=None + Secure để gửi cross-origin
      const cookieOptions = {
        httpOnly: true,
        secure: true, // luôn dùng HTTPS với Render
        sameSite: "None", // cần thiết cho cookie cross-site
        path: "/",
      };

      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.cookie("accessToken", accessToken, cookieOptions);

      // 👀 Cookie hiển thị ở FE (không httpOnly)
      res.cookie("userRole", user.role, {
        ...cookieOptions,
        httpOnly: false,
      });

      res.cookie("userName", user.name, {
        ...cookieOptions,
        httpOnly: false,
      });

      // ✅ Phản hồi thành công
      res.status(200).json({
        message: "Đăng nhập thành công",
        response: true,
        accessToken,
        refreshToken,
        UserID: user.id,
        UserName: user.name,
        RoleUser: user.role,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi: " + error.message });
    }
  }

  async register(req, res) {
    const { name, email, password, phone, role } = req.body;

    try {
      // Kiểm tra xem email đã tồn tại chưa
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ response: false, message: "Email đã tồn tại" });
      }

      // Mã hóa mật khẩu trước khi lưu
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Tạo user mới
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || "user",
      });

      res
        .status(201)
        .json({ response: true, message: "Đăng ký thành công", user: newUser });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ response: false, message: "Đã xảy ra lỗi khi đăng ký" });
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(401)
          .json({ message: "Không có refresh token", response: false });
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        async (err, decoded) => {
          if (err) {
            return res
              .status(403)
              .json({ message: "Refresh token không hợp lệ", response: false });
          }

          const user = await User.findByPk(decoded.id);
          if (!user) {
            return res
              .status(404)
              .json({ message: "Người dùng không tồn tại", response: false });
          }

          // 🔹 Tạo Access Token mới (hết hạn sau 1 giờ)
          const newAccessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
          });

          return res.status(200).json({
            message: "Refresh token thành công",
            response: true,
            accessToken: newAccessToken,
          });
        }
      );
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi: " + error.message });
    }
  }
}
module.exports = new UserController();
