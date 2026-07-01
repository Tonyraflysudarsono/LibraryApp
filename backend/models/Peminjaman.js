const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Peminjaman = sequelize.define('peminjaman', {
  id_peminjaman: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_anggota: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'anggota',
      key: 'id_anggota',
    },
  },
  id_admin: {
    type: DataTypes.INTEGER,
    allowNull: true, // Nullable initially (e.g. self-checkout / request), approved by admin later
    references: {
      model: 'admin',
      key: 'id_admin',
    },
  },
  tanggal_pinjam: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  tanggal_jatuh_tempo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'borrowed', // 'borrowed' / 'pending_return' / 'returned'
  },
}, {
  tableName: 'peminjaman',
  timestamps: true,
});

module.exports = Peminjaman;
