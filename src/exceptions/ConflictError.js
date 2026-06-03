const AppError = require('./AppError');

class ConflictError extends AppError {
  constructor(message = 'Conflict: Resource already exists') {
    super(message, 409);
  }
}

module.exports = ConflictError;
