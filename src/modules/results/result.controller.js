const { query } = require('../../config/db');
const { logAction } = require('../../utils/logger');

const createDraftResult = async (req, res, next) => {
  try {
    const { student_id, course_id, score, semester, session } = req.body;
    if (!student_id || !course_id || typeof score === 'undefined' || !semester || !session) {
      return res.status(400).json({ message: 'Student, course, score, semester, and session are required' });
    }

    const result = await query(
      'INSERT INTO results (student_id, course_id, score, semester, session, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [student_id, course_id, score, semester, session, 'draft', req.user.id]
    );

    logAction('Draft result created', { resultId: result.insertId, createdBy: req.user.id });
    res.status(201).json({ id: result.insertId, status: 'draft' });
  } catch (error) {
    next(error);
  }
};

const updateDraftResult = async (req, res, next) => {
  try {
    const resultId = req.params.id;
    const { score } = req.body;
    if (typeof score === 'undefined') {
      return res.status(400).json({ message: 'Score is required for update' });
    }

    const existing = await query('SELECT status FROM results WHERE id = ? AND deleted_at IS NULL', [resultId]);
    if (!existing.length) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (existing[0].status !== 'draft') {
      return res.status(400).json({ message: 'Only draft results can be updated' });
    }

    await query('UPDATE results SET score = ?, updated_at = NOW() WHERE id = ?', [score, resultId]);
    logAction('Draft result updated', { resultId, updatedBy: req.user.id });
    res.status(200).json({ message: 'Draft result updated successfully' });
  } catch (error) {
    next(error);
  }
};

const submitResult = async (req, res, next) => {
  try {
    const resultId = req.params.id;
    const existing = await query('SELECT status FROM results WHERE id = ? AND deleted_at IS NULL', [resultId]);
    if (!existing.length) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (existing[0].status !== 'draft') {
      return res.status(400).json({ message: 'Only draft results can be submitted' });
    }

    await query('UPDATE results SET status = ?, updated_at = NOW() WHERE id = ?', ['submitted', resultId]);
    logAction('Result submitted', { resultId, submittedBy: req.user.id });
    res.status(200).json({ message: 'Result submitted successfully' });
  } catch (error) {
    next(error);
  }
};

const approveResult = async (req, res, next) => {
  try {
    const resultId = req.params.id;
    const { comment = '' } = req.body;
    const existing = await query('SELECT status FROM results WHERE id = ? AND deleted_at IS NULL', [resultId]);
    if (!existing.length) {
      return res.status(404).json({ message: 'Result not found' });
    }

    const currentStatus = existing[0].status;

    let nextStatus;
    if (req.user.role === 'hod' && currentStatus === 'submitted') {
      nextStatus = 'hod_approved';
    } else if (req.user.role === 'dean' && currentStatus === 'hod_approved') {
      nextStatus = 'dean_approved';
    } else if (req.user.role === 'exam_officer' && currentStatus === 'dean_approved') {
      nextStatus = 'verified';
    } else {
      return res.status(400).json({ message: 'Result is not in a valid state for approval by your role' });
    }

    await query('UPDATE results SET status = ?, updated_at = NOW() WHERE id = ?', [nextStatus, resultId]);
    await query(
      'INSERT INTO result_approvals (result_id, approver_id, role, status, comment, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [resultId, req.user.id, req.user.role, 'approved', comment]
    );

    logAction('Result approved', { resultId, approvedBy: req.user.id, role: req.user.role, nextStatus });
    res.status(200).json({ message: 'Result approved successfully', status: nextStatus });
  } catch (error) {
    next(error);
  }
};

const rejectResult = async (req, res, next) => {
  try {
    const resultId = req.params.id;
    const { comment = '' } = req.body;
    const existing = await query('SELECT status FROM results WHERE id = ? AND deleted_at IS NULL', [resultId]);
    if (!existing.length) {
      return res.status(404).json({ message: 'Result not found' });
    }

    const currentStatus = existing[0].status;

    if (!['submitted', 'hod_approved', 'dean_approved'].includes(currentStatus)) {
      return res.status(400).json({ message: 'Result cannot be rejected in its current state' });
    }

    await query('UPDATE results SET status = ?, updated_at = NOW() WHERE id = ?', ['rejected', resultId]);
    await query(
      'INSERT INTO result_approvals (result_id, approver_id, role, status, comment, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [resultId, req.user.id, req.user.role, 'rejected', comment]
    );

    logAction('Result rejected', { resultId, rejectedBy: req.user.id, role: req.user.role });
    res.status(200).json({ message: 'Result rejected successfully' });
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
      [studentId, 'verified']
    );

    res.status(200).json({ results });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDraftResult,
  updateDraftResult,
  submitResult,
  approveResult,
  rejectResult,
  getPublishedResults,
};
