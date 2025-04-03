const express = require("express");
const upload = require("../config/multer/index.js");
const router = express.Router();

const productController = require("../app/api/productController.js");
const authToken = require("../middleware/authToken.js");

router.get("/getall/", productController.getAllProducts);
router.get("/getproduct/:id", productController.getProductById);
router.get("/getDetails/:ProductID/:IngredientID", productController.getBothDetail);

router.post(
  "/create",
  authToken,
  upload.single("image"),
  productController.createProduct
);
router.post(
  "/update/:id/",
  authToken,
  upload.single("image"),
  productController.updateProduct
);
router.post("/delete/:id/", authToken, productController.deleteProduct);

module.exports = router;
