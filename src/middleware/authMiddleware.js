const { verifyToken } = require('../config/jwt');
const { query } = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await query('SELECT id, email, role, is_active FROM users WHERE id = ?', [decoded.id]);

    if (!user || !user.length || !user[0].is_active) {
      return res.status(401).json({ message: 'Invalid or inactive authentication token' });
    }

    req.user = {
      id: user[0].id,
      email: user[0].email,
      role: user[0].role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = authMiddleware;
