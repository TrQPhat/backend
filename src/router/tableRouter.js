const express = require("express");
const router = express.Router();

const tableController = require("../app/api/tableController.js");
const authToken = require("../middleware/authToken.js");

router.get("/getall", authToken, tableController.getAllTables);
router.get("/gettable/:id", authToken, tableController.getTableById);
router.post("/create", authToken, tableController.createTable);
router.post("/update/:id", authToken, tableController.updateTable);
router.post("/delete/:id", authToken, tableController.deleteTable);

module.exports = router;
