const express = require("express");
const router = express.Router();

const userController = require("../app/api/userController.js");

const authToken = require("../middleware/authToken.js");

router.get("/getall", authToken, userController.getAllUsers);
router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/refreshToken", userController.refreshToken);
router.post("/delete/:IDUser", userController.deleteByID);
router.post("/update/:IDUser", userController.update);
router.post("/getuser/:IDUser", userController.getUser);

module.exports = router;
