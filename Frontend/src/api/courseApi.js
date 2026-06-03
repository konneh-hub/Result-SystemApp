import axiosInstance from './axiosInstance';

export const courseApi = {
  getAll: (params) =>
    axiosInstance.get('/courses', { params }),

  getById: (id) =>
    axiosInstance.get(`/courses/${id}`),

  create: (data) =>
    axiosInstance.post('/courses', data),

  update: (id, data) =>
    axiosInstance.put(`/courses/${id}`, data),

  delete: (id) =>
    axiosInstance.delete(`/courses/${id}`),

  getStudents: (courseId, params) =>
    axiosInstance.get(`/courses/${courseId}/students`, { params }),

  enrollStudent: (courseId, studentId) =>
    axiosInstance.post(`/courses/${courseId}/enroll`, { studentId }),

  removeStudent: (courseId, studentId) =>
    axiosInstance.delete(`/courses/${courseId}/students/${studentId}`),

  getByDepartment: (departmentId, params) =>
    axiosInstance.get(`/departments/${departmentId}/courses`, { params }),

  getByLecturer: (lecturerId, params) =>
    axiosInstance.get(`/lecturers/${lecturerId}/courses`, { params }),
};

export default courseApi;
