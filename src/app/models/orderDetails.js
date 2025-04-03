const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders", // Tên bảng phải đúng với database
        key: "id",
      },
      onDelete: "CASCADE",
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "order_details", // Đảm bảo Sequelize dùng đúng tên bảng
    timestamps: false, // Không cần createdAt, updatedAt
  }
);

module.exports = OrderDetail;