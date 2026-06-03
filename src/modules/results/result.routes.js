const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../../constants/permissions');
const {
  createDraftResult,
  updateDraftResult,
  submitResult,
  approveResult,
  rejectResult,
  getPublishedResults,
} = require('./result.controller');

const router = express.Router();

router.use(authMiddleware);

router.post('/draft', permissionMiddleware([PERMISSIONS.RESULTS.CREATE_DRAFT]), createDraftResult);
router.put('/:id', permissionMiddleware([PERMISSIONS.RESULTS.UPDATE_DRAFT]), updateDraftResult);
router.post('/submit/:id', permissionMiddleware([PERMISSIONS.RESULTS.SUBMIT]), submitResult);
router.post('/approve/:id', permissionMiddleware([PERMISSIONS.RESULTS.APPROVE]), approveResult);
router.post('/reject/:id', permissionMiddleware([PERMISSIONS.RESULTS.REJECT]), rejectResult);
router.get('/published/:studentId', permissionMiddleware([PERMISSIONS.RESULTS.VIEW_PUBLISHED]), getPublishedResults);

module.exports = router;
