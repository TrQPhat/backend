const express = require("express");
const router = express.Router();

const orderDetailController = require("../app/api/orderDetailController.js");
const authToken = require("../middleware/authToken.js");

router.get("/getall", authToken, invoiceController.getAllInvoices);

module.exports = router;
