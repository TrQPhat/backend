const express = require("express");
const router = express.Router();

const ingredientController = require("../app/api/ingredientController.js");

router.get(
  "/products/ingredients/:id",
  ingredientController.getIngredientsByProduct
); // Lấy danh sách nguyên liệu của sản phẩm
router.post("/create", ingredientController.createIngredient); // Thêm nguyên liệu
router.post("/update", ingredientController.updateIngredient); // Cập nhật nguyên liệu
router.post("/delete", ingredientController.deleteIngredient); // Xóa nguyên liệu
router.get("/getAllProduct/:ingerdientID", ingredientController.getAllProductByIngredientID); // Từ nguyên liệu lấy ra các sản phẩm sử dụng nguyên liệu đó
router.get("/getAll", ingredientController.getAll); // Xóa nguyên liệu

module.exports = router;
