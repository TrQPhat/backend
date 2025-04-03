const fs = require("fs").promises; // Sử dụng fs.promises để hỗ trợ async/await
const path = require("path");

class multerController {
  // Phương thức xử lý upload file
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Vui lòng chọn file để upload!" });
      }

      res.json({
        message: "Tải lên thành công!",
        fileUrl: `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`,
      });
    } catch (error) {
      console.error("Lỗi khi tải lên file:", error);
      res.status(500).json({
        message: "Lỗi máy chủ khi tải lên file!",
        error: error.message,
      });
    }
  }

  // Phương thức lấy danh sách file đã upload
  async getFiles(req, res) {
    try {
      const uploadDir = path.join(__dirname, "../../uploads");

      // Kiểm tra và tạo thư mục nếu chưa tồn tại
      await fs.mkdir(uploadDir, { recursive: true });

      // Đọc danh sách file
      const files = await fs.readdir(uploadDir);
      console.log("Danh sách files:", files);

      const fileUrls = files.map(
        (file) => `${req.protocol}://${req.get("host")}/uploads/${file}`
      );

      res.json({ files: fileUrls });
    } catch (error) {
      console.error("Lỗi khi đọc danh sách file:", error);
      res.status(500).json({
        message: "Lỗi máy chủ khi đọc danh sách file!",
        error: error.message,
      });
    }
  }

  // Phương thức lấy file cụ thể
  async getFile(req, res) {
    try {
      const fileName = req.params.filename;
      const filePath = path.resolve(__dirname, "../../uploads", fileName);

      // Kiểm tra file có tồn tại không
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ message: "File không tồn tại!" });
      }

      res.json(filePath);
    } catch (error) {
      console.error("Lỗi khi lấy file:", error);
      res
        .status(500)
        .json({ message: "Lỗi máy chủ khi lấy file!", error: error.message });
    }
  }
}

module.exports = new multerController();
