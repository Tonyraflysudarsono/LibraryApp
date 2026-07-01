const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Kehadiran = sequelize.define('kehadiran', {
  id_kehadiran: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_karyawan: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'karyawan',
      key: 'id_karyawan',
    },
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  jam_masuk: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  jam_keluar: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'hadir', // 'hadir' / 'izin' / 'sakit' / 'alpha'
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'kehadiran',
  timestamps: true,
});

module.exports = Kehadiran;
