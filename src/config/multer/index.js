const multer = require("multer");
const path = require("path");

// Cấu hình nơi lưu file & đặt tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads")); // Lưu vào thư mục uploads/
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Đặt tên file theo timestamp
  },
});

// Bộ lọc chỉ cho phép tải lên file ảnh (JPG, PNG, jpeg)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ được phép tải lên file ảnh (JPG, PNG)!"), false);
  }
};

// Tạo middleware upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

module.exports = upload;
