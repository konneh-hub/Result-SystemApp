const AppError = require('./AppError');

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden: Insufficient permissions') {
    super(message, 403);
  }
}

module.exports = ForbiddenError;
