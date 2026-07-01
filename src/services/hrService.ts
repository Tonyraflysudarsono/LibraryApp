import api from './api';

export interface Employee {
  id_karyawan: number;
  nama_karyawan: string;
  nip: string;
  email: string;
  telepon: string;
  jabatan: string; // jabatan maps to role in stats
  departemen: string;
  tanggal_masuk: string;
  status: 'active' | 'inactive' | 'cuti';
  gaji: string | number;
}

export interface AttendanceRecord {
  id_kehadiran: number;
  id_karyawan: number;
  tanggal: string;
  jam_masuk: string | null;
  jam_keluar: string | null;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  keterangan: string | null;
  karyawan?: Employee;
}

export interface HRStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  totalPayroll: number;
}

export const hrService = {
  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await api.get<Employee[]>('/hr/karyawan');
    return response.data;
  },

  createEmployee: async (employeeData: {
    name: string;
    nip: string;
    email: string;
    phone?: string;
    role: string;
    department: string;
    joinDate: string;
    status?: 'active' | 'inactive' | 'cuti';
    salary?: number;
  }): Promise<Employee> => {
    const response = await api.post<Employee>('/hr/karyawan', employeeData);
    return response.data;
  },

  updateEmployee: async (id: number, employeeData: {
    name?: string;
    nip?: string;
    email?: string;
    phone?: string;
    role?: string;
    department?: string;
    joinDate?: string;
    status?: 'active' | 'inactive' | 'cuti';
    salary?: number;
  }): Promise<Employee> => {
    const response = await api.put<Employee>(`/hr/karyawan/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id: number): Promise<{ message: string; id: any }> => {
    const response = await api.delete(`/hr/karyawan/${id}`);
    return response.data;
  },

  getAttendance: async (tanggal?: string): Promise<AttendanceRecord[]> => {
    const params: any = {};
    if (tanggal) params.tanggal = tanggal;
    const response = await api.get<AttendanceRecord[]>('/hr/kehadiran', { params });
    return response.data;
  },

  recordAttendance: async (attendanceData: {
    id_karyawan: number;
    tanggal: string;
    jam_masuk?: string | null;
    jam_keluar?: string | null;
    status: 'hadir' | 'izin' | 'sakit' | 'alpha';
    keterangan?: string;
  }): Promise<{ message: string; kehadiran: AttendanceRecord }> => {
    const response = await api.post<{ message: string; kehadiran: AttendanceRecord }>('/hr/kehadiran', attendanceData);
    return response.data;
  },

  getHRStats: async (): Promise<HRStats> => {
    const response = await api.get<HRStats>('/hr/stats');
    return response.data;
  }
};
