import api from './api';

export const getInspections = async (params?: Record<string, unknown>) => {
  const response = await api.get('/api/inspections', { params });
  return response.data;
};

export const getInspectionById = async (id: string) => {
  const response = await api.get(`/api/inspections/${encodeURIComponent(id)}`);
  return response.data;
};

export const createInspection = async (data: unknown) => {
  const response = await api.post('/api/inspections', data);
  return response.data;
};

export const updateInspection = async (id: string, data: unknown) => {
  const response = await api.put(`/api/inspections/${encodeURIComponent(id)}`, data);
  return response.data;
};
