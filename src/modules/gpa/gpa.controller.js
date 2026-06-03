const { query } = require('../../config/db');
const { calculateSemesterGPA, calculateCGPA } = require('../../utils/gpaCalculator');
const { logAction } = require('../../utils/logger');

const getSemesterGPA = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const semester = req.params.semester;

    if (req.user.role === 'student' && req.user.id !== Number(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const grades = await query(
      'SELECT r.score, c.credit_unit, gp.grade_point FROM results r JOIN courses c ON r.course_id = c.id JOIN grade_points_map gp ON r.score BETWEEN gp.min_score AND gp.max_score WHERE r.student_id = ? AND r.semester = ? AND r.status = ? AND r.deleted_at IS NULL',
      [studentId, semester, 'verified']
    );

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
    if (req.user.role === 'student' && req.user.id !== Number(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const semesterGrades = await query(
      'SELECT r.semester, SUM(c.credit_unit) AS credit_units, SUM(gp.grade_point * c.credit_unit) AS grade_points FROM results r JOIN courses c ON r.course_id = c.id JOIN grade_points_map gp ON r.score BETWEEN gp.min_score AND gp.max_score WHERE r.student_id = ? AND r.status = ? AND r.deleted_at IS NULL GROUP BY r.semester',
      [studentId, 'verified']
    );

    const calculatedCGPA = calculateCGPA(semesterGrades);
    res.status(200).json({ studentId, cgpa: calculatedCGPA });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSemesterGPA,
  getCGPA,
};
