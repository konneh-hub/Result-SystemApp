const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../../constants/permissions');
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  assignLecturer,
} = require('./course.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', permissionMiddleware([PERMISSIONS.COURSES.READ]), getCourses);
router.post('/', permissionMiddleware([PERMISSIONS.COURSES.CREATE]), createCourse);
router.put('/:id', permissionMiddleware([PERMISSIONS.COURSES.UPDATE]), updateCourse);
router.delete('/:id', permissionMiddleware([PERMISSIONS.COURSES.DELETE]), deleteCourse);
router.post('/assign', permissionMiddleware([PERMISSIONS.COURSES.ASSIGN_LECTURER]), assignLecturer);

module.exports = router;
