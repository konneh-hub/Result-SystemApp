const { query } = require('../../config/db');
const { logAction } = require('../../utils/logger');
const ValidationError = require('../../exceptions/ValidationError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ForbiddenError = require('../../exceptions/ForbiddenError');

const publishResults = async (req, res, next) => {
  try {
    const { semester, session } = req.body;
    if (!semester || !session) {
      throw new ValidationError('Semester and session are required');
    }

    const results = await query(
      'SELECT id FROM results WHERE semester = ? AND session = ? AND status = ? AND deleted_at IS NULL',
      [semester, session, 'verified']
    );

    if (!results.length) {
      throw new NotFoundError('No verified results found to publish');
    }

    const resultIds = results.map((item) => item.id);
    await query(
      `UPDATE results SET status = ?, updated_at = NOW() WHERE id IN (${resultIds.map(() => '?').join(',')})`,
      ['published', ...resultIds]
    );

    await query('INSERT INTO result_publications (semester, session, published_by, published_at) VALUES (?, ?, ?, NOW())', [semester, session, req.user.id]);

    logAction('Results published', { semester, session, publishedBy: req.user.id, resultCount: resultIds.length });
    res.status(200).json({ message: 'Results published successfully', count: resultIds.length });
  } catch (error) {
    next(error);
  }
};

const getPublishedResults = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    if (req.user.role === 'student' && req.user.id !== Number(studentId)) {
      throw new ForbiddenError('Access denied');
    }

    const results = await query(
      'SELECT r.*, c.code AS course_code, c.title AS course_title, c.credit_unit FROM results r JOIN courses c ON r.course_id = c.id WHERE r.student_id = ? AND r.status = ? AND r.deleted_at IS NULL LIMIT ? OFFSET ?',
      [studentId, 'published', limit, offset]
    );

    const total = await query('SELECT COUNT(*) as count FROM results WHERE student_id = ? AND status = ? AND deleted_at IS NULL', [studentId, 'published']);

    res.status(200).json({
      results,
      pagination: { page, limit, total: total[0].count },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  publishResults,
  getPublishedResults,
};
