const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Table = sequelize.define(
  "Table",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    table_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("available", "occupied"),
      allowNull: false,
      defaultValue: "available",
    },
  },
  {
    tableName: "tables", // Đặt tên bảng trong database
    timestamps: false, // Không tạo createdAt và updatedAt
  }
);

module.exports = Table;
