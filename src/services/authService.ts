import api from './api';

export interface AuthUser {
  id: string; // e.g. MEM001 or ADM001
  dbId: number;
  name: string;
  email: string;
  phone?: string;
  role: 'member' | 'admin';
  status: 'active' | 'inactive';
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('lib_token', response.data.token);
      localStorage.setItem('lib_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (name: string, email: string, phone: string, password: string): Promise<{ message: string; user: any }> => {
    const response = await api.post('/auth/register', { name, email, phone, password });
    return response.data;
  },

  getProfile: async (): Promise<AuthUser> => {
    const response = await api.get<AuthUser>('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('lib_token');
    localStorage.removeItem('lib_user');
  },

  getCurrentUser: (): AuthUser | null => {
    const userStr = localStorage.getItem('lib_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as AuthUser;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('lib_token');
  }
};
