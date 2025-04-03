const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const SMTPConfig = sequelize.define("SMTPConfig", {
  host: { type: DataTypes.STRING, allowNull: false },
  port: { type: DataTypes.INTEGER, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  secure: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = SMTPConfig;
