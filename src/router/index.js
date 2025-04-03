const express = require("express");
const router = express.Router();

const userRouter = require("./userRouters");
const productRouter = require("./productRouters");
const cartRouter = require("./cartRouters");
const ingredientRouter = require("./ingredientRouter");
const orderRouter = require("./orderRouters");
const invoicerouter = require("./invoiceRouter");
const reviewRouter = require("./reviewRouters");
const staffRouter = require("./staffRouters");
const voucherRouter = require("./voucherRouters.js");
const multerRouter = require("./multerRouter.js");
const adminRouter = require("./adminRouter");
const authRouter = require("./authRouter.js");
const tableRouter = require("./tableRouter.js");
const paymentRouter = require("./paymentsRouter.js");
const smtpRouter = require("./smtpRouter");

router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/ingredients", ingredientRouter);
router.use("/orders", orderRouter);
router.use("/invoices", invoicerouter);
router.use("/reviews", reviewRouter);
router.use("/staff", staffRouter);
router.use("/vouchers", voucherRouter);
router.use("/multer", multerRouter);
router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/table", tableRouter);
router.use("/payment", paymentRouter);
router.use("/smtp", smtpRouter);

module.exports = router;
