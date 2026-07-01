const { Peminjaman, DetailPeminjaman, Buku, Anggota, Pengembalian, Denda, Admin, sequelize } = require('../models');

// Helper to format a single DetailPeminjaman record as a BorrowRequest
const formatBorrowRequest = (detail) => {
  // Calculate fine for this detail
  let fineAmount = 0;
  if (detail.denda && detail.denda.length > 0) {
    fineAmount = detail.denda.reduce((acc, curr) => acc + parseFloat(curr.jumlah_denda), 0);
  }

  // Get return date from parent peminjaman's pengembalian relation
  const returnDate = detail.peminjaman?.pengembalian?.tanggal_kembali || undefined;

  return {
    id: detail.id_detail.toString(), // frontend expects transaction ID here
    dbId: detail.id_detail,
    peminjamanId: detail.id_peminjaman,
    bookId: detail.id_buku.toString(),
    bookTitle: detail.buku?.judul || 'Unknown Book',
    bookAuthor: detail.buku?.pengarang || 'Unknown Author',
    userId: detail.peminjaman?.anggota?.no_identitas || 'Unknown User',
    userName: detail.peminjaman?.anggota?.nama_anggota || 'Unknown User',
    borrowDate: detail.peminjaman?.tanggal_pinjam,
    dueDate: detail.peminjaman?.tanggal_jatuh_tempo,
    returnDate,
    fine: fineAmount,
    status: detail.peminjaman?.status || 'borrowed', // 'borrowed' | 'pending_return' | 'returned'
  };
};

