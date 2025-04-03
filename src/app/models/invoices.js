const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
// models/Invoice.js
const Invoice = sequelize.define('Invoice', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: true },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    issueDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'invoices',
    timestamps: false
});

module.exports = Invoice;