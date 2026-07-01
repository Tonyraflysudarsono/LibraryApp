const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Buku = sequelize.define('buku', {
  id_buku: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_kategori: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kategori',
      key: 'id_kategori',
    },
  },
  kode_buku: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  judul: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  pengarang: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  penerbit: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  tahun: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  stok_tersedia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  stok_maksimal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cover_seed: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'buku',
  timestamps: true,
});

module.exports = Buku;
