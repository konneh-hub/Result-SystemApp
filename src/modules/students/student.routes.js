const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../../constants/permissions');
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

router.get('/', permissionMiddleware([PERMISSIONS.STUDENTS.READ]), getStudents);
router.post('/', permissionMiddleware([PERMISSIONS.STUDENTS.CREATE]), createStudent);
router.put('/:id', permissionMiddleware([PERMISSIONS.STUDENTS.UPDATE]), updateStudent);
router.delete('/:id', permissionMiddleware([PERMISSIONS.STUDENTS.DELETE]), deleteStudent);
router.get('/:id', permissionMiddleware([PERMISSIONS.STUDENTS.READ]), getStudentProfile);
router.post('/:id/register-course', permissionMiddleware([PERMISSIONS.STUDENTS.REGISTER_COURSE]), registerCourse);

module.exports = router;
