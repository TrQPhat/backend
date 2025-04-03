const express = require("express");
const router = express.Router();

const orderController = require("../app/api/orderController.js");
const authToken = require("../middleware/authToken.js");

router.post("/create/", authToken, orderController.createOrder);

router.get("/getall/", authToken, orderController.getAllOrders);
router.get("/execute/", orderController.executePayment);

router.get(
  "/getorderforuser/:user_id",
  authToken,
  orderController.getOrdersByUserId
);

router.get("/getorder/:id", authToken, orderController.getOrderById);

router.post("/pay/:id", authToken, orderController.updatePaymentStatus);

router.post("/deliver/:id", authToken, orderController.updateDeliveryStatus);

router.post("/delete/:id", authToken, orderController.deleteOrder);

router.get("/detail/:order_id", authToken, orderController.getOrderDetails);

module.exports = router;
