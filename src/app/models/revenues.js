const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

// models/Cart.js
const Revenue = sequelize.define("Revenue", {
  date: DataTypes.DATE,
  value: DataTypes.DOUBLE,
});

module.exports = Revenue;
