const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  assignLecturer,
} = require('./course.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware(['admin', 'staff', 'lecturer', 'hod', 'dean', 'student']), getCourses);
router.post('/', roleMiddleware(['admin', 'staff']), createCourse);
router.put('/:id', roleMiddleware(['admin', 'staff']), updateCourse);
router.delete('/:id', roleMiddleware(['admin', 'staff']), deleteCourse);
router.post('/assign', roleMiddleware(['admin', 'staff']), assignLecturer);

module.exports = router;
