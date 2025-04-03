const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

  let token = req.headers.authorization?.split(" ")[1]; // Lấy token từ Authorization header

  if (!token) {
    token = req.cookies?.accessToken; // Nếu không có token trong Header, thử lấy từ cookies
  }

  if (!token) {
    return res.status(403).json({ message: "Không có token, truy cập bị từ chối" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
    req.user = decoded; // Lưu thông tin user vào request
    console.log("passsssssssssssssssssssss token")
    next();
  });
};

module.exports = verifyToken;