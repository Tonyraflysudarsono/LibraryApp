const { Buku, Anggota, Peminjaman, DetailPeminjaman } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Buku.count();
    const totalMembers = await Anggota.count();
    
    // Active borrows: status in ['borrowed', 'pending_return']
    const activeBorrows = await Peminjaman.count({
      where: {
        status: {
          [Op.in]: ['borrowed', 'pending_return'],
        },
      },
    });

    // Overdue borrows: borrowed and current date > tanggal_jatuh_tempo
    const today = new Date().toISOString().split('T')[0];
    const overdueBorrows = await Peminjaman.count({
      where: {
        status: 'borrowed',
        tanggal_jatuh_tempo: {
          [Op.lt]: today,
        },
      },
    });

    return res.status(200).json({
      totalBooks,
      totalMembers,
      activeBorrows,
      overdueBorrows,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = {
  getDashboardStats,
};
