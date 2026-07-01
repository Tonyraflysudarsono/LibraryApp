const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Anggota = sequelize.define('anggota', {
  id_anggota: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_anggota: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  no_identitas: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  telepon: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  status_anggota: {
    type: DataTypes.STRING(20),
    defaultValue: 'active', // 'active' / 'inactive'
  },
}, {
  tableName: 'anggota',
  timestamps: true,
});

module.exports = Anggota;
