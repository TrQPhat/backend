const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
// models/Voucher.js
const Voucher = sequelize.define('Voucher', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    discount: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    expiryDate: { type: DataTypes.DATE, allowNull: false }
}, {
    tableName: 'vouchers',
    timestamps: false
});

module.exports = Voucher;