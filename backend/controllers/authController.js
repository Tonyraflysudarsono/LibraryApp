const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, Anggota } = require('../models');

const login = async (req, res) => {
  try {
    const { username, password } = req.body; // username could be admin username or member's no_identitas
    if (!username || !password) {
      return res.status(400).json({ message: 'Username/ID and password are required.' });
    }

    // Try finding admin
    let user = await Admin.findOne({ where: { username } });
    let role = 'admin';

    // If not admin, try finding member
    if (!user) {
      user = await Anggota.findOne({ where: { no_identitas: username } });
      role = 'member';
    }

    if (!user) {
      return res.status(401).json({ message: 'ID atau kata sandi salah.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'ID atau kata sandi salah.' });
    }

    // Check status if member
    if (role === 'member' && user.status_anggota === 'inactive') {
      return res.status(403).json({ message: 'Akun Anda dinonaktifkan oleh administrator.' });
    }

    // Generate token
    const tokenPayload = {
      id: role === 'admin' ? user.id_admin : user.id_anggota,
      uid: role === 'admin' ? user.username : user.no_identitas,
      name: role === 'admin' ? user.nama_admin : user.nama_anggota,
      email: user.email,
      role,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'supersecretkeyatmalibrary123',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      message: 'Login berhasil.',
      token,
      user: {
        id: tokenPayload.uid, // MEM001 / ADM001 for frontend consistency
        dbId: tokenPayload.id, // Database auto-increment ID
        name: tokenPayload.name,
        email: tokenPayload.email,
        role: tokenPayload.role,
        status: role === 'member' ? user.status_anggota : 'active',
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Generate member ID (e.g. MEM004 or count-based)
    const count = await Anggota.count();
    const nextNum = String(count + 1).padStart(3, '0');
    const no_identitas = `MEM${nextNum}`;

    // Check if email already exists
    const existing = await Anggota.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newMember = await Anggota.create({
      nama_anggota: name,
      no_identitas,
      email,
      telepon: phone,
      password: hashedPassword,
      status_anggota: 'active',
    });

    return res.status(201).json({
      message: 'Registrasi berhasil.',
      user: {
        id: newMember.no_identitas,
        name: newMember.nama_anggota,
        email: newMember.email,
        role: 'member',
        status: newMember.status_anggota,
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const getMe = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role === 'admin') {
      const admin = await Admin.findByPk(id);
      if (!admin) return res.status(404).json({ message: 'User tidak ditemukan.' });
      return res.status(200).json({
        id: admin.username,
        dbId: admin.id_admin,
        name: admin.nama_admin,
        email: admin.email,
        role: 'admin',
        status: 'active',
      });
    } else {
      const member = await Anggota.findByPk(id);
      if (!member) return res.status(404).json({ message: 'User tidak ditemukan.' });
      return res.status(200).json({
        id: member.no_identitas,
        dbId: member.id_anggota,
        name: member.nama_anggota,
        email: member.email,
        phone: member.telepon,
        role: 'member',
        status: member.status_anggota,
      });
    }
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = {
  login,
  register,
  getMe,
};
