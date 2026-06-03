const resultService = require('../../services/resultService');
const { canViewResult, filterVisibleResults } = require('../../services/resultVisibilityService');
const { logAction } = require('../../utils/logger');
const ValidationError = require('../../exceptions/ValidationError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ForbiddenError = require('../../exceptions/ForbiddenError');

const createDraftResult = async (req, res, next) => {
  try {
    const { student_id, course_id, score, semester, session } = req.body;
    if (!student_id || !course_id || typeof score === 'undefined' || !semester || !session) {
      throw new ValidationError('Student, course, score, semester, and session are required');
    }

    const resultId = await resultService.createDraftResult(student_id, course_id, score, semester, session, req.user.id);
    res.status(201).json({ id: resultId, status: 'draft' });
  } catch (error) {
    next(error);
  }
};

const updateDraftResult = async (req, res, next) => {
  try {
    const resultId = req.params.id;
    const { score } = req.body;
    if (typeof score === 'undefined') {
      throw new ValidationError('Score is required for update');
    }

    const result = await resultService.getResultById(resultId);
    if (result.status !== 'draft') {
      throw new ValidationError('Only draft results can be updated');
    }

    if (result.created_by !== req.user.id) {
      throw new ForbiddenError('Only the creator can update this result');
    }

    await resultService.updateDraftResult(resultId, score);
    res.status(200).json({ message: 'Draft result updated successfully' });
  } catch (error) {
    next(error);
  }
};

const submitResult = async (req, res, next) => {
  try {
    const resultId = req.params.id;
    const result = await resultService.getResultById(resultId);

    if (result.created_by !== req.user.id) {
      throw new ForbiddenError('Only the creator can submit this result');
    }

    await resultService.submitResult(resultId, req.user.id);
    res.status(200).json({ message: 'Result submitted successfully' });
  } catch (error) {
    next(error);
  }
};

const approveResult = async (req, res, next) => {
  try {
    const resultId = req.params.id;
    const { comment = '' } = req.body;
    const result = await resultService.getResultById(resultId);

    await resultService.approveResult(resultId, req.user.id, req.user.role, comment);
    res.status(200).json({ message: 'Result approved successfully' });
  } catch (error) {
    next(error);
  }
};

const rejectResult = async (req, res, next) => {
  try {
    const resultId = req.params.id;
    const { comment = '' } = req.body;
    const result = await resultService.getResultById(resultId);

    await resultService.rejectResult(resultId, req.user.id, req.user.role, comment);
    res.status(200).json({ message: 'Result rejected successfully' });
  } catch (error) {
    next(error);
  }
};

const getPublishedResults = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);

    // Students can only view their own results
    if (req.user.role === 'student' && req.user.id !== Number(studentId)) {
      throw new ForbiddenError('Access denied');
    }

    const results = await resultService.getResults(page, limit);
    const visibleResults = await filterVisibleResults(results.results, req.user.id, req.user.role);

    res.status(200).json({
      results: visibleResults,
      pagination: results.pagination,
    });
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
