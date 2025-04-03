const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Payment = require("./payments");
const Delivery = require("./deliveries");
const Product = require("./products");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // take-away, dine-in
    payments_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Payment, key: "id" },
      onDelete: "CASCADE",
    },
    deliveries_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Delivery, key: "id" },
      onDelete: "CASCADE",
    },
    totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

module.exports = Order;
