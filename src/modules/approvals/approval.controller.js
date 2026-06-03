const { query } = require('../../config/db');

const getApprovalHistory = async (req, res, next) => {
  try {
    const resultId = req.params.resultId;
    const approvals = await query('SELECT * FROM result_approvals WHERE result_id = ? ORDER BY created_at ASC', [resultId]);
    res.status(200).json({ approvals });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApprovalHistory,
};
