const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Kategori = sequelize.define('kategori', {
  id_kategori: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_kategori: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'kategori',
  timestamps: true,
});

module.exports = Kategori;
