const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Denda = sequelize.define('denda', {
  id_denda: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_pengembalian: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null if denda is tracked prior to completion of return
    references: {
      model: 'pengembalian',
      key: 'id_pengembalian',
    },
  },
  id_detail: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'detail_peminjaman',
      key: 'id_detail',
    },
  },
  jumlah_denda: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  status_bayar: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'belum_bayar', // 'belum_bayar' / 'lunas'
  },
}, {
  tableName: 'denda',
  timestamps: true,
});

module.exports = Denda;
