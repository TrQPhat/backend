const { Product,Ingredient,ProductIngredient } = require("../models");

class ProductController {
  //   1. Lấy danh sách sản phẩm
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.status(200).json({ response: true, products });
    } catch (error) {
      res.status(500).json({ response: false, message: "Lỗi server", error });
    }
  }

  //   2. Lấy chi tiết sản phẩm
  async getProductById(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product)
        return res
          .status(404)
          .json({ response: false, message: "Sản phẩm không tồn tại" });

      res.status(200).json({ response: true, product });
    } catch (error) {
      res.status(500).json({ response: false, message: "Lỗi server", error });
    }
  }

  // Thêm sản phẩm (Admin)
  async createProduct(req, res) {
    try {
      // Kiểm tra nếu không có file ảnh được tải lên
      if (!req.file) {
        return res
          .status(400)
          .json({ response: false, message: "Vui lòng chọn ảnh sản phẩm!" });
      }

      // Lấy thông tin sản phẩm từ request body
      const { name, category_id, type, price, countInStock } = req.body;

      // Kiểm tra sản phẩm đã tồn tại chưa
      const existingProduct = await Product.findOne({ where: { name } });
      if (existingProduct) {
        return res
          .status(400)
          .json({ response: false, message: "Sản phẩm đã tồn tại!" });
      }

      // Tạo đường dẫn ảnh (lưu file vào thư mục 'uploads/')
      const imagePath = `${req.file.filename}`;

      // Lưu sản phẩm vào database với đường dẫn ảnh
      const newProduct = await Product.create({
        name,
        image: imagePath, // Lưu đường dẫn ảnh
        category_id,
        type,
        price,
        countInStock,
        isAvailable: true,
      });

      res.status(201).json({
        response: true,
        message: "Thêm sản phẩm thành công",
        product: newProduct,
      });
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      res.status(500).json({
        response: false,
        message: "Lỗi khi thêm sản phẩm",
        error: error.message,
      });
    }
  }

  // 4. Cập nhật sản phẩm (Admin)
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          response: false,
          message: "Sản phẩm không tồn tại!",
        });
      }

      // Lấy thông tin sản phẩm từ request body
      const { name, category_id, type, price, countInStock, isAvailable } =
        req.body;

      // Tạo một object để chứa dữ liệu cập nhật
      const updatedData = {
        name: name || product.name,
        category_id: category_id || product.category_id,
        type: type || product.type,
        price: price || product.price,
        countInStock:
          countInStock !== undefined ? countInStock : product.countInStock,
        image: req.file ? req.file.filename : product.image,
        isAvailable:
          isAvailable !== undefined
            ? isAvailable === "true"
            : product.isAvailable, // Chuyển đổi giá trị từ chuỗi sang boolean
      };

      // Cập nhật sản phẩm
      await product.update(updatedData);

      res.status(200).json({
        response: true,
        message: "Cập nhật sản phẩm thành công!",
        product: updatedData,
      });
    } catch (error) {
      res.status(500).json({
        response: false,
        message: "Lỗi khi cập nhật sản phẩm!",
        error: error.message,
      });
    }
  }

  //   Xóa sản phẩm (Admin)
  async deleteProduct(req, res) {
    try {
      const { id } = req.body;
      const product = await Product.findByPk(id);

      if (!product)
        return res.status(404).json({
          response: false,
          message: "Sản phẩm không tồn tại",
          id: 10,
        });

      await product.destroy();
      res
        .status(200)
        .json({ response: true, message: "Xóa sản phẩm thành công" });
    } catch (error) {
      res
        .status(500)
        .json({ response: false, message: "Lỗi khi xóa sản phẩm", error });
    }
  }
  async getBothDetail(req, res) {
    try {
      const { ProductID, IngredientID } = req.params;
      console.log(ProductID,IngredientID)
      if (!ProductID || !IngredientID) {
        return res.status(400).json({ message: "Thiếu ProductID hoặc IngredientID" });
      }
  
      const detail = await ProductIngredient.findOne({
        where: { product_id: ProductID, ingredient_id: IngredientID },
        include: [
          { model: Product, as: "product" }, // Dùng alias "product" đã khai báo
          { model: Ingredient, as: "ingredient" }, // Dùng alias "ingredient" đã khai báo
        ],
      });
  
      if (!detail) {
        return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
      }
  
      res.json(detail);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }
  
}

module.exports = new ProductController();
