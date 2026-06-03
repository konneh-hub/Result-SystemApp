const { query } = require('../../config/db');
const { logAction } = require('../../utils/logger');

const getCourses = async (req, res, next) => {
  try {
    const courses = await query('SELECT * FROM courses WHERE deleted_at IS NULL');
    res.status(200).json({ courses });
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { code, title, credit_unit, department, faculty } = req.body;
    if (!code || !title || !credit_unit) {
      return res.status(400).json({ message: 'Code, title, and credit unit are required' });
    }

    const result = await query(
      'INSERT INTO courses (code, title, credit_unit, department, faculty, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [code, title, credit_unit, department, faculty]
    );

    logAction('Course created', { courseId: result.insertId, createdBy: req.user.id });
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const updates = [];
    const params = [];
    const allowedFields = ['code', 'title', 'credit_unit', 'department', 'faculty'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    });

    if (!updates.length) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    params.push(courseId);
    await query(`UPDATE courses SET ${updates.join(', ')} WHERE id = ?`, params);

    logAction('Course updated', { courseId, updatedBy: req.user.id });
    res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    await query('UPDATE courses SET deleted_at = NOW() WHERE id = ?', [courseId]);
    logAction('Course soft deleted', { courseId, deletedBy: req.user.id });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const assignLecturer = async (req, res, next) => {
  try {
    const { course_id, lecturer_id } = req.body;
    if (!course_id || !lecturer_id) {
      return res.status(400).json({ message: 'Course ID and lecturer ID are required' });
    }

    await query('UPDATE courses SET lecturer_id = ? WHERE id = ?', [lecturer_id, course_id]);
    logAction('Lecturer assigned to course', { courseId: course_id, lecturerId: lecturer_id, assignedBy: req.user.id });
    res.status(200).json({ message: 'Lecturer assigned successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  assignLecturer,
};
