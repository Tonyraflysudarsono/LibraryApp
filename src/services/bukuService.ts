import api from './api';

export interface Book {
  id: string; // string type for React key/props compatibility
  dbId: number; // raw DB ID
  title: string;
  author: string;
  publisher: string;
  category: string; // Kategori name (e.g., 'Design')
  id_kategori: number;
  year: number;
  stock: number;
  maxStock: number;
  description: string;
  coverSeed: string;
  kode_buku: string;
}

export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
  deskripsi: string;
}

export const bukuService = {
  getAllBooks: async (search?: string, category?: string): Promise<Book[]> => {
    const params: any = {};
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;
    const response = await api.get<Book[]>('/buku', { params });
    return response.data;
  },

  getBookById: async (id: string | number): Promise<Book> => {
    const response = await api.get<Book>(`/buku/${id}`);
    return response.data;
  },

  createBook: async (bookData: Partial<Book>): Promise<Book> => {
    const response = await api.post<Book>('/buku', bookData);
    return response.data;
  },

  updateBook: async (id: string | number, bookData: Partial<Book>): Promise<Book> => {
    const response = await api.put<Book>(`/buku/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id: string | number): Promise<{ message: string; id: any }> => {
    const response = await api.delete(`/buku/${id}`);
    return response.data;
  },

  getAllCategories: async (): Promise<Kategori[]> => {
    const response = await api.get<Kategori[]>('/kategori');
    return response.data;
  },

  createCategory: async (nama_kategori: string, deskripsi?: string): Promise<Kategori> => {
    const response = await api.post<Kategori>('/kategori', { nama_kategori, deskripsi });
    return response.data;
  }
};
