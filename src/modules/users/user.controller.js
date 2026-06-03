const bcrypt = require('bcrypt');
const { query } = require('../../config/db');
const { logAction } = require('../../utils/logger');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await query('SELECT id, email, role, is_active, created_at FROM users');
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await query('INSERT INTO users (email, password, role, is_active, created_at) VALUES (?, ?, ?, ?, NOW())', [email, hashedPassword, role, 1]);

    logAction('User created', { userId: result.insertId, email, role, createdBy: req.user.id });
    res.status(201).json({ id: result.insertId, email, role });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { email, password, role, is_active } = req.body;
    const updates = [];
    const params = [];

    if (email) {
      updates.push('email = ?');
      params.push(email);
    }

    if (role) {
      updates.push('role = ?');
      params.push(role);
    }

    if (typeof is_active !== 'undefined') {
      updates.push('is_active = ?');
      params.push(is_active ? 1 : 0);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updates.push('password = ?');
      params.push(hashedPassword);
    }

    if (!updates.length) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    params.push(userId);
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    logAction('User updated', { userId, updatedBy: req.user.id });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await query('UPDATE users SET is_active = 0 WHERE id = ?', [userId]);
    logAction('User deactivated', { userId, deactivatedBy: req.user.id });
    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
