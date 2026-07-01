const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('admin', {
  id_admin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_admin: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'admin',
  timestamps: true,
});

module.exports = Admin;
