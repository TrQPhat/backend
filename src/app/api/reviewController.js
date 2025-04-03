const { Review } = require("../models/index");

class ReviewController {
  //  Thêm đánh giá sản phẩm
  async createReview(req, res) {
    try {
      const { user_id, product_id, rating, comment } = req.body;

      const newReview = await Review.create({
        user_id,
        product_id,
        rating,
        comment,
      });

      res.status(201).json({
        response: true,
        message: "Đánh giá đã được thêm",
        review: newReview,
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi thêm đánh giá",
        error: error.message,
      });
    }
  }

  // Lấy danh sách đánh giá của sản phẩm
  async getAllReviewsByProduct(req, res) {
    try {
      const { id } = req.params;

      const reviews = await Review.findAll({ where: { product_id: id } });

      res.status(200).json({ response: true, reviews });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi lấy danh sách đánh giá",
        error: error.message,
      });
    }
  }

  //Sửa đánh giá
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      const review = await Review.findByPk(id);

      if (!review) {
        return res
          .status(404)
          .json({ response: false, message: "Đánh giá không tồn tại" });
      }

      review.rating = rating;
      review.comment = comment;
      await review.save();

      res.status(200).json({
        response: true,
        message: "Cập nhật đánh giá thành công",
        review,
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi cập nhật đánh giá",
        error: error.message,
      });
    }
  }

  //Xóa đánh giá
  async deleteReview(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findByPk(id);

      if (!review) {
        return res
          .status(404)
          .json({ response: false, message: "Đánh giá không tồn tại" });
      }

      await review.destroy();

      res.status(200).json({
        response: true,
        message: "Xóa đánh giá thành công",
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi xóa đánh giá",
        error: error.message,
      });
    }
  }
}

module.exports = new ReviewController();
