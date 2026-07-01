const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Karyawan = sequelize.define('karyawan', {
  id_karyawan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_karyawan: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  nip: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  telepon: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  jabatan: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  departemen: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  tanggal_masuk: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'active', // 'active' / 'inactive' / 'cuti'
  },
  gaji: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  tableName: 'karyawan',
  timestamps: true,
});

module.exports = Karyawan;
