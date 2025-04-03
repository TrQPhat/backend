const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// models/Staff.js
const Staff = sequelize.define('Staff', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'staff',
    timestamps: false
});

module.exports = Staff;