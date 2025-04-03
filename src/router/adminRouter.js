const express = require("express");
const router = express.Router();

const adminController = require("../app/api/adminController.js");
const authToken = require("../middleware/authToken.js");

router.get("/revenue", authToken, adminController.getRevenueByYear); // lấy doanh thu

module.exports = router;
