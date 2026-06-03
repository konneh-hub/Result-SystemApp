const ValidationError = require('../exceptions/ValidationError');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRequired = (data, fields) => {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw new ValidationError(`${field} is required`);
    }
  }
};

const validateEnumField = (value, validValues, fieldName) => {
  if (!validValues.includes(value)) {
    throw new ValidationError(`${fieldName} must be one of: ${validValues.join(', ')}`);
  }
};

const validateRequest = (schema) => (req, res, next) => {
  try {
    const { required = [], email = [], enum: enumFields = {} } = schema;

    // Check required fields
    if (required.length > 0) {
      validateRequired(req.body, required);
    }

    // Check email fields
    for (const emailField of email) {
      if (req.body[emailField] && !validateEmail(req.body[emailField])) {
        throw new ValidationError(`${emailField} must be a valid email address`);
      }
    }

    // Check enum fields
    for (const [field, validValues] of Object.entries(enumFields)) {
      if (req.body[field] && !validValues.includes(req.body[field])) {
        throw new ValidationError(`${field} must be one of: ${validValues.join(', ')}`);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateRequest,
  validateEmail,
  validateRequired,
  validateEnumField,
};
