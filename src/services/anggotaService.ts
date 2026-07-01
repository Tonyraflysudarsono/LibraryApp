import api from './api';

export interface Member {
  id: string; // e.g. MEM001 (no_identitas)
  dbId: number; // raw DB ID (id_anggota)
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export const anggotaService = {
  getAllMembers: async (): Promise<Member[]> => {
    const response = await api.get<Member[]>('/anggota');
    return response.data;
  },

  createMember: async (memberData: { name: string; email: string; phone?: string; password?: string }): Promise<Member> => {
    const response = await api.post<Member>('/anggota', memberData);
    return response.data;
  },

  updateMember: async (dbId: number, memberData: Partial<Member> & { password?: string }): Promise<Member> => {
    const response = await api.put<Member>(`/anggota/${dbId}`, memberData);
    return response.data;
  },

  toggleMemberStatus: async (dbId: number): Promise<Member> => {
    const response = await api.patch<Member>(`/anggota/${dbId}/status`);
    return response.data;
  }
};
