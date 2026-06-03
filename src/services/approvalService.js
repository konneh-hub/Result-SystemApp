const { query } = require('../config/db');
const NotFoundError = require('../exceptions/NotFoundError');

const getApprovalHistory = async (resultId, page = 1, limit = 50) => {
  const result = await query('SELECT id FROM results WHERE id = ? AND deleted_at IS NULL', [resultId]);
  if (!result.length) {
    throw new NotFoundError('Result not found');
  }

  const offset = (page - 1) * limit;
  const approvals = await query(
    'SELECT * FROM result_approvals WHERE result_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [resultId, limit, offset]
  );
  const total = await query('SELECT COUNT(*) as count FROM result_approvals WHERE result_id = ?', [resultId]);

  return {
    resultId,
    approvals,
    pagination: { page, limit, total: total[0].count },
  };
};

const getApprovalsByRole = async (role, page = 1, limit = 50) => {
  const offset = (page - 1) * limit;
  const approvals = await query(
    'SELECT ra.*, r.student_id, r.course_id, r.status FROM result_approvals ra JOIN results r ON ra.result_id = r.id WHERE ra.role = ? ORDER BY ra.created_at DESC LIMIT ? OFFSET ?',
    [role, limit, offset]
  );
  const total = await query('SELECT COUNT(*) as count FROM result_approvals WHERE role = ?', [role]);

  return {
    role,
    approvals,
    pagination: { page, limit, total: total[0].count },
  };
};

const getPendingApprovals = async (userId, role, page = 1, limit = 50) => {
  const offset = (page - 1) * limit;
  const results = await query(
    `SELECT r.* FROM results r 
     WHERE r.status IN (
       ${role === 'hod' ? "'submitted'" : ""},
       ${role === 'dean' ? "'hod_approved'" : ""},
       ${role === 'exam_officer' ? "'dean_approved'" : ""}
     )
     AND r.deleted_at IS NULL 
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const total = await query(
    `SELECT COUNT(*) as count FROM results WHERE status IN (
       ${role === 'hod' ? "'submitted'" : ""},
       ${role === 'dean' ? "'hod_approved'" : ""},
       ${role === 'exam_officer' ? "'dean_approved'" : ""}
     ) AND deleted_at IS NULL`
  );

  return {
    userId,
    role,
    pendingApprovals: results,
    pagination: { page, limit, total: total[0].count },
  };
};

module.exports = {
  getApprovalHistory,
  getApprovalsByRole,
  getPendingApprovals,
};
