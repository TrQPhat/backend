const express = require("express");
const router = express.Router();
const upload = require("../config/multer/index");
const multerController = require("../app/api/multerController");

// API upload file
router.post("/upload", upload.single("file"), multerController.uploadFile);

// API lấy danh sách file
router.get("/", multerController.getFiles);

// API lấy file cụ thể
router.get("/:filename", multerController.getFile);

module.exports = router;
