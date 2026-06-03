const { hasPermission, hasAnyPermission, hasAllPermissions } = require('../services/permissionService');

const permissionMiddleware = (requiredPermissions = [], requireAll = false) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return next();
  }

  const hasAccess = requireAll
    ? hasAllPermissions(req.user.role, requiredPermissions)
    : hasAnyPermission(req.user.role, requiredPermissions);

  if (!hasAccess) {
    return res.status(403).json({ message: 'Insufficient permissions for this action' });
  }

  next();
};

module.exports = permissionMiddleware;
