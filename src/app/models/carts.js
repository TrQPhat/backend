const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// models/Cart.js
const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    product_id: { type: DataTypes.INTEGER, allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'carts',
    timestamps: false
});

module.exports = Cart;