const AppError = require('./AppError');

class ValidationError extends AppError {
  constructor(message = 'Validation Error: Invalid input data') {
    super(message, 400);
  }
}

module.exports = ValidationError;
