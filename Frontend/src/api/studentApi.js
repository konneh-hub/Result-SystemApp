import axiosInstance from './axiosInstance';

export const studentApi = {
  getAll: (params) =>
    axiosInstance.get('/students', { params }),

  getById: (id) =>
    axiosInstance.get(`/students/${id}`),

  create: (data) =>
    axiosInstance.post('/students', data),

  update: (id, data) =>
    axiosInstance.put(`/students/${id}`, data),

  delete: (id) =>
    axiosInstance.delete(`/students/${id}`),

  getRegisteredCourses: (studentId) =>
    axiosInstance.get(`/students/${studentId}/courses`),

  getResults: (studentId, params) =>
    axiosInstance.get(`/students/${studentId}/results`, { params }),

  getGPA: (studentId) =>
    axiosInstance.get(`/students/${studentId}/gpa`),

  getCGPA: (studentId) =>
    axiosInstance.get(`/students/${studentId}/cgpa`),

  getTranscript: (studentId) =>
    axiosInstance.get(`/students/${studentId}/transcript`),

  requestTranscript: (studentId, data) =>
    axiosInstance.post(`/students/${studentId}/transcript-request`, data),

  appealResult: (resultId, data) =>
    axiosInstance.post(`/results/${resultId}/appeal`, data),
};

export default studentApi;
