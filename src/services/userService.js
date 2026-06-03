const bcrypt = require('bcrypt');
const { query } = require('../config/db');
const { logAction } = require('../utils/logger');
const ConflictError = require('../exceptions/ConflictError');
const NotFoundError = require('../exceptions/NotFoundError');
const ValidationError = require('../exceptions/ValidationError');
const { ROLE_PERMISSIONS } = require('../constants/permissions');

const getAllUsers = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const users = await query(
    'SELECT id, email, role, is_active, created_at FROM users LIMIT ? OFFSET ?',
    [limit, offset]
  );
  const total = await query('SELECT COUNT(*) as count FROM users');
  return {
    users,
    pagination: { page, limit, total: total[0].count },
  };
};

const createUser = async (email, password, role) => {
  const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) {
    throw new ConflictError('Email already exists');
  }

  if (!ROLE_PERMISSIONS[role]) {
    throw new ValidationError('Invalid role');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await query(
    'INSERT INTO users (email, password, role, is_active, created_at) VALUES (?, ?, ?, ?, NOW())',
    [email, hashedPassword, role, 1]
  );

  logAction('User created', { userId: result.insertId, email, role });
  return result.insertId;
};

const updateUser = async (userId, updates) => {
  const found = await query('SELECT id FROM users WHERE id = ?', [userId]);
  if (!found.length) {
    throw new NotFoundError('User not found');
  }

  const { email, password, role, is_active } = updates;
  const updateFields = [];
  const params = [];

  if (email) {
    const existing = await query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existing.length) {
      throw new ConflictError('Email already exists');
    }
    updateFields.push('email = ?');
    params.push(email);
  }

  if (role) {
    if (!ROLE_PERMISSIONS[role]) {
      throw new ValidationError('Invalid role');
    }
    updateFields.push('role = ?');
    params.push(role);
  }

  if (typeof is_active !== 'undefined') {
    updateFields.push('is_active = ?');
    params.push(is_active ? 1 : 0);
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    updateFields.push('password = ?');
    params.push(hashedPassword);
  }

  if (updateFields.length === 0) {
    throw new Error('No fields provided for update');
  }

  params.push(userId);
  await query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, params);
  logAction('User updated', { userId });
};

const deactivateUser = async (userId) => {
  const found = await query('SELECT id FROM users WHERE id = ?', [userId]);
  if (!found.length) {
    throw new NotFoundError('User not found');
  }

  await query('UPDATE users SET is_active = 0 WHERE id = ?', [userId]);
  logAction('User deactivated', { userId });
};

const getUserById = async (userId) => {
  const users = await query('SELECT id, email, role, is_active FROM users WHERE id = ?', [userId]);
  if (!users.length) {
    throw new NotFoundError('User not found');
  }
  return users[0];
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  getUserById,
};
