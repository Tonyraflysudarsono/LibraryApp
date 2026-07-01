const { Kategori } = require('../models');

const getAllKategori = async (req, res) => {
  try {
    const categories = await Kategori.findAll({ order: [['nama_kategori', 'ASC']] });
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const createKategori = async (req, res) => {
  try {
    const { nama_kategori, deskripsi } = req.body;
    if (!nama_kategori) {
      return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
    }

    const existing = await Kategori.findOne({ where: { nama_kategori } });
    if (existing) {
      return res.status(400).json({ message: 'Kategori sudah ada.' });
    }

    const category = await Kategori.create({
      nama_kategori,
      deskripsi: deskripsi || '',
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = {
  getAllKategori,
  createKategori,
};
