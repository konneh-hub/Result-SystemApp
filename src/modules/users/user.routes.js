const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');
const { PERMISSIONS } = require('../../constants/permissions');
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} = require('./user.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', permissionMiddleware([PERMISSIONS.USERS.READ]), getAllUsers);
router.get('/:id', permissionMiddleware([PERMISSIONS.USERS.READ]), getUserById);
router.post('/', permissionMiddleware([PERMISSIONS.USERS.CREATE]), createUser);
router.put('/:id', permissionMiddleware([PERMISSIONS.USERS.UPDATE]), updateUser);
router.delete('/:id', permissionMiddleware([PERMISSIONS.USERS.DELETE]), deleteUser);

module.exports = router;
