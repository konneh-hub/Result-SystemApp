const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  registerCourse,
  getStudentProfile,
} = require('./student.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware(['admin', 'staff', 'lecturer', 'hod', 'dean']), getStudents);
router.post('/', roleMiddleware(['admin', 'staff']), createStudent);
router.put('/:id', roleMiddleware(['admin', 'staff']), updateStudent);
router.delete('/:id', roleMiddleware(['admin', 'staff']), deleteStudent);
router.get('/:id', roleMiddleware(['admin', 'staff', 'lecturer', 'hod', 'dean', 'student']), getStudentProfile);
router.post('/:id/register-course', roleMiddleware(['admin', 'staff']), registerCourse);

module.exports = router;
