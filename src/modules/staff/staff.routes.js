const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../../constants/permissions');
const {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('./staff.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', permissionMiddleware([PERMISSIONS.STAFF.READ]), getStaff);
router.post('/', permissionMiddleware([PERMISSIONS.STAFF.CREATE]), createStaff);
router.put('/:id', permissionMiddleware([PERMISSIONS.STAFF.UPDATE]), updateStaff);
router.delete('/:id', permissionMiddleware([PERMISSIONS.STAFF.DELETE]), deleteStaff);

module.exports = router;
