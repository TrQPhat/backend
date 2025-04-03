const express = require("express");
const router = express.Router();

const authController = require("../app/api/authController.js");
// const authToken = require("../middleware/authToken.js");

router.post("/google", authController.authenticateGoogleUser); // lấy doanh thu

module.exports = router;
