const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
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

router.post('/draft', roleMiddleware(['lecturer']), createDraftResult);
router.put('/:id', roleMiddleware(['lecturer']), updateDraftResult);
router.post('/submit/:id', roleMiddleware(['lecturer']), submitResult);
router.post('/approve/:id', roleMiddleware(['hod', 'dean', 'exam_officer']), approveResult);
router.post('/reject/:id', roleMiddleware(['hod', 'dean', 'exam_officer']), rejectResult);
router.get('/published/:studentId', roleMiddleware(['student', 'admin', 'staff', 'lecturer', 'hod', 'dean']), getPublishedResults);

module.exports = router;
