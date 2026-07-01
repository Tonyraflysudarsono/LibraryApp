const sequelize = require('../config/database');
const Admin = require('./Admin');
const Anggota = require('./Anggota');
const Kategori = require('./Kategori');
const Buku = require('./Buku');
const Peminjaman = require('./Peminjaman');
const DetailPeminjaman = require('./DetailPeminjaman');
const Pengembalian = require('./Pengembalian');
const Denda = require('./Denda');
const Karyawan = require('./Karyawan');
const Kehadiran = require('./Kehadiran');

// Kategori <-> Buku
Kategori.hasMany(Buku, { foreignKey: 'id_kategori', as: 'buku' });
Buku.belongsTo(Kategori, { foreignKey: 'id_kategori', as: 'kategori' });

// Anggota <-> Peminjaman
Anggota.hasMany(Peminjaman, { foreignKey: 'id_anggota', as: 'peminjaman' });
Peminjaman.belongsTo(Anggota, { foreignKey: 'id_anggota', as: 'anggota' });

// Admin <-> Peminjaman
Admin.hasMany(Peminjaman, { foreignKey: 'id_admin', as: 'peminjaman' });
Peminjaman.belongsTo(Admin, { foreignKey: 'id_admin', as: 'admin' });

// Peminjaman <-> DetailPeminjaman
Peminjaman.hasMany(DetailPeminjaman, { foreignKey: 'id_peminjaman', as: 'detail_peminjaman' });
DetailPeminjaman.belongsTo(Peminjaman, { foreignKey: 'id_peminjaman', as: 'peminjaman' });

// Buku <-> DetailPeminjaman
Buku.hasMany(DetailPeminjaman, { foreignKey: 'id_buku', as: 'detail_peminjaman' });
DetailPeminjaman.belongsTo(Buku, { foreignKey: 'id_buku', as: 'buku' });

// Peminjaman <-> Pengembalian
Peminjaman.hasOne(Pengembalian, { foreignKey: 'id_peminjaman', as: 'pengembalian' });
Pengembalian.belongsTo(Peminjaman, { foreignKey: 'id_peminjaman', as: 'peminjaman' });

// Admin <-> Pengembalian
Admin.hasMany(Pengembalian, { foreignKey: 'id_admin', as: 'pengembalian' });
Pengembalian.belongsTo(Admin, { foreignKey: 'id_admin', as: 'admin' });

// Pengembalian <-> Denda
Pengembalian.hasMany(Denda, { foreignKey: 'id_pengembalian', as: 'denda' });
Denda.belongsTo(Pengembalian, { foreignKey: 'id_pengembalian', as: 'pengembalian' });

// DetailPeminjaman <-> Denda
DetailPeminjaman.hasMany(Denda, { foreignKey: 'id_detail', as: 'denda' });
Denda.belongsTo(DetailPeminjaman, { foreignKey: 'id_detail', as: 'detail_peminjaman' });

// Karyawan <-> Kehadiran
Karyawan.hasMany(Kehadiran, { foreignKey: 'id_karyawan', as: 'kehadiran' });
Kehadiran.belongsTo(Karyawan, { foreignKey: 'id_karyawan', as: 'karyawan' });

module.exports = {
  sequelize,
  Admin,
  Anggota,
  Kategori,
  Buku,
  Peminjaman,
  DetailPeminjaman,
  Pengembalian,
  Denda,
  Karyawan,
  Kehadiran,
};
