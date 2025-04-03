const express = require("express");
const router = express.Router();

const paymentController = require("../app/api/paymentController.js");
const authToken = require("../middleware/authToken.js");


router.get("/getall/", authToken, paymentController.getAllPayment);


module.exports = router;
