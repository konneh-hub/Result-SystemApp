const { query } = require('../../config/db');
const { calculateSemesterGPA, calculateCGPA } = require('../../utils/gpaCalculator');
const { canCalculateGPA, canViewGPA } = require('../../services/gpaAccessService');
const { logAction } = require('../../utils/logger');
const ForbiddenError = require('../../exceptions/ForbiddenError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ValidationError = require('../../exceptions/ValidationError');

const getSemesterGPA = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const semester = req.params.semester;

    // Enforce access control
    const canView = canViewGPA(req.user.id, req.user.role, Number(studentId));
    if (!canView) {
      throw new ForbiddenError('Cannot view GPA for this student');
    }

    if (!studentId || !semester) {
      throw new ValidationError('Student ID and semester are required');
    }

    const grades = await query(
      'SELECT r.score, c.credit_unit, gp.grade_point FROM results r JOIN courses c ON r.course_id = c.id JOIN grade_points_map gp ON r.score BETWEEN gp.min_score AND gp.max_score WHERE r.student_id = ? AND r.semester = ? AND r.status = ? AND r.deleted_at IS NULL',
      [studentId, semester, 'verified']
    );

    if (!grades.length) {
      throw new NotFoundError('No verified results found for this student and semester');
    }

    const calculatedGPA = calculateSemesterGPA(grades);
    await query(
      'INSERT INTO gpa_calculations_log (student_id, semester, gpa, created_by, created_at) VALUES (?, ?, ?, ?, NOW())',
      [studentId, semester, calculatedGPA, req.user.id]
    );

    logAction('GPA calculated', { studentId, semester, gpa: calculatedGPA, calculatedBy: req.user.id });
    res.status(200).json({ studentId, semester, gpa: calculatedGPA });
  } catch (error) {
    next(error);
  }
};

const getCGPA = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    // Enforce access control
    const canView = canViewGPA(req.user.id, req.user.role, Number(studentId));
    if (!canView) {
      throw new ForbiddenError('Cannot view CGPA for this student');
    }

    if (!studentId) {
      throw new ValidationError('Student ID is required');
    }

    const semesterGrades = await query(
      'SELECT r.semester, SUM(c.credit_unit) AS credit_units, SUM(gp.grade_point * c.credit_unit) AS grade_points FROM results r JOIN courses c ON r.course_id = c.id JOIN grade_points_map gp ON r.score BETWEEN gp.min_score AND gp.max_score WHERE r.student_id = ? AND r.status = ? AND r.deleted_at IS NULL GROUP BY r.semester',
      [studentId, 'verified']
    );

    if (!semesterGrades.length) {
      throw new NotFoundError('No verified results found for this student');
    }

    const calculatedCGPA = calculateCGPA(semesterGrades);
    logAction('CGPA calculated', { studentId, cgpa: calculatedCGPA, calculatedBy: req.user.id });
    res.status(200).json({ studentId, cgpa: calculatedCGPA });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSemesterGPA,
  getCGPA,
};

module.exports = {
  getSemesterGPA,
  getCGPA,
};
