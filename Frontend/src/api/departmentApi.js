import axiosInstance from './axiosInstance';

export const departmentApi = {
  getAll: (params) =>
    axiosInstance.get('/departments', { params }),

  getById: (id) =>
    axiosInstance.get(`/departments/${id}`),

  create: (data) =>
    axiosInstance.post('/departments', data),

  update: (id, data) =>
    axiosInstance.put(`/departments/${id}`, data),

  delete: (id) =>
    axiosInstance.delete(`/departments/${id}`),

  getHOD: (departmentId) =>
    axiosInstance.get(`/departments/${departmentId}/hod`),

  assignHOD: (departmentId, staffId) =>
    axiosInstance.post(`/departments/${departmentId}/assign-hod`, { staffId }),

  getByFaculty: (facultyId, params) =>
    axiosInstance.get(`/faculties/${facultyId}/departments`, { params }),
};

export default departmentApi;
