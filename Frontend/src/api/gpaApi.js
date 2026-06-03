import axiosInstance from './axiosInstance';

export const gpaApi = {
  calculateGPA: (studentId, semester) =>
    axiosInstance.post(`/gpa/calculate`, { studentId, semester }),

  calculateCGPA: (studentId) =>
    axiosInstance.post(`/gpa/cgpa/calculate`, { studentId }),

  getGPA: (studentId, params) =>
    axiosInstance.get(`/gpa/${studentId}`, { params }),

  getCGPA: (studentId) =>
    axiosInstance.get(`/gpa/${studentId}/cgpa`),

  processGPA: (data) =>
    axiosInstance.post('/gpa/process', data),

  getDepartmentGPA: (departmentId, params) =>
    axiosInstance.get(`/gpa/department/${departmentId}`, { params }),

  getFacultyGPA: (facultyId, params) =>
    axiosInstance.get(`/gpa/faculty/${facultyId}`, { params }),
};

export default gpaApi;
