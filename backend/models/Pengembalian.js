const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pengembalian = sequelize.define('pengembalian', {
  id_pengembalian: {
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
  id_admin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'admin',
      key: 'id_admin',
    },
  },
  tanggal_kembali: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  total_denda: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  tableName: 'pengembalian',
  timestamps: true,
});

module.exports = Pengembalian;
