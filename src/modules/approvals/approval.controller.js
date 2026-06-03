const approvalService = require('../../services/approvalService');
const NotFoundError = require('../../exceptions/NotFoundError');
const ValidationError = require('../../exceptions/ValidationError');

const getApprovalHistory = async (req, res, next) => {
  try {
    const resultId = req.params.resultId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);

    if (!resultId) {
      throw new ValidationError('Result ID is required');
    }

    const result = await approvalService.getApprovalHistory(resultId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApprovalHistory,
};
