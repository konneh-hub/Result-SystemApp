const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../../constants/permissions');
const { getApprovalHistory } = require('./approval.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/history/:resultId', permissionMiddleware([PERMISSIONS.APPROVALS.VIEW_HISTORY]), getApprovalHistory);

module.exports = router;
