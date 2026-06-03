const { query } = require('../config/db');
const { logAction } = require('../utils/logger');
const NotFoundError = require('../exceptions/NotFoundError');

const getStudents = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const students = await query(
    'SELECT * FROM students WHERE deleted_at IS NULL LIMIT ? OFFSET ?',
    [limit, offset]
  );
  const total = await query('SELECT COUNT(*) as count FROM students WHERE deleted_at IS NULL');
  return {
    students,
    pagination: { page, limit, total: total[0].count },
  };
};

const createStudent = async (studentData) => {
  const { student_number, first_name, last_name, email, department, faculty, level, session } = studentData;

  const result = await query(
    'INSERT INTO students (student_number, first_name, last_name, email, department, faculty, level, session, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
    [student_number, first_name, last_name, email, department, faculty, level, session]
  );

  logAction('Student created', { studentId: result.insertId });
  return result.insertId;
};

const updateStudent = async (studentId, updates) => {
  const allowedFields = ['student_number', 'first_name', 'last_name', 'email', 'department', 'faculty', 'level', 'session'];
  const updateFields = [];
  const params = [];

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      updateFields.push(`${field} = ?`);
      params.push(updates[field]);
    }
  });

  if (updateFields.length === 0) {
    throw new Error('No fields provided for update');
  }

  params.push(studentId);
  await query(`UPDATE students SET ${updateFields.join(', ')} WHERE id = ?`, params);
  logAction('Student updated', { studentId });
};

const deleteStudent = async (studentId) => {
  await query('UPDATE students SET deleted_at = NOW() WHERE id = ?', [studentId]);
  logAction('Student soft deleted', { studentId });
};

const getStudentById = async (studentId) => {
  const students = await query('SELECT * FROM students WHERE id = ? AND deleted_at IS NULL', [studentId]);
  if (!students.length) {
    throw new NotFoundError('Student not found');
  }
  return students[0];
};

const registerCourseForStudent = async (studentId, courseId, semester, session) => {
  const existing = await query(
    'SELECT id FROM course_registrations WHERE student_id = ? AND course_id = ? AND semester = ? AND session = ? AND deleted_at IS NULL',
    [studentId, courseId, semester, session]
  );

  if (existing.length) {
    throw new Error('Course already registered for this student');
  }

  await query(
    'INSERT INTO course_registrations (student_id, course_id, semester, session, created_at) VALUES (?, ?, ?, ?, NOW())',
    [studentId, courseId, semester, session]
  );

  logAction('Course registered for student', { studentId, courseId });
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  registerCourseForStudent,
};
