import api from './api';
import type { LoginUser } from '@/app/models/auth/loginUser';

export const loginRequest = async (credentials: LoginUser) => {
  const response = await api.post('/api/login', credentials);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/api/user/profile');
  return response.data;
};

export const refreshToken = async (token: string) => {
  const response = await api.post('/api/token/refresh', { token });
  return response.data;
};
