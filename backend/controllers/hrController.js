const { Karyawan, Kehadiran, sequelize } = require('../models');
const { Op } = require('sequelize');

// Karyawan (CRUD)
const getAllKaryawan = async (req, res) => {
  try {
    const list = await Karyawan.findAll({ order: [['nama_karyawan', 'ASC']] });
    return res.status(200).json(list);
  } catch (error) {
    console.error('Get all karyawan error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const createKaryawan = async (req, res) => {
  try {
    const { name, nip, email, phone, role, department, joinDate, status, salary } = req.body;

    if (!name || !nip || !email || !role || !department || !joinDate) {
      return res.status(400).json({ message: 'Nama, NIP, Email, Jabatan, Departemen, dan Tanggal Masuk wajib diisi.' });
    }

    const existing = await Karyawan.findOne({ where: { nip } });
    if (existing) {
      return res.status(400).json({ message: 'NIP sudah terdaftar.' });
    }

    const employee = await Karyawan.create({
      nama_karyawan: name,
      nip,
      email,
      telepon: phone || '',
      jabatan: role,
      departemen: department,
      tanggal_masuk: joinDate,
      status: status || 'active',
      gaji: salary || 0.00,
    });

    return res.status(201).json(employee);
  } catch (error) {
    console.error('Create karyawan error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const updateKaryawan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nip, email, phone, role, department, joinDate, status, salary } = req.body;

    const employee = await Karyawan.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Karyawan tidak ditemukan.' });
    }

    const updates = {};
    if (name !== undefined) updates.nama_karyawan = name;
    if (nip !== undefined) {
      if (nip !== employee.nip) {
        const existing = await Karyawan.findOne({ where: { nip } });
        if (existing) {
          return res.status(400).json({ message: 'NIP sudah terdaftar.' });
        }
      }
      updates.nip = nip;
    }
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.telepon = phone;
    if (role !== undefined) updates.jabatan = role;
    if (department !== undefined) updates.departemen = department;
    if (joinDate !== undefined) updates.tanggal_masuk = joinDate;
    if (status !== undefined) updates.status = status;
    if (salary !== undefined) updates.gaji = salary;

    await employee.update(updates);
    return res.status(200).json(employee);
  } catch (error) {
    console.error('Update karyawan error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const deleteKaryawan = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Karyawan.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Karyawan tidak ditemukan.' });
    }

    // Delete attendance records first
    await Kehadiran.destroy({ where: { id_karyawan: id } });
    await employee.destroy();

    return res.status(200).json({ message: 'Karyawan berhasil dihapus.', id });
  } catch (error) {
    console.error('Delete karyawan error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// Kehadiran
const getKehadiran = async (req, res) => {
  try {
    const { tanggal } = req.query;
    const filterDate = tanggal || new Date().toISOString().split('T')[0];

    const attendance = await Kehadiran.findAll({
      where: { tanggal: filterDate },
      include: [{
        model: Karyawan,
        as: 'karyawan',
      }],
      order: [['id_kehadiran', 'ASC']],
    });

    return res.status(200).json(attendance);
  } catch (error) {
    console.error('Get kehadiran error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const recordKehadiran = async (req, res) => {
  try {
    const { id_karyawan, tanggal, jam_masuk, jam_keluar, status, keterangan } = req.body;

    if (!id_karyawan || !tanggal || !status) {
      return res.status(400).json({ message: 'ID Karyawan, Tanggal, dan Status Kehadiran wajib diisi.' });
    }

    // Check if employee exists
    const employee = await Karyawan.findByPk(id_karyawan);
    if (!employee) {
      return res.status(404).json({ message: 'Karyawan tidak ditemukan.' });
    }

    // Find or create attendance record for this employee and date
    let [record, created] = await Kehadiran.findOrCreate({
      where: { id_karyawan, tanggal },
      defaults: {
        jam_masuk: jam_masuk || null,
        jam_keluar: jam_keluar || null,
        status,
        keterangan: keterangan || '',
      },
    });

    if (!created) {
      // If it already exists, update it
      const updates = { status };
      if (jam_masuk !== undefined) updates.jam_masuk = jam_masuk;
      if (jam_keluar !== undefined) updates.jam_keluar = jam_keluar;
      if (keterangan !== undefined) updates.keterangan = keterangan;

      await record.update(updates);
    }

    // Retrieve full record with Karyawan details
    const fullRecord = await Kehadiran.findByPk(record.id_kehadiran, {
      include: [{ model: Karyawan, as: 'karyawan' }]
    });

    return res.status(200).json({
      message: created ? 'Kehadiran berhasil dicatat.' : 'Kehadiran berhasil diperbarui.',
      kehadiran: fullRecord
    });

  } catch (error) {
    console.error('Record kehadiran error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// HR Stats
const getHRStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalEmployees = await Karyawan.count({
      where: {
        status: { [Op.in]: ['active', 'cuti'] }
      }
    });

    // Count present today
    const presentToday = await Kehadiran.count({
      where: {
        tanggal: today,
        status: 'hadir'
      }
    });

    // Count on leave today (either employee status is 'cuti' or attendance status is 'izin' or 'sakit')
    const employeesWithCutiStatus = await Karyawan.count({
      where: { status: 'cuti' }
    });

    const attendanceOnLeave = await Kehadiran.count({
      where: {
        tanggal: today,
        status: { [Op.in]: ['izin', 'sakit'] }
      }
    });

    // We can take the max or sum them reasonably
    const totalOnLeave = Math.max(employeesWithCutiStatus, attendanceOnLeave);

    // Sum monthly salary for active employees
    const salarySum = await Karyawan.sum('gaji', {
      where: { status: 'active' }
    });

    return res.status(200).json({
      totalEmployees,
      presentToday,
      onLeave: totalOnLeave,
      totalPayroll: salarySum || 0.00,
    });
  } catch (error) {
    console.error('Get HR stats error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = {
  getAllKaryawan,
  createKaryawan,
  updateKaryawan,
  deleteKaryawan,
  getKehadiran,
  recordKehadiran,
  getHRStats,
};
