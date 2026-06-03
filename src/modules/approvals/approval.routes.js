const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const { getApprovalHistory } = require('./approval.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/history/:resultId', roleMiddleware(['admin', 'staff', 'lecturer', 'hod', 'dean', 'exam_officer']), getApprovalHistory);

module.exports = router;
