const express = require("express");
const router = express.Router();

const staffController = require("../app/api/staffController.js");
const authToken = require("../middleware/authToken.js");

router.get("/getall", authToken, staffController.getAllStaff);
router.post("/create", authToken, staffController.createStaff);
router.post("/update/:id", authToken, staffController.updateStaff);
router.post("/delete/:id", authToken, staffController.deleteStaff);

module.exports = router;
