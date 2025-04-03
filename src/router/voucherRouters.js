const express = require("express");
const voucherController = require("../app/api/voucherController.js");
const authToken = require("../middleware/authToken.js");

const router = express.Router();

router.get("/getall", authToken, voucherController.getAllVouchers);
router.post("/create", authToken, voucherController.createVoucher);
router.post("/apply", authToken, voucherController.applyVoucher);

module.exports = router;
