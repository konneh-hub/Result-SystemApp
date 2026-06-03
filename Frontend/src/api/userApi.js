import axiosInstance from './axiosInstance';

export const userApi = {
  getAll: (params) =>
    axiosInstance.get('/users', { params }),

  getById: (id) =>
    axiosInstance.get(`/users/${id}`),

  create: (data) =>
    axiosInstance.post('/users', data),

  update: (id, data) =>
    axiosInstance.put(`/users/${id}`, data),

  delete: (id) =>
    axiosInstance.delete(`/users/${id}`),

  assignRole: (userId, role) =>
    axiosInstance.post(`/users/${userId}/assign-role`, { role }),

  getByRole: (role, params) =>
    axiosInstance.get(`/users/role/${role}`, { params }),

  grantPermission: (userId, permission) =>
    axiosInstance.post(`/users/${userId}/grant-permission`, { permission }),

  revokePermission: (userId, permission) =>
    axiosInstance.delete(`/users/${userId}/permissions/${permission}`),
};

export default userApi;
