const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const ProductIngredient = sequelize.define(
  "ProductIngredient",
  {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products", // Tên bảng tham chiếu
        key: "id",
      },
    },
    ingredient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ingredients", // Tên bảng tham chiếu
        key: "id",
      },
    },
    quantity_used: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "product_ingredients", // Tên bảng trong DB
    timestamps: false, // Không sử dụng createdAt và updatedAt
  }
);

module.exports = ProductIngredient;