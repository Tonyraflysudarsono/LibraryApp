const { Buku, Kategori } = require('../models');
const { Op } = require('sequelize');

const formatBook = (book) => ({
  id: book.id_buku.toString(),
  dbId: book.id_buku,
  title: book.judul,
  author: book.pengarang,
  publisher: book.penerbit,
  category: book.kategori ? book.kategori.nama_kategori : '',
  id_kategori: book.id_kategori,
  year: book.tahun,
  stock: book.stok_tersedia,
  maxStock: book.stok_maksimal,
  description: book.deskripsi,
  coverSeed: book.cover_seed,
  kode_buku: book.kode_buku,
});

const getAllBuku = async (req, res) => {
  try {
    const { search, category } = req.query;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { judul: { [Op.like]: `%${search}%` } },
        { pengarang: { [Op.like]: `%${search}%` } },
        { penerbit: { [Op.like]: `%${search}%` } },
        { kode_buku: { [Op.like]: `%${search}%` } },
      ];
    }

    const includeClause = [{
      model: Kategori,
      as: 'kategori',
    }];

    if (category) {
      includeClause[0].where = { nama_kategori: category };
    }

    const books = await Buku.findAll({
      where: whereClause,
      include: includeClause,
      order: [['id_buku', 'ASC']],
    });

    const formattedBooks = books.map(formatBook);
    return res.status(200).json(formattedBooks);
  } catch (error) {
    console.error('Get all books error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const getBukuById = async (req, res) => {
  try {
    const book = await Buku.findByPk(req.params.id, {
      include: [{ model: Kategori, as: 'kategori' }],
    });

    if (!book) {
      return res.status(404).json({ message: 'Buku tidak ditemukan.' });
    }

    return res.status(200).json(formatBook(book));
  } catch (error) {
    console.error('Get book error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const createBuku = async (req, res) => {
  try {
    const { title, author, publisher, category, year, stock, maxStock, description, coverSeed, kode_buku } = req.body;

    if (!title || !author || !category || stock === undefined || maxStock === undefined) {
      return res.status(400).json({ message: 'Field judul, pengarang, kategori, stok, dan stok maksimal wajib diisi.' });
    }

    // Resolve category name to id_kategori
    let cat = await Kategori.findOne({ where: { nama_kategori: category } });
    if (!cat) {
      cat = await Kategori.create({
        nama_kategori: category,
        deskripsi: `Kategori untuk ${category}`,
      });
    }

    // Generate unique kode_buku if not provided
    let finalKode = kode_buku;
    if (!finalKode) {
      const count = await Buku.count();
      finalKode = `${category.substring(0, 3).toUpperCase()}-${String(count + 1).padStart(4, '0')}`;
    }

    // Generate default cover seed if not provided
    const finalCoverSeed = coverSeed || title.toLowerCase().replace(/[^a-z0-9]/g, '');

    const newBook = await Buku.create({
      id_kategori: cat.id_kategori,
      kode_buku: finalKode,
      judul: title,
      pengarang: author,
      penerbit: publisher || 'Unknown Publisher',
      tahun: year || new Date().getFullYear(),
      stok_tersedia: stock,
      stok_maksimal: maxStock,
      deskripsi: description || '',
      cover_seed: finalCoverSeed,
    });

    const fullBook = await Buku.findByPk(newBook.id_buku, {
      include: [{ model: Kategori, as: 'kategori' }],
    });

    return res.status(201).json(formatBook(fullBook));
  } catch (error) {
    console.error('Create book error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const updateBuku = async (req, res) => {
  try {
    const { title, author, publisher, category, year, stock, maxStock, description, coverSeed, kode_buku } = req.body;

    const book = await Buku.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Buku tidak ditemukan.' });
    }

    const updates = {};

    if (category) {
      let cat = await Kategori.findOne({ where: { nama_kategori: category } });
      if (!cat) {
        cat = await Kategori.create({
          nama_kategori: category,
          deskripsi: `Kategori untuk ${category}`,
        });
      }
      updates.id_kategori = cat.id_kategori;
    }

    if (title !== undefined) updates.judul = title;
    if (author !== undefined) updates.pengarang = author;
    if (publisher !== undefined) updates.penerbit = publisher;
    if (year !== undefined) updates.tahun = year;
    if (stock !== undefined) updates.stok_tersedia = stock;
    if (maxStock !== undefined) updates.stok_maksimal = maxStock;
    if (description !== undefined) updates.deskripsi = description;
    if (coverSeed !== undefined) updates.cover_seed = coverSeed;
    if (kode_buku !== undefined) updates.kode_buku = kode_buku;

    await book.update(updates);

    const fullBook = await Buku.findByPk(book.id_buku, {
      include: [{ model: Kategori, as: 'kategori' }],
    });

    return res.status(200).json(formatBook(fullBook));
  } catch (error) {
    console.error('Update book error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const deleteBuku = async (req, res) => {
  try {
    const book = await Buku.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Buku tidak ditemukan.' });
    }

    await book.destroy();
    return res.status(200).json({ message: 'Buku berhasil dihapus.', id: req.params.id });
  } catch (error) {
    console.error('Delete book error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = {
  getAllBuku,
  getBukuById,
  createBuku,
  updateBuku,
  deleteBuku,
};
