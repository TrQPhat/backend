  const { Ingredient,Product, ProductIngredient } = require("../models"); // Import model

  class IngredientController {
    // 1️⃣ Lấy danh sách nguyên liệu của sản phẩm
    async getIngredientsByProduct(req, res) {
      try {
        const { id } = req.params; // Lấy product_id từ URL
        const ingredients = await Ingredient.findAll({
          where: { product_id: id },
        });

        if (ingredients.length === 0) {
          return res
            .status(404)
            .json({ response: false, message: "Không tìm thấy nguyên liệu" });
        }

        res.status(200).json({ response: true, data: ingredients });
      } catch (error) {
        res
          .status(500)
          .json({ response: false, message: "Lỗi server", error: error.message });
      }
    }
 // 2️⃣ Thêm nguyên liệu vào sản phẩm
async createIngredient(req, res) {
  try {
    const { name, quantity, importDate, expirationDate, products } = req.body; 

    if (!name || !quantity || !importDate || !expirationDate || !Array.isArray(products)) {
      return res.status(400).json({ response: false, message: "Thiếu thông tin hoặc dữ liệu không hợp lệ" });
    }

    // Tạo nguyên liệu mới
    const newIngredient = await Ingredient.create({
      name,
      quantity,
      import_date: importDate, 
      expiration_date: expirationDate,
    });

    // Liên kết nguyên liệu với sản phẩm
    for (const product of products) {
      await newIngredient.addProduct(product.id, {
        through: { quantity_used: product.quantity_used }, 
      });
    }

    res.status(201).json({
      response: true,
      message: "Thêm nguyên liệu thành công",
      data: newIngredient,
    });
  } catch (error) {
    res.status(500).json({ response: false, message: "Lỗi server", error: error.message });
  }
}


  async updateIngredient(req, res) {
  try {
    const { id, name, quantity, import_date, expiration_date, products } = req.body;

    const ingredient = await Ingredient.findByPk(id, {
      attributes: ["id", "name", "quantity", "import_date", "expiration_date"], // Chỉ lấy các cột hợp lệ
      include: { model: Product, as: "products" } // Lấy thông tin quan hệ
    });

    if (!ingredient) {
      return res.status(404).json({ response: false, message: "Nguyên liệu không tồn tại" });
    }

    // Cập nhật thông tin nguyên liệu
    await ingredient.update({
      name: name || ingredient.name,
      quantity: quantity || ingredient.quantity,
      import_date: import_date || ingredient.import_date,
      expiration_date: expiration_date || ingredient.expiration_date,
      
    });

    // Nếu có danh sách sản phẩm cần cập nhật
    if (products && Array.isArray(products)) {
      await ingredient.setProducts([]); // Xóa quan hệ cũ
      for (const product of products) {
        await ingredient.addProduct(product.id)
      }
    }

    res.status(200).json({
      response: true,
      message: "Cập nhật nguyên liệu thành công",
      data: ingredient,
    });
  } catch (error) {
    res.status(500).json({ response: false, message: "Lỗi server", error: error.message });
  }
}


  // 4️⃣ Xóa nguyên liệu
  async deleteIngredient(req, res) {
     try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ response: false, message: "Thiếu ID nguyên liệu" });
      }

      // Kiểm tra xem nguyên liệu có tồn tại không và lấy các thuộc tính cần thiết
      const ingredient = await Ingredient.findByPk(id, {
        attributes: ['id', 'name', 'quantity'] // Chỉ lấy các thuộc tính cần thiết
      });

      if (!ingredient) {
        return res.status(404).json({ response: false, message: "Nguyên liệu không tồn tại" });
      }

      // Kiểm tra xem có sản phẩm nào liên kết với nguyên liệu này không
      const productIngredient = await ProductIngredient.findOne({
        attributes: ['product_id', 'ingredient_id'], // Lấy cột `product_id` và `ingredient_id` từ bảng trung gian
        where: { ingredient_id: id }
      });

      if (productIngredient) {
        // Xóa liên kết giữa sản phẩm và nguyên liệu trong bảng trung gian
        await ProductIngredient.destroy({ where: { ingredient_id: id } });
      }

      // Sau khi đã xóa liên kết, xóa nguyên liệu khỏi bảng `Ingredient`
      await Ingredient.destroy({ where: { id: id } });

      return res.json({ response: true, message: "Xóa nguyên liệu thành công" });
    } catch (error) {
      return res.status(500).json({ response: false, message: "Lỗi server", error: error.message });
    }
  }
    async getAllProductByIngredientID(req,res){
      try {
        const { ingerdientID } = req.params;
    
        if (!ingerdientID) {
          return res.status(400).json({ success: false, message: "Thiếu ingerdientID" });
        }
    
        const products = await Product.findAll({
          include: [
            {
              model: Ingredient,
              as: "ingredients",
              where: { id: ingerdientID },
              attributes: ["id", "name"],
              through: { attributes: ["quantity_used"] }, // Lấy số lượng nguyên liệu dùng
            },
          ],
        });
    
        res.json({ success: true, data: products });
      } catch (error) {
        console.error("Lỗi lấy sản phẩm theo nguyên liệu:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
      }
    }
    async getAll(req,res){
      try {
        const ingredients = await Ingredient.findAll({
          attributes: ['id', 'name', 'quantity', 'import_date', 'expiration_date'],
          include: [
          {
            model: Product,
            as: "products", // Chú ý: Phải dùng đúng alias đã khai báo trong models
            through: { attributes: ["quantity_used"] }, // Lấy số lượng nguyên liệu đã sử dụng
          },
        ],
        });
        const formattedData = ingredients.map((ingredient) => ({
        ingredient_id: ingredient.id,
        ingredient_name: ingredient.name,
        quantity: ingredient.quantity,
        import_date: ingredient.import_date,
        expiration_date: ingredient.expiration_date,
        products: ingredient.products.map((product) => ({
          id: product.id,
          name: product.name,
          quantity_used: product.ProductIngredient ? product.ProductIngredient.quantity_used : null,
        })),
      }));
        res.json({ success: true, data: formattedData });
      } catch (error) {
        console.error("Lỗi lấy nguyên liệu:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
      }
    }
  }

  module.exports = new IngredientController();
