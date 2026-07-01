const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetailPeminjaman = sequelize.define('detail_peminjaman', {
  id_detail: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_peminjaman: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'peminjaman',
      key: 'id_peminjaman',
    },
  },
  id_buku: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'buku',
      key: 'id_buku',
    },
  },
  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  status_detail: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
}, {
  tableName: 'detail_peminjaman',
  timestamps: true,
});

module.exports = DetailPeminjaman;