const getAllTransactions = async (req, res) => {
  try {
    const { userId, status } = req.query;
    
    const detailWhere = {};
    const peminjamanWhere = {};

    // Filter by member if requested
    if (userId) {
      peminjamanWhere['$anggota.no_identitas$'] = userId;
    }

    if (status) {
      peminjamanWhere.status = status;
    }

    const details = await DetailPeminjaman.findAll({
      where: detailWhere,
      include: [
        {
          model: Buku,
          as: 'buku',
        },
        {
          model: Peminjaman,
          as: 'peminjaman',
          where: Object.keys(peminjamanWhere).length > 0 ? peminjamanWhere : undefined,
          include: [
            { model: Anggota, as: 'anggota' },
            { model: Pengembalian, as: 'pengembalian' },
          ],
        },
        {
          model: Denda,
          as: 'denda',
        },
      ],
      order: [['id_detail', 'DESC']],
    });

    const formatted = details.map(formatBorrowRequest);
    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Get all transactions error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const createTransaction = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, bookId } = req.body; // userId can be no_identitas (e.g. MEM001) or id_anggota

    if (!userId || !bookId) {
      return res.status(400).json({ message: 'User ID dan Book ID wajib diisi.' });
    }

    // Find anggota
    let anggota = await Anggota.findOne({ where: { no_identitas: userId } });
    if (!anggota && !isNaN(userId)) {
      anggota = await Anggota.findByPk(parseInt(userId));
    }

    if (!anggota) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Anggota tidak ditemukan.' });
    }

    if (anggota.status_anggota === 'inactive') {
      await transaction.rollback();
      return res.status(403).json({ message: 'Akun anggota dinonaktifkan.' });
    }

    // Check check-out limit (max 3 active borrows)
    const activeBorrowsCount = await DetailPeminjaman.count({
      include: [{
        model: Peminjaman,
        as: 'peminjaman',
        where: {
          id_anggota: anggota.id_anggota,
          status: ['borrowed', 'pending_return'],
        }
      }]
    });

    if (activeBorrowsCount >= 3) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Batas peminjaman maksimal (3 buku) telah tercapai.' });
    }

    // Check book availability
    const book = await Buku.findByPk(bookId);
    if (!book) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Buku tidak ditemukan.' });
    }

    if (book.stok_tersedia <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Stok buku ini sedang habis.' });
    }

    // Calculate dates (14-day checkout period)
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 14);

    // Create Peminjaman
    const newPeminjaman = await Peminjaman.create({
      id_anggota: anggota.id_anggota,
      tanggal_pinjam: borrowDate.toISOString().split('T')[0],
      tanggal_jatuh_tempo: dueDate.toISOString().split('T')[0],
      status: 'borrowed',
    }, { transaction });

    // Create DetailPeminjaman
    const newDetail = await DetailPeminjaman.create({
      id_peminjaman: newPeminjaman.id_peminjaman,
      id_buku: book.id_buku,
      jumlah: 1,
      status_detail: 'borrowed',
    }, { transaction });

    // Decrement book stock
    await book.update({
      stok_tersedia: book.stok_tersedia - 1,
    }, { transaction });

    await transaction.commit();

    // Fetch the fully populated detail row to return formatted
    const fullDetail = await DetailPeminjaman.findByPk(newDetail.id_detail, {
      include: [
        { model: Buku, as: 'buku' },
        {
          model: Peminjaman,
          as: 'peminjaman',
          include: [
            { model: Anggota, as: 'anggota' },
            { model: Pengembalian, as: 'pengembalian' },
          ],
        },
        { model: Denda, as: 'denda' },
      ],
    });

    return res.status(201).json(formatBorrowRequest(fullDetail));

  } catch (error) {
    await transaction.rollback();
    console.error('Create transaction error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const requestReturn = async (req, res) => {
  try {
    const { id } = req.params; // detail_peminjaman ID

    const detail = await DetailPeminjaman.findByPk(id, {
      include: [{ model: Peminjaman, as: 'peminjaman' }]
    });

    if (!detail) {
      return res.status(404).json({ message: 'Detail transaksi tidak ditemukan.' });
    }

    if (detail.peminjaman.status !== 'borrowed') {
      return res.status(400).json({ message: 'Buku ini tidak dalam status dipinjam.' });
    }

    // Update peminjaman status to pending_return
    await detail.peminjaman.update({ status: 'pending_return' });

    const fullDetail = await DetailPeminjaman.findByPk(id, {
      include: [
        { model: Buku, as: 'buku' },
        {
          model: Peminjaman,
          as: 'peminjaman',
          include: [
            { model: Anggota, as: 'anggota' },
            { model: Pengembalian, as: 'pengembalian' },
          ],
        },
        { model: Denda, as: 'denda' },
      ],
    });

    return res.status(200).json(formatBorrowRequest(fullDetail));
  } catch (error) {
    console.error('Request return error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const verifyReturn = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params; // id_detail (DetailPeminjaman ID)
    const adminId = req.user.id; // From admin JWT payload

    const detail = await DetailPeminjaman.findByPk(id, {
      include: [
        { model: Buku, as: 'buku' },
        {
          model: Peminjaman,
          as: 'peminjaman',
          include: [
            { model: Anggota, as: 'anggota' },
            { model: Pengembalian, as: 'pengembalian' },
          ]
        }
      ]
    });

    if (!detail) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Detail transaksi tidak ditemukan.' });
    }

    if (detail.peminjaman.status === 'returned') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Transaksi ini sudah selesai dikembalikan.' });
    }

    // Update book stock
    const book = detail.buku;
    await book.update({
      stok_tersedia: Math.min(book.stok_tersedia + 1, book.stok_maksimal),
    }, { transaction });

    // Calculate fine: Rp 5.000 per day overdue
    const today = new Date();
    const returnDateStr = today.toISOString().split('T')[0];
    const dueDate = new Date(detail.peminjaman.tanggal_jatuh_tempo);
    
    // Set hours to zero for clean day difference calculation
    today.setHours(0,0,0,0);
    dueDate.setHours(0,0,0,0);
    
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalDenda = diffDays > 0 ? diffDays * 5000 : 0;

    // Create Pengembalian record
    const newPengembalian = await Pengembalian.create({
      id_peminjaman: detail.id_peminjaman,
      id_admin: adminId,
      tanggal_kembali: returnDateStr,
      total_denda: totalDenda,
    }, { transaction });

    // Create Denda record if there is a fine
    if (totalDenda > 0) {
      await Denda.create({
        id_pengembalian: newPengembalian.id_pengembalian,
        id_detail: detail.id_detail,
        jumlah_denda: totalDenda,
        status_bayar: 'belum_bayar',
      }, { transaction });
    }

    // Update parent Peminjaman status to returned
    await detail.peminjaman.update({
      status: 'returned',
      id_admin: adminId, // Admin who processed return
    }, { transaction });

    await transaction.commit();

    // Fetch updated transaction details
    const fullDetail = await DetailPeminjaman.findByPk(id, {
      include: [
        { model: Buku, as: 'buku' },
        {
          model: Peminjaman,
          as: 'peminjaman',
          include: [
            { model: Anggota, as: 'anggota' },
            { model: Pengembalian, as: 'pengembalian' },
          ],
        },
        { model: Denda, as: 'denda' },
      ],
    });

    return res.status(200).json(formatBorrowRequest(fullDetail));

  } catch (error) {
    await transaction.rollback();
    console.error('Verify return error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const getDendaList = async (req, res) => {
  try {
    const list = await Denda.findAll({
      include: [
        {
          model: DetailPeminjaman,
          as: 'detail_peminjaman',
          include: [
            { model: Buku, as: 'buku' },
            {
              model: Peminjaman,
              as: 'peminjaman',
              include: [{ model: Anggota, as: 'anggota' }]
            }
          ]
        }
      ]
    });
    return res.status(200).json(list);
  } catch (error) {
    console.error('Get denda error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const bayarDenda = async (req, res) => {
  try {
    const { id } = req.params;
    const denda = await Denda.findByPk(id);
    if (!denda) {
      return res.status(404).json({ message: 'Data denda tidak ditemukan.' });
    }

    await denda.update({ status_bayar: 'lunas' });
    return res.status(200).json({ message: 'Denda berhasil dibayar.', denda });
  } catch (error) {
    console.error('Pay denda error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  requestReturn,
  verifyReturn,
  getDendaList,
  bayarDenda,
};
