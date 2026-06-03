const { logError } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logError(err, { path: req.originalUrl, method: req.method });
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
