const bcrypt = require('bcrypt');
const { query } = require('../../config/db');
const { generateToken } = require('../../config/jwt');
const { logAction } = require('../../utils/logger');

const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await query('INSERT INTO users (email, password, role, is_active, created_at) VALUES (?, ?, ?, ?, NOW())', [email, hashedPassword, role, 1]);
    const userId = result.insertId;

    logAction('User registered', { userId, email, role });
    res.status(201).json({ id: userId, email, role });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = await query('SELECT id, email, password, role, is_active FROM users WHERE email = ?', [email]);
    if (!users.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    if (!user.is_active) {
      return res.status(403).json({ message: 'User is deactivated' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    logAction('User logged in', { userId: user.id, email });
    res.status(200).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
