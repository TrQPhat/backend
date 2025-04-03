// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Đảm bảo chỉ có một UNIQUE
      },
      
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: false },
    phone: { type: DataTypes.STRING, allowNull: true }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;