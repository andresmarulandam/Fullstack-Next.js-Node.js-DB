import axios, { InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.url?.includes('/auth/login')) {
    return config;
  }

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

const MOCK_USERS = {
  page: 1,
  per_page: 6,
  total: 12,
  total_pages: 2,
  data: [
    {
      id: 1,
      email: 'george.bluth@reqres.in',
      first_name: 'George',
      last_name: 'Bluth',
      avatar: 'https://reqres.in/img/faces/1-image.jpg',
    },
    {
      id: 2,
      email: 'janet.weaver@reqres.in',
      first_name: 'Janet',
      last_name: 'Weaver',
      avatar: 'https://reqres.in/img/faces/2-image.jpg',
    },
    {
      id: 3,
      email: 'emma.wong@reqres.in',
      first_name: 'Emma',
      last_name: 'Wong',
      avatar: 'https://reqres.in/img/faces/3-image.jpg',
    },
    {
      id: 4,
      email: 'eve.holt@reqres.in',
      first_name: 'Eve',
      last_name: 'Holt',
      avatar: 'https://reqres.in/img/faces/4-image.jpg',
    },
    {
      id: 5,
      email: 'charles.morris@reqres.in',
      first_name: 'Charles',
      last_name: 'Morris',
      avatar: 'https://reqres.in/img/faces/5-image.jpg',
    },
    {
      id: 6,
      email: 'tracey.ramos@reqres.in',
      first_name: 'Tracey',
      last_name: 'Ramos',
      avatar: 'https://reqres.in/img/faces/6-image.jpg',
    },
  ],
};

export const usersService = {
  async getUsersFromReqRes(page: number = 1) {
    const start = (page - 1) * 6;
    const end = start + 6;
    const paginatedData = MOCK_USERS.data.slice(start, end);

    return {
      page,
      per_page: 6,
      total: 12,
      total_pages: 2,
      data: paginatedData,
    };
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

  async deleteSavedUser(id: number) {
    const response = await api.delete(`/users/saved/${id}`);
    return response.data;
  },
};

export const postsService = {
  async getAllPosts() {
    const response = await api.get('/posts');
    return response.data;
  },

  async getPost(id: number) {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  async createPost(data: {
    title: string;
    content: string;
    author_id: number;
  }) {
    const response = await api.post('/posts', data);
    return response.data;
  },

  async updatePost(id: number, data: { title?: string; content?: string }) {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  async deletePost(id: number) {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  async getPostsByAuthor(authorId: number) {
    const response = await api.get(`/posts/author/${authorId}`);
    return response.data;
  },
};

export default api;
