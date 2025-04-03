const express = require("express");
const router = express.Router();

const reviewController = require("../app/api/reviewController.js");
const authToken = require("../middleware/authToken.js");

router.post("/create", authToken, reviewController.createReview);
router.get("/getall/:id", authToken, reviewController.getAllReviewsByProduct);
router.post("/update/:id", authToken, reviewController.updateReview);
router.post("/delete/:id", authToken, reviewController.deleteReview);

module.exports = router;
