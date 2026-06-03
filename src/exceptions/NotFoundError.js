const AppError = require('./AppError');

class NotFoundError extends AppError {
  constructor(message = 'Not Found: Resource does not exist') {
    super(message, 404);
  }
}

module.exports = NotFoundError;
