const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const studentRoutes = require('../modules/students/student.routes');
const staffRoutes = require('../modules/staff/staff.routes');
const courseRoutes = require('../modules/courses/course.routes');
const resultRoutes = require('../modules/results/result.routes');
const gpaRoutes = require('../modules/gpa/gpa.routes');
const csvRoutes = require('../modules/csv/csv.routes');
const publicationRoutes = require('../modules/publications/publication.routes');
const approvalRoutes = require('../modules/approvals/approval.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/students', studentRoutes);
router.use('/staff', staffRoutes);
router.use('/courses', courseRoutes);
router.use('/results', resultRoutes);
router.use('/gpa', gpaRoutes);
router.use('/csv', csvRoutes);
router.use('/publications', publicationRoutes);
router.use('/approvals', approvalRoutes);

module.exports = router;
