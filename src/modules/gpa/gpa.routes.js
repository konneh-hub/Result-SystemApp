const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const { getSemesterGPA, getCGPA } = require('./gpa.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/student/:id/:semester', roleMiddleware(['admin', 'staff', 'lecturer', 'hod', 'dean', 'student']), getSemesterGPA);
router.get('/cgpa/:id', roleMiddleware(['admin', 'staff', 'lecturer', 'hod', 'dean', 'student']), getCGPA);

module.exports = router;
