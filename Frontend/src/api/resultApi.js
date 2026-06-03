import axiosInstance from './axiosInstance';

export const resultApi = {
  getAll: (params) =>
    axiosInstance.get('/results', { params }),

  getById: (id) =>
    axiosInstance.get(`/results/${id}`),

  create: (data) =>
    axiosInstance.post('/results', data),

  update: (id, data) =>
    axiosInstance.put(`/results/${id}`, data),

  delete: (id) =>
    axiosInstance.delete(`/results/${id}`),

  uploadResults: (data) =>
    axiosInstance.post('/results/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  submitResults: (data) =>
    axiosInstance.post('/results/submit', data),

  getStudentResults: (studentId, params) =>
    axiosInstance.get(`/results/student/${studentId}`, { params }),

  getCourseResults: (courseId, params) =>
    axiosInstance.get(`/results/course/${courseId}`, { params }),

  approveResults: (data) =>
    axiosInstance.post('/results/approve', data),

  rejectResults: (id, data) =>
    axiosInstance.post(`/results/${id}/reject`, data),

  getForApproval: (params) =>
    axiosInstance.get('/results/pending-approval', { params }),

  publishResults: (data) =>
    axiosInstance.post('/results/publish', data),

  getPublished: (params) =>
    axiosInstance.get('/results/published', { params }),
};

export default resultApi;
