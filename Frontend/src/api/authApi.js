import axiosInstance from './axiosInstance';

export const authApi = {
  login: (credentials) =>
    axiosInstance.post('/auth/login', credentials),

  register: (userData) =>
    axiosInstance.post('/auth/register', userData),

  forgotPassword: (data) =>
    axiosInstance.post('/auth/forgot-password', data),

  resetPassword: (data) =>
    axiosInstance.post('/auth/reset-password', data),

  updateProfile: (userData) =>
    axiosInstance.put('/auth/profile', userData),

  changePassword: (data) =>
    axiosInstance.post('/auth/change-password', data),

  getProfile: () =>
    axiosInstance.get('/auth/profile'),
};

export default authApi;
