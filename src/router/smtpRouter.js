const express = require("express");
const router = express.Router();

const { getSMTPConfig, updateSMTPConfig, sendTestEmail } = require("../app/api/smtpController");
const authToken = require("../middleware/authToken.js");
const verifyToken = require("../middleware/authToken.js");


router.get("/get",authToken ,verifyToken ,getSMTPConfig);
router.post("/update",authToken, verifyToken ,updateSMTPConfig);
router.post("/send",authToken ,verifyToken , sendTestEmail);

module.exports = router;
