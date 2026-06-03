const { hasPermission, hasAnyPermission, hasAllPermissions } = require('../services/permissionService');
const ForbiddenError = require('../exceptions/ForbiddenError');
const UnauthorizedError = require('../exceptions/UnauthorizedError');

const permissionMiddleware = (requiredPermissions = [], requireAll = false) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return next();
  }

  const hasAccess = requireAll
    ? hasAllPermissions(req.user.role, requiredPermissions)
    : hasAnyPermission(req.user.role, requiredPermissions);

  if (!hasAccess) {
    return next(new ForbiddenError('Insufficient permissions for this action'));
  }

  next();
};

module.exports = permissionMiddleware;
