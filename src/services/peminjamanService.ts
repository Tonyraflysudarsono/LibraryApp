import api from './api';

export interface BorrowRequest {
  id: string; // DetailPeminjaman ID as string (frontend compatibility)
  dbId: number; // DetailPeminjaman ID
  peminjamanId: number;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  userId: string; // Anggota no_identitas (e.g. MEM001)
  userName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  fine?: number;
  status: 'borrowed' | 'pending_return' | 'returned';
}

export interface Denda {
  id_denda: number;
  id_pengembalian: number | null;
  id_detail: number;
  jumlah_denda: string | number;
  status_bayar: 'belum_bayar' | 'lunas';
  detail_peminjaman?: {
    buku?: {
      judul: string;
    };
    peminjaman?: {
      anggota?: {
        nama_anggota: string;
        no_identitas: string;
      }
    }
  }
}

export const peminjamanService = {
  getAllTransactions: async (userId?: string, status?: string): Promise<BorrowRequest[]> => {
    const params: any = {};
    if (userId) params.userId = userId;
    if (status) params.status = status;
    const response = await api.get<BorrowRequest[]>('/peminjaman', { params });
    return response.data;
  },

  createTransaction: async (userId: string, bookId: string | number): Promise<BorrowRequest> => {
    const response = await api.post<BorrowRequest>('/peminjaman', { userId, bookId });
    return response.data;
  },

  requestReturn: async (id_detail: string | number): Promise<BorrowRequest> => {
    const response = await api.patch<BorrowRequest>(`/peminjaman/${id_detail}/request-return`);
    return response.data;
  },

  verifyReturn: async (id_detail: string | number): Promise<BorrowRequest> => {
    const response = await api.post<BorrowRequest>(`/peminjaman/${id_detail}/verify`);
    return response.data;
  },

  getDendaList: async (): Promise<Denda[]> => {
    const response = await api.get<Denda[]>('/denda');
    return response.data;
  },

  bayarDenda: async (id_denda: string | number): Promise<{ message: string; denda: Denda }> => {
    const response = await api.patch<{ message: string; denda: Denda }>(`/denda/${id_denda}/bayar`);
    return response.data;
  }
};
