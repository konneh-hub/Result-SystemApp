const AppError = require('./AppError');

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized: Invalid or missing credentials') {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;
