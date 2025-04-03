const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Ingredient = sequelize.define('Ingredient', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.STRING, allowNull: true },
  import_date: {type: DataTypes.DATE, allowNull: true},
  expiration_date: {type: DataTypes.DATE, allowNull: true},
}, {
  tableName: 'ingredients',
  timestamps: false
});

module.exports = Ingredient;