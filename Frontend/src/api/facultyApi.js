import axiosInstance from './axiosInstance';

export const facultyApi = {
  getAll: (params) =>
    axiosInstance.get('/faculties', { params }),

  getById: (id) =>
    axiosInstance.get(`/faculties/${id}`),

  create: (data) =>
    axiosInstance.post('/faculties', data),

  update: (id, data) =>
    axiosInstance.put(`/faculties/${id}`, data),

  delete: (id) =>
    axiosInstance.delete(`/faculties/${id}`),

  getDean: (facultyId) =>
    axiosInstance.get(`/faculties/${facultyId}/dean`),

  assignDean: (facultyId, staffId) =>
    axiosInstance.post(`/faculties/${facultyId}/assign-dean`, { staffId }),

  getDepartments: (facultyId, params) =>
    axiosInstance.get(`/faculties/${facultyId}/departments`, { params }),

  getStats: (facultyId) =>
    axiosInstance.get(`/faculties/${facultyId}/stats`),
};

export default facultyApi;
