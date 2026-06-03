import axiosInstance from './axiosInstance';

export const staffApi = {
  getAll: (params) =>
    axiosInstance.get('/staff', { params }),

  getById: (id) =>
    axiosInstance.get(`/staff/${id}`),

  create: (data) =>
    axiosInstance.post('/staff', data),

  update: (id, data) =>
    axiosInstance.put(`/staff/${id}`, data),

  delete: (id) =>
    axiosInstance.delete(`/staff/${id}`),

  getLecturers: (params) =>
    axiosInstance.get('/staff/lecturers', { params }),

  getByDepartment: (departmentId, params) =>
    axiosInstance.get(`/departments/${departmentId}/staff`, { params }),

  assignCourse: (staffId, courseId) =>
    axiosInstance.post(`/staff/${staffId}/assign-course`, { courseId }),

  removeCourse: (staffId, courseId) =>
    axiosInstance.delete(`/staff/${staffId}/courses/${courseId}`),
};

export default staffApi;
