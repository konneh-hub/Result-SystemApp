const { query } = require('../../config/db');
const { logAction } = require('../../utils/logger');

const getStudents = async (req, res, next) => {
  try {
    const students = await query('SELECT * FROM students WHERE deleted_at IS NULL');
    res.status(200).json({ students });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { student_number, first_name, last_name, email, department, faculty, level, session } = req.body;
    if (!student_number || !first_name || !last_name || !email) {
      return res.status(400).json({ message: 'Student number, first name, last name, and email are required' });
    }

    const result = await query(
      'INSERT INTO students (student_number, first_name, last_name, email, department, faculty, level, session, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [student_number, first_name, last_name, email, department, faculty, level, session]
    );

    logAction('Student created', { studentId: result.insertId, createdBy: req.user.id });
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const updates = [];
    const params = [];
    const allowedFields = ['student_number', 'first_name', 'last_name', 'email', 'department', 'faculty', 'level', 'session'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    });

    if (!updates.length) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    params.push(studentId);
    await query(`UPDATE students SET ${updates.join(', ')} WHERE id = ?`, params);

    logAction('Student updated', { studentId, updatedBy: req.user.id });
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    await query('UPDATE students SET deleted_at = NOW() WHERE id = ?', [studentId]);
    logAction('Student soft deleted', { studentId, deletedBy: req.user.id });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getStudentProfile = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const profiles = await query('SELECT * FROM students WHERE id = ? AND deleted_at IS NULL', [studentId]);
    if (!profiles.length) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.role === 'student' && req.user.id !== Number(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ student: profiles[0] });
  } catch (error) {
    next(error);
  }
};

const registerCourse = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const { course_id, semester, session } = req.body;
    if (!course_id || !semester || !session) {
      return res.status(400).json({ message: 'Course ID, semester, and session are required' });
    }

    const existing = await query(
      'SELECT id FROM course_registrations WHERE student_id = ? AND course_id = ? AND semester = ? AND session = ? AND deleted_at IS NULL',
      [studentId, course_id, semester, session]
    );
    if (existing.length) {
      return res.status(409).json({ message: 'Course already registered for this student' });
    }

    await query(
      'INSERT INTO course_registrations (student_id, course_id, semester, session, created_at) VALUES (?, ?, ?, ?, NOW())',
      [studentId, course_id, semester, session]
    );

    logAction('Course registered for student', { studentId, courseId: course_id, registeredBy: req.user.id });
    res.status(201).json({ message: 'Course registered successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  registerCourse,
};
