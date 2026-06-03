const studentService = require('../../services/studentService');
const ValidationError = require('../../exceptions/ValidationError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ForbiddenError = require('../../exceptions/ForbiddenError');

const getStudents = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);

    const result = await studentService.getStudents(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { student_number, first_name, last_name, email, department, faculty, level, session } = req.body;
    if (!student_number || !first_name || !last_name || !email) {
      throw new ValidationError('Student number, first name, last name, and email are required');
    }

    const studentId = await studentService.createStudent(req.body);
    res.status(201).json({ id: studentId });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const updates = Object.keys(req.body);

    if (!updates.length) {
      throw new ValidationError('No fields provided for update');
    }

    await studentService.updateStudent(studentId, req.body);
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    await studentService.deleteStudent(studentId);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getStudentProfile = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    if (req.user.role === 'student' && req.user.id !== Number(studentId)) {
      throw new ForbiddenError('Access denied');
    }

    const student = await studentService.getStudentById(studentId);
    res.status(200).json({ student });
  } catch (error) {
    next(error);
  }
};

const registerCourse = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const { course_id, semester, session } = req.body;
    if (!course_id || !semester || !session) {
      throw new ValidationError('Course ID, semester, and session are required');
    }

    await studentService.registerCourseForStudent(studentId, course_id, semester, session);
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
