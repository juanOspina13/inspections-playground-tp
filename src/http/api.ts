import axios from 'axios';
import { getEnvironment } from '@/environment';

const env = getEnvironment();

const api = axios.create({
  baseURL: env.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('user-token');
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  }
  return config;
});

export default api;
