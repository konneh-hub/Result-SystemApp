const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../../constants/permissions');
const { getSemesterGPA, getCGPA } = require('./gpa.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/student/:id/:semester', permissionMiddleware([PERMISSIONS.GPA.VIEW]), getSemesterGPA);
router.get('/cgpa/:id', permissionMiddleware([PERMISSIONS.GPA.VIEW]), getCGPA);

module.exports = router;
