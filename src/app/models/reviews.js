const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
// models/Review.js
const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    product_id: { type: DataTypes.INTEGER, allowNull: true },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true }
}, {
    tableName: 'reviews',
    timestamps: true
});

module.exports = Review;