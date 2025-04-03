const express = require("express");
const router = express.Router();

const invoiceController = require("../app/api/invoiceController.js");
const authToken = require("../middleware/authToken.js");

router.post("/create", authToken, invoiceController.createInvoice);

router.get("/getall", authToken, invoiceController.getAllInvoices);

router.get(
  "/getall/:user_id",
  authToken,
  invoiceController.getAllInvoicesOfUser
);

router.get("/getbill/:id", authToken, invoiceController.getInvoiceById);
module.exports = router;
