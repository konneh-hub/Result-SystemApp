const { query } = require('../../config/db');
const { logAction } = require('../../utils/logger');

const publishResults = async (req, res, next) => {
  try {
    const { semester, session } = req.body;
    if (!semester || !session) {
      return res.status(400).json({ message: 'Semester and session are required' });
    }

    const results = await query(
      'SELECT id FROM results WHERE semester = ? AND session = ? AND status = ? AND deleted_at IS NULL',
      [semester, session, 'verified']
    );

    if (!results.length) {
      return res.status(404).json({ message: 'No verified results found to publish' });
    }

    const resultIds = results.map((item) => item.id);
    await query(
      `UPDATE results SET status = ?, updated_at = NOW() WHERE id IN (${resultIds.map(() => '?').join(',')})`,
      ['published', ...resultIds]
    );

    await query('INSERT INTO result_publications (semester, session, published_by, published_at) VALUES (?, ?, ?, NOW())', [semester, session, req.user.id]);

    logAction('Results published', { semester, session, publishedBy: req.user.id });
    res.status(200).json({ message: 'Results published successfully' });
  } catch (error) {
    next(error);
  }
};

const getPublishedResults = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    if (req.user.role === 'student' && req.user.id !== Number(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const results = await query(
      'SELECT r.*, c.code AS course_code, c.title AS course_title, c.credit_unit FROM results r JOIN courses c ON r.course_id = c.id WHERE r.student_id = ? AND r.status = ? AND r.deleted_at IS NULL',
      [studentId, 'published']
    );

    res.status(200).json({ results });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  publishResults,
  getPublishedResults,
};
