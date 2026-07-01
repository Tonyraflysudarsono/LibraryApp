import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UsersThree, 
  CheckCircle, 
  Calendar, 
  Coins, 
  PencilSimple, 
  TrashSimple, 
  MagnifyingGlass, 
  UserPlus, 
  Clock, 
  X, 
  CalendarCheck,
  Funnel,
  IdentificationCard,
  Envelope,
  Phone,
  Briefcase,
  Buildings,
  CurrencyCircleDollar,
  Warning
} from '@phosphor-icons/react';
import { hrService } from '../../services/hrService';
import type { Employee, AttendanceRecord, HRStats } from '../../services/hrService';

export const AdminHR: React.FC = () => {
  // Tabs
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance'>('employees');

  // Employee State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Attendance State
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);

  // HR Stats State
  const [stats, setStats] = useState<HRStats>({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    totalPayroll: 0
  });

  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<{
    id_karyawan: number;
    name: string;
    nip: string;
    record?: AttendanceRecord;
  } | null>(null);

  // Form States (Employee)
  const [empForm, setEmpForm] = useState({
    name: '',
    nip: '',
    email: '',
    phone: '',
    role: '',
    department: 'Sirkulasi',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'inactive' | 'cuti',
    salary: 3500000
  });

  // Form States (Attendance)
  const [attForm, setAttForm] = useState({
    status: 'hadir' as 'hadir' | 'izin' | 'sakit' | 'alpha',
    jam_masuk: '08:00',
    jam_keluar: '16:00',
    keterangan: ''
  });

  // Fetch initial data
  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [empData, statsData] = await Promise.all([
        hrService.getAllEmployees(),
        hrService.getHRStats()
      ]);
      setEmployees(empData);
      setStats(statsData);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal memuat data karyawan/statistik.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAttendance = async (date: string) => {
    try {
      const attData = await hrService.getAttendance(date);
      setAttendanceList(attData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadAttendance(attendanceDate);
  }, [attendanceDate]);

  // Handle Employee Add/Edit
  const handleOpenEmployeeModal = (emp: Employee | null = null) => {
    if (emp) {
      setEditingEmployee(emp);
      setEmpForm({
        name: emp.nama_karyawan,
        nip: emp.nip,
        email: emp.email,
        phone: emp.telepon,
        role: emp.jabatan,
        department: emp.departemen,
        joinDate: emp.tanggal_masuk,
        status: emp.status,
        salary: Number(emp.gaji)
      });
    } else {
      setEditingEmployee(null);
      setEmpForm({
        name: '',
        nip: '',
        email: '',
        phone: '',
        role: '',
        department: 'Sirkulasi',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active' as const,
        salary: 3500000
      });
    }
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingEmployee) {
        await hrService.updateEmployee(editingEmployee.id_karyawan, {
          name: empForm.name,
          nip: empForm.nip,
          email: empForm.email,
          phone: empForm.phone,
          role: empForm.role,
          department: empForm.department,
          joinDate: empForm.joinDate,
          status: empForm.status,
          salary: empForm.salary
        });
      } else {
        await hrService.createEmployee({
          name: empForm.name,
          nip: empForm.nip,
          email: empForm.email,
          phone: empForm.phone,
          role: empForm.role,
          department: empForm.department,
          joinDate: empForm.joinDate,
          status: empForm.status,
          salary: empForm.salary
        });
      }
      setIsEmployeeModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Gagal menyimpan data karyawan.');
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data karyawan ini? Semua riwayat kehadiran juga akan terhapus.')) {
      try {
        await hrService.deleteEmployee(id);
        loadData();
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.message || 'Gagal menghapus karyawan.');
      }
    }
  };

  // Handle Attendance Update
  const handleOpenAttendanceModal = (emp: Employee) => {
    // Find if attendance record exists for this date
    const record = attendanceList.find(a => a.id_karyawan === emp.id_karyawan);
    setSelectedAttendance({
      id_karyawan: emp.id_karyawan,
      name: emp.nama_karyawan,
      nip: emp.nip,
      record
    });

    if (record) {
      setAttForm({
        status: record.status,
        jam_masuk: record.jam_masuk ? record.jam_masuk.substring(0, 5) : '08:00',
        jam_keluar: record.jam_keluar ? record.jam_keluar.substring(0, 5) : '16:00',
        keterangan: record.keterangan || ''
      });
    } else {
      setAttForm({
        status: 'hadir',
        jam_masuk: '08:00',
        jam_keluar: '16:00',
        keterangan: ''
      });
    }
    setIsAttendanceModalOpen(true);
  };

  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttendance) return;

    try {
      const isAbsent = ['izin', 'sakit', 'alpha'].includes(attForm.status);
      await hrService.recordAttendance({
        id_karyawan: selectedAttendance.id_karyawan,
        tanggal: attendanceDate,
        status: attForm.status,
        jam_masuk: isAbsent ? null : `${attForm.jam_masuk}:00`,
        jam_keluar: isAbsent || !attForm.jam_keluar ? null : `${attForm.jam_keluar}:00`,
        keterangan: attForm.keterangan
      });
      setIsAttendanceModalOpen(false);
      loadAttendance(attendanceDate);
      loadData(); // Reload stats since attendance affects presence count
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menyimpan kehadiran.');
    }
  };

  // Filter Employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.nama_karyawan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.nip.includes(searchQuery) ||
                          emp.jabatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.departemen === deptFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Calculate dynamic stats for selected attendance date
  const attStats = {
    hadir: attendanceList.filter(a => a.status === 'hadir').length,
    izin: attendanceList.filter(a => a.status === 'izin').length,
    sakit: attendanceList.filter(a => a.status === 'sakit').length,
    alpha: attendanceList.filter(a => a.status === 'alpha').length,
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Employees */}
        <div className="bg-white border border-[#EAEAEA] rounded-xl p-5 shadow-sm relative overflow-hidden flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#FA5A3C]/10 flex items-center justify-center text-[#FA5A3C] shrink-0">
            <UsersThree className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#808080] font-medium tracking-wide block uppercase">Total Karyawan</span>
            <span className="text-2xl font-bold text-[#1B1B1B] mt-0.5 block">{stats.totalEmployees}</span>
          </div>
        </div>

        {/* Present Today */}
        <div className="bg-white border border-[#EAEAEA] rounded-xl p-5 shadow-sm relative overflow-hidden flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#808080] font-medium tracking-wide block uppercase">Hadir Hari Ini</span>
            <span className="text-2xl font-bold text-[#1B1B1B] mt-0.5 block">{stats.presentToday}</span>
          </div>
        </div>

        {/* On Leave / Cuti */}
        <div className="bg-white border border-[#EAEAEA] rounded-xl p-5 shadow-sm relative overflow-hidden flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#808080] font-medium tracking-wide block uppercase">Cuti / Absen</span>
            <span className="text-2xl font-bold text-[#1B1B1B] mt-0.5 block">{stats.onLeave}</span>
          </div>
        </div>

        {/* Total Payroll */}
        <div className="bg-white border border-[#EAEAEA] rounded-xl p-5 shadow-sm relative overflow-hidden flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#808080] font-medium tracking-wide block uppercase">Anggaran Gaji</span>
            <span className="text-xl font-bold text-[#1B1B1B] mt-0.5 block">
              Rp {Number(stats.totalPayroll).toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-[#EAEAEA] gap-6">
        <button
          onClick={() => setActiveTab('employees')}
          className={`py-3 text-sm font-bold tracking-wide transition-all border-b-2 ${
            activeTab === 'employees'
              ? 'border-[#FA5A3C] text-[#FA5A3C]'
              : 'border-transparent text-[#6E6E6E] hover:text-[#1B1B1B]'
          }`}
        >
          Daftar Karyawan
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-3 text-sm font-bold tracking-wide transition-all border-b-2 ${
            activeTab === 'attendance'
              ? 'border-[#FA5A3C] text-[#FA5A3C]'
              : 'border-transparent text-[#6E6E6E] hover:text-[#1B1B1B]'
          }`}
        >
          Rekap Kehadiran
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'employees' ? (
        <div className="space-y-4">
          {/* Filters & Actions Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#EAEAEA] rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full md:w-64">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#808080]" />
                <input
                  type="text"
                  placeholder="Cari karyawan atau NIP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1B1B1B] placeholder-[#6E6E6E]/60 focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all"
                />
              </div>

              {/* Department Filter */}
              <div className="flex items-center gap-2 bg-[#F5F5F5] border border-[#D3D3D3] rounded-lg px-3 py-2">
                <Funnel className="w-3.5 h-3.5 text-[#808080]" />
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="bg-transparent text-xs text-[#1B1B1B] font-semibold border-none focus:outline-none"
                >
                  <option value="All">Semua Departemen</option>
                  <option value="Sirkulasi">Sirkulasi</option>
                  <option value="Referensi">Referensi</option>
                  <option value="IT">IT</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 bg-[#F5F5F5] border border-[#D3D3D3] rounded-lg px-3 py-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs text-[#1B1B1B] font-semibold border-none focus:outline-none"
                >
                  <option value="All">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                  <option value="cuti">Cuti</option>
                </select>
              </div>
            </div>

            {/* Add Employee Button */}
            <button
              onClick={() => handleOpenEmployeeModal(null)}
              className="bg-[#FA5A3C] hover:bg-[#E24A2D] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 btn-pressable shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Karyawan</span>
            </button>
          </div>

          {/* Employee Table */}
          <div className="bg-white border border-[#EAEAEA] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAEAEA] bg-[#F8F9FA] text-[10px] font-bold text-[#808080] uppercase tracking-wider">
                    <th className="py-4 px-6">NIP</th>
                    <th className="py-4 px-6">Nama Lengkap</th>
                    <th className="py-4 px-6">Jabatan / Dept</th>
                    <th className="py-4 px-6">Kontak</th>
                    <th className="py-4 px-6">Tgl Masuk</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA] text-xs">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#808080] font-medium font-mono">
                        <div className="w-6 h-6 border-2 border-[#FA5A3C] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Memuat data karyawan...
                      </td>
                    </tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#808080] font-medium font-mono">
                        Tidak ada data karyawan ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id_karyawan} className="hover:bg-[#FAF9F6] transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-[#6E6E6E]">
                          {emp.nip}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-[#1B1B1B]">{emp.nama_karyawan}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-[#1B1B1B]">{emp.jabatan}</div>
                          <div className="text-[10px] text-[#808080] font-bold uppercase mt-0.5">{emp.departemen}</div>
                        </td>
                        <td className="py-4 px-6 text-left">
                          <div className="text-[#6E6E6E] font-medium">{emp.email}</div>
                          {emp.telepon && <div className="text-[10px] text-[#808080] mt-0.5">{emp.telepon}</div>}
                        </td>
                        <td className="py-4 px-6 text-[#6E6E6E] font-medium">
                          {emp.tanggal_masuk}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            emp.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : emp.status === 'cuti'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {emp.status === 'active' ? 'aktif' : emp.status === 'cuti' ? 'cuti' : 'nonaktif'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEmployeeModal(emp)}
                            className="p-1.5 bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#D3D3D3] rounded-md text-[#6E6E6E] hover:text-[#1B1B1B] transition-colors"
                            title="Edit"
                          >
                            <PencilSimple className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp.id_karyawan)}
                            className="p-1.5 bg-[#F5F5F5] hover:bg-red-50 border border-[#D3D3D3] hover:border-red-200 rounded-md text-[#6E6E6E] hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <TrashSimple className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Attendance Date & Stats Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Date Select Card */}
            <div className="bg-white border border-[#EAEAEA] rounded-xl p-5 shadow-sm flex flex-col justify-center gap-3">
              <label className="text-[10px] font-bold text-[#808080] uppercase tracking-wider">Pilih Tanggal</label>
              <div className="relative">
                <CalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]" />
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-lg pl-10 pr-3 py-2.5 text-xs text-[#1B1B1B] font-bold focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Attendance Breakdowns */}
            <div className="bg-white border border-[#EAEAEA] rounded-xl p-5 shadow-sm lg:col-span-2 flex items-center justify-around">
              <div className="text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase block">Hadir</span>
                <span className="text-2xl font-bold text-emerald-700 mt-1 block">{attStats.hadir}</span>
              </div>
              <div className="w-px h-10 bg-[#EAEAEA]" />
              <div className="text-center">
                <span className="text-[10px] font-bold text-amber-500 uppercase block">Izin</span>
                <span className="text-2xl font-bold text-amber-600 mt-1 block">{attStats.izin}</span>
              </div>
              <div className="w-px h-10 bg-[#EAEAEA]" />
              <div className="text-center">
                <span className="text-[10px] font-bold text-amber-600 uppercase block">Sakit</span>
                <span className="text-2xl font-bold text-amber-700 mt-1 block">{attStats.sakit}</span>
              </div>
              <div className="w-px h-10 bg-[#EAEAEA]" />
              <div className="text-center">
                <span className="text-[10px] font-bold text-red-500 uppercase block">Alpha</span>
                <span className="text-2xl font-bold text-red-600 mt-1 block">{attStats.alpha}</span>
              </div>
            </div>
          </div>

          {/* Attendance Log Table */}
          <div className="bg-white border border-[#EAEAEA] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAEAEA] bg-[#F8F9FA] text-[10px] font-bold text-[#808080] uppercase tracking-wider">
                    <th className="py-4 px-6">NIP</th>
                    <th className="py-4 px-6">Nama Karyawan</th>
                    <th className="py-4 px-6">Jabatan / Dept</th>
                    <th className="py-4 px-6">Jam Masuk</th>
                    <th className="py-4 px-6">Jam Keluar</th>
                    <th className="py-4 px-6">Status Kehadiran</th>
                    <th className="py-4 px-6">Keterangan</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA] text-xs">
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#808080] font-medium font-mono">
                        Tidak ada data karyawan untuk mencatat kehadiran.
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp) => {
                      // Find attendance record for this employee
                      const record = attendanceList.find(a => a.id_karyawan === emp.id_karyawan);
                      return (
                        <tr key={emp.id_karyawan} className="hover:bg-[#FAF9F6] transition-colors">
                          <td className="py-4 px-6 font-mono text-[#6E6E6E]">
                            {emp.nip}
                          </td>
                          <td className="py-4 px-6 font-bold text-[#1B1B1B]">
                            {emp.nama_karyawan}
                          </td>
                          <td className="py-4 px-6 text-[#6E6E6E]">
                            <div>{emp.jabatan}</div>
                            <div className="text-[9px] font-bold text-[#808080] uppercase mt-0.5">{emp.departemen}</div>
                          </td>
                          <td className="py-4 px-6 font-mono font-medium text-[#1B1B1B]">
                            {record?.jam_masuk ? record.jam_masuk.substring(0, 5) : '—'}
                          </td>
                          <td className="py-4 px-6 font-mono font-medium text-[#1B1B1B]">
                            {record?.jam_keluar ? record.jam_keluar.substring(0, 5) : '—'}
                          </td>
                          <td className="py-4 px-6">
                            {record ? (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                record.status === 'hadir'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : record.status === 'sakit' || record.status === 'izin'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-red-50 text-red-700'
                              }`}>
                                {record.status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500">
                                Belum Absen
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-[#6E6E6E] italic max-w-xs truncate">
                            {record?.keterangan || '—'}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleOpenAttendanceModal(emp)}
                              className="bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#D3D3D3] text-[#1B1B1B] text-[10px] font-bold px-3 py-1.5 rounded-lg btn-pressable shadow-sm"
                            >
                              Edit Absen
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT EMPLOYEE */}
      <AnimatePresence>
        {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEmployeeModalOpen(false)}
              className="absolute inset-0 bg-[#1B1B1B]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white border border-[#D3D3D3] rounded-lg shadow-xl p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsEmployeeModalOpen(false)}
                className="absolute top-5 right-5 w-7 h-7 rounded-md bg-[#F5F5F5] hover:bg-[#E8E8E8] border border-[#D3D3D3] flex items-center justify-center text-[#6E6E6E] hover:text-[#1B1B1B] transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-display font-bold text-xl text-[#1B1B1B] mb-6">
                {editingEmployee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
              </h3>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-xs font-semibold flex items-center gap-2">
                  <Warning className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveEmployee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Nama Lengkap</label>
                    <div className="relative">
                      <IdentificationCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#808080]" />
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Rina Kusuma"
                        value={empForm.name}
                        onChange={e => setEmpForm({ ...empForm, name: e.target.value })}
                        className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md pl-9 pr-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* NIP */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">NIP (Nomor Induk Pegawai)</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 199201152024012001"
                      value={empForm.nip}
                      onChange={e => setEmpForm({ ...empForm, nip: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md px-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-mono"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Email</label>
                    <div className="relative">
                      <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#808080]" />
                      <input
                        type="email"
                        required
                        placeholder="karyawan@atmalibrary.org"
                        value={empForm.email}
                        onChange={e => setEmpForm({ ...empForm, email: e.target.value })}
                        className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md pl-9 pr-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Telepon / HP</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#808080]" />
                      <input
                        type="text"
                        placeholder="Contoh: 0812-3456-7890"
                        value={empForm.phone}
                        onChange={e => setEmpForm({ ...empForm, phone: e.target.value })}
                        className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md pl-9 pr-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Jabatan (Role) */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Jabatan</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#808080]" />
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Pustakawan Muda"
                        value={empForm.role}
                        onChange={e => setEmpForm({ ...empForm, role: e.target.value })}
                        className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md pl-9 pr-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Departemen</label>
                    <div className="relative">
                      <Buildings className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#808080]" />
                      <select
                        value={empForm.department}
                        onChange={e => setEmpForm({ ...empForm, department: e.target.value })}
                        className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md pl-9 pr-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                      >
                        <option value="Sirkulasi">Sirkulasi</option>
                        <option value="Referensi">Referensi</option>
                        <option value="IT">IT</option>
                        <option value="Umum">Umum</option>
                      </select>
                    </div>
                  </div>

                  {/* Salary (Gaji) */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Gaji Bulanan (Rp)</label>
                    <div className="relative">
                      <CurrencyCircleDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#808080]" />
                      <input
                        type="number"
                        required
                        placeholder="Gaji dalam Rupiah..."
                        value={empForm.salary}
                        onChange={e => setEmpForm({ ...empForm, salary: Number(e.target.value) })}
                        className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md pl-9 pr-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Join Date */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Tanggal Masuk</label>
                    <input
                      type="date"
                      required
                      value={empForm.joinDate}
                      onChange={e => setEmpForm({ ...empForm, joinDate: e.target.value })}
                      className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md px-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5 text-left md:col-span-2">
                    <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Status Kepegawaian</label>
                    <div className="flex gap-4 mt-1">
                      {['active', 'inactive', 'cuti'].map(st => (
                        <label key={st} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            checked={empForm.status === st}
                            onChange={() => setEmpForm({ ...empForm, status: st as any })}
                            className="text-[#FA5A3C] focus:ring-[#FA5A3C]"
                          />
                          <span className="capitalize">{st === 'active' ? 'Aktif' : st === 'inactive' ? 'Nonaktif' : 'Cuti'}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[#EAEAEA] mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEmployeeModalOpen(false)}
                    className="px-4 py-2 border border-[#D3D3D3] rounded-lg text-xs font-bold text-[#6E6E6E] hover:bg-[#F5F5F5] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#FA5A3C] hover:bg-[#E24A2D] text-white text-xs font-bold rounded-lg transition-colors btn-pressable shadow-sm"
                  >
                    Simpan Data
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: RECORD / EDIT ATTENDANCE */}
      <AnimatePresence>
        {isAttendanceModalOpen && selectedAttendance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAttendanceModalOpen(false)}
              className="absolute inset-0 bg-[#1B1B1B]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white border border-[#D3D3D3] rounded-lg shadow-xl p-8 z-10"
            >
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="absolute top-5 right-5 w-7 h-7 rounded-md bg-[#F5F5F5] hover:bg-[#E8E8E8] border border-[#D3D3D3] flex items-center justify-center text-[#6E6E6E] hover:text-[#1B1B1B] transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-2 text-left">
                Catat Kehadiran
              </h3>
              <p className="text-[10px] text-[#6E6E6E] font-bold uppercase tracking-wider font-mono text-left mb-6">
                {selectedAttendance.name} ({selectedAttendance.nip}) <br/>
                Tanggal: <span className="text-[#FA5A3C]">{attendanceDate}</span>
              </p>

              <form onSubmit={handleSaveAttendance} className="space-y-4 text-left">
                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Status Kehadiran</label>
                  <select
                    value={attForm.status}
                    onChange={e => setAttForm({ ...attForm, status: e.target.value as any })}
                    className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md px-3 py-2 text-xs text-[#1B1B1B] font-bold focus:outline-none focus:border-[#FA5A3C] focus:bg-white"
                  >
                    <option value="hadir">Hadir</option>
                    <option value="izin">Izin</option>
                    <option value="sakit">Sakit</option>
                    <option value="alpha">Alpha</option>
                  </select>
                </div>

                {/* Clock-in / Clock-out (Show only if status is 'hadir') */}
                {attForm.status === 'hadir' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Jam Masuk</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
                        <input
                          type="time"
                          required
                          value={attForm.jam_masuk}
                          onChange={e => setAttForm({ ...attForm, jam_masuk: e.target.value })}
                          className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md pl-9 pr-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Jam Keluar</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
                        <input
                          type="time"
                          value={attForm.jam_keluar}
                          onChange={e => setAttForm({ ...attForm, jam_keluar: e.target.value })}
                          className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md pl-9 pr-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Keterangan */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#1B1B1B] tracking-wider uppercase block">Keterangan / Alasan</label>
                  <textarea
                    rows={3}
                    placeholder="Tulis keterangan cuti, izin terlambat, atau alasan sakit..."
                    value={attForm.keterangan}
                    onChange={e => setAttForm({ ...attForm, keterangan: e.target.value })}
                    className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md px-3 py-2 text-xs text-[#1B1B1B] placeholder-[#6E6E6E]/60 focus:outline-none focus:border-[#FA5A3C] focus:bg-white resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[#EAEAEA] mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAttendanceModalOpen(false)}
                    className="px-4 py-2 border border-[#D3D3D3] rounded-lg text-xs font-bold text-[#6E6E6E] hover:bg-[#F5F5F5] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#FA5A3C] hover:bg-[#E24A2D] text-white text-xs font-bold rounded-lg transition-colors btn-pressable shadow-sm"
                  >
                    Simpan Absensi
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
