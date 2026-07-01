const bcrypt = require('bcryptjs');
const { Anggota } = require('../models');

const formatMember = (member) => ({
  id: member.no_identitas,
  dbId: member.id_anggota,
  name: member.nama_anggota,
  email: member.email,
  phone: member.telepon,
  joinDate: member.createdAt ? member.createdAt.toISOString().split('T')[0] : '',
  status: member.status_anggota,
});

const getAllAnggota = async (req, res) => {
  try {
    const members = await Anggota.findAll({ order: [['id_anggota', 'ASC']] });
    const formatted = members.map(formatMember);
    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Get all members error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const createAnggota = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Field nama dan email wajib diisi.' });
    }

    // Check if email already exists
    const existing = await Anggota.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    // Auto generate MEM###
    const count = await Anggota.count();
    const nextNum = String(count + 1).padStart(3, '0');
    const no_identitas = `MEM${nextNum}`;

    // Default password to 'password' if not provided
    const rawPassword = password || 'password';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const newMember = await Anggota.create({
      nama_anggota: name,
      no_identitas,
      email,
      telepon: phone || '',
      password: hashedPassword,
      status_anggota: 'active',
    });

    return res.status(201).json(formatMember(newMember));
  } catch (error) {
    console.error('Create member error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const updateAnggota = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password, status } = req.body;

    // Check permissions: admin can update any, member can only update themselves
    const isSelf = req.user.role === 'member' && req.user.id == id;
    const isAdmin = req.user.role === 'admin';

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ message: 'Akses ditolak. Anda tidak memiliki izin.' });
    }

    const member = await Anggota.findByPk(id);
    if (!member) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan.' });
    }

    const updates = {};
    if (name !== undefined) updates.nama_anggota = name;
    if (email !== undefined) {
      // Check email uniqueness if modified
      if (email !== member.email) {
        const existing = await Anggota.findOne({ where: { email } });
        if (existing) {
          return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }
      }
      updates.email = email;
    }
    if (phone !== undefined) updates.telepon = phone;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }
    if (status !== undefined && isAdmin) {
      updates.status_anggota = status;
    }

    await member.update(updates);
    return res.status(200).json(formatMember(member));
  } catch (error) {
    console.error('Update member error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const toggleAnggotaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Anggota.findByPk(id);
    if (!member) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan.' });
    }

    const newStatus = member.status_anggota === 'active' ? 'inactive' : 'active';
    await member.update({ status_anggota: newStatus });

    return res.status(200).json(formatMember(member));
  } catch (error) {
    console.error('Toggle status error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = {
  getAllAnggota,
  createAnggota,
  updateAnggota,
  toggleAnggotaStatus,
};
