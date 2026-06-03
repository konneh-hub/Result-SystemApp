const userService = require('../../services/userService');
const ValidationError = require('../../exceptions/ValidationError');
const NotFoundError = require('../../exceptions/NotFoundError');

const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);

    const result = await userService.getAllUsers(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      throw new ValidationError('Email, password, and role are required');
    }

    const userId = await userService.createUser(email, password, role);
    res.status(201).json({ id: userId, email, role });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { email, password, role, is_active } = req.body;

    if (!email && !password && !role && typeof is_active === 'undefined') {
      throw new ValidationError('No fields provided for update');
    }

    await userService.updateUser(userId, { email, password, role, is_active });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await userService.deactivateUser(userId);
    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
};
