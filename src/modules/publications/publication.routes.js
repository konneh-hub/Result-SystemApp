const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const { publishResults, getPublishedResults } = require('./publication.controller');

const router = express.Router();

router.use(authMiddleware);
router.post('/publish', roleMiddleware(['exam_officer']), publishResults);
router.get('/:studentId', roleMiddleware(['student', 'admin', 'staff', 'lecturer', 'hod', 'dean']), getPublishedResults);

module.exports = router;
