import axiosInstance from './axiosInstance';

export const adminApi = {
  getDashboardStats: () =>
    axiosInstance.get('/admin/dashboard/stats'),

  getStudentsStats: (params) =>
    axiosInstance.get('/admin/students/stats', { params }),

  getStaffStats: (params) =>
    axiosInstance.get('/admin/staff/stats', { params }),

  getCoursesStats: (params) =>
    axiosInstance.get('/admin/courses/stats', { params }),

  getResultsStats: (params) =>
    axiosInstance.get('/admin/results/stats', { params }),

  getDepartmentsStats: (params) =>
    axiosInstance.get('/admin/departments/stats', { params }),

  getFacultiesStats: (params) =>
    axiosInstance.get('/admin/faculties/stats', { params }),

  getSystemLogs: (params) =>
    axiosInstance.get('/admin/logs', { params }),

  getAuditLogs: (params) =>
    axiosInstance.get('/admin/audit-logs', { params }),

  getSystemSettings: () =>
    axiosInstance.get('/admin/settings'),

  updateSystemSettings: (data) =>
    axiosInstance.put('/admin/settings', data),

  generateReport: (type, params) =>
    axiosInstance.post(`/admin/reports/${type}`, params),

  exportData: (type, format) =>
    axiosInstance.get(`/admin/export/${type}`, { params: { format } }),
};

export default adminApi;
