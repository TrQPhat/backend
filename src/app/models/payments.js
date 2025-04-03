const { DataTypes, DATE } = require("sequelize");
const sequelize = require("../../config/db");

const Payment = sequelize.define(
  "Payment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    payment_method: { type: DataTypes.STRING, allowNull: false }, // Ví dụ: Credit Card, PayPal, Cash
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    }, // pending, completed, failed
    paid_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    paypal_payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: "payments",
    timestamps: false,
  }
);

module.exports = Payment;
