import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export const usersService = {
  async getUsersFromReqRes(page: number = 1) {
    const response = await api.get(`/reqres/users?page=${page}`);
    return response.data;
  },

  async importUser(id: number) {
    const response = await api.post(`/users/import/${id}`);
    return response.data;
  },

  async getSavedUsers() {
    const response = await api.get('/users/saved');
    return response.data;
  },

  async getSavedUser(id: number) {
    const response = await api.get(`/users/saved/${id}`);
    return response.data;
  },
};

export default api;
