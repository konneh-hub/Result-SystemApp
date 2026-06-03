// JWT Token Management
export const getToken = () => {
  return localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(import.meta.env.VITE_JWT_STORAGE_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(import.meta.env.VITE_JWT_STORAGE_KEY);
};

export const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// CSV Export
export const exportToCSV = (data, filename = 'export.csv') => {
  const headers = Object.keys(data[0] || {});
  const csv = [
    headers.join(','),
    ...data.map((row) => headers.map((header) => JSON.stringify(row[header])).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};

// Format Date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

// Format Currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format Percentage
export const formatPercentage = (value) => {
  return `${(parseFloat(value) * 100).toFixed(2)}%`;
};

// Truncate Text
export const truncateText = (text, length = 50) => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

// Get Role Display Name
export const getRoleDisplayName = (role) => {
  const roleMap = {
    admin: 'Administrator',
    lecturer: 'Lecturer',
    hod: 'Head of Department',
    dean: 'Dean',
    exam_officer: 'Exam Officer',
    student: 'Student',
  };
  return roleMap[role] || role;
};

// Grade Calculator
export const calculateGrade = (score) => {
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  return 'F';
};

// GPA Calculator
export const calculateGPA = (grades) => {
  const gradePoints = {
    A: 4.0,
    B: 3.0,
    C: 2.0,
    D: 1.0,
    F: 0.0,
  };

  const totalPoints = grades.reduce((sum, grade) => sum + (gradePoints[grade] || 0), 0);
  return (totalPoints / grades.length).toFixed(2);
};
