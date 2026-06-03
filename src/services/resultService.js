const { query } = require('../config/db');
const { logAction } = require('../utils/logger');
const NotFoundError = require('../exceptions/NotFoundError');

const getResults = async (page = 1, limit = 50) => {
  const offset = (page - 1) * limit;
  const results = await query(
    'SELECT r.*, c.code as course_code, c.title as course_title FROM results r JOIN courses c ON r.course_id = c.id WHERE r.deleted_at IS NULL LIMIT ? OFFSET ?',
    [limit, offset]
  );
  const total = await query('SELECT COUNT(*) as count FROM results WHERE deleted_at IS NULL');
  return {
    results,
    pagination: { page, limit, total: total[0].count },
  };
};

const getResultById = async (resultId) => {
  const results = await query('SELECT * FROM results WHERE id = ? AND deleted_at IS NULL', [resultId]);
  if (!results.length) {
    throw new NotFoundError('Result not found');
  }
  return results[0];
};

const createDraftResult = async (studentId, courseId, score, semester, session, createdBy) => {
  const result = await query(
    'INSERT INTO results (student_id, course_id, score, semester, session, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
    [studentId, courseId, score, semester, session, 'draft', createdBy]
  );

  logAction('Draft result created', { resultId: result.insertId, createdBy });
  return result.insertId;
};

const updateDraftResult = async (resultId, score) => {
  const result = await getResultById(resultId);

  if (result.status !== 'draft') {
    throw new Error('Only draft results can be updated');
  }

  await query('UPDATE results SET score = ?, updated_at = NOW() WHERE id = ?', [score, resultId]);
  logAction('Draft result updated', { resultId });
};

const submitResult = async (resultId, userId) => {
  const result = await getResultById(resultId);

  if (result.status !== 'draft') {
    throw new Error('Only draft results can be submitted');
  }

  if (result.created_by !== userId) {
    throw new Error('Only the creator can submit this result');
  }

  await query('UPDATE results SET status = ?, updated_at = NOW() WHERE id = ?', ['submitted', resultId]);
  logAction('Result submitted', { resultId, submittedBy: userId });
};

const approveResult = async (resultId, approverId, approverRole, comment = '') => {
  const result = await getResultById(resultId);
  const currentStatus = result.status;

  let nextStatus;
  if (approverRole === 'hod' && currentStatus === 'submitted') {
    nextStatus = 'hod_approved';
  } else if (approverRole === 'dean' && currentStatus === 'hod_approved') {
    nextStatus = 'dean_approved';
  } else if (approverRole === 'exam_officer' && currentStatus === 'dean_approved') {
    nextStatus = 'verified';
  } else {
    throw new Error('Result is not in a valid state for approval by your role');
  }

  await query('UPDATE results SET status = ?, updated_at = NOW() WHERE id = ?', [nextStatus, resultId]);
  await query(
    'INSERT INTO result_approvals (result_id, approver_id, role, status, comment, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [resultId, approverId, approverRole, 'approved', comment]
  );

  logAction('Result approved', { resultId, approvedBy: approverId, role: approverRole, nextStatus });
};

const rejectResult = async (resultId, approverId, approverRole, comment = '') => {
  const result = await getResultById(resultId);

  if (!['submitted', 'hod_approved', 'dean_approved'].includes(result.status)) {
    throw new Error('Result cannot be rejected in its current state');
  }

  await query('UPDATE results SET status = ?, updated_at = NOW() WHERE id = ?', ['rejected', resultId]);
  await query(
    'INSERT INTO result_approvals (result_id, approver_id, role, status, comment, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [resultId, approverId, approverRole, 'rejected', comment]
  );

  logAction('Result rejected', { resultId, rejectedBy: approverId, role: approverRole });
};

module.exports = {
  getResults,
  getResultById,
  createDraftResult,
  updateDraftResult,
  submitResult,
  approveResult,
  rejectResult,
};
