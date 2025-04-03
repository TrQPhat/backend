const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    category_id: { type: DataTypes.INTEGER, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    countInStock: { type: DataTypes.INTEGER, allowNull: false },
    isAvailable:{ type: DataTypes.BOOLEAN, allowNull: false }
}, {
    tableName: 'products',
    timestamps: false
});

module.exports = Product;