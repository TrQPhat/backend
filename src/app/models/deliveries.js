const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Delivery = sequelize.define(
  "Delivery",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    address: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending",
    }, // pending, shipped, delivered
  },
  {
    tableName: "deliveries",
    timestamps: false,
  }
);

module.exports = Delivery;
