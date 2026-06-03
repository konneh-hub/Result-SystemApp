const roleMiddleware = (allowedRoles = []) => (req, res, next) => {
  if (!req.user || !allowedRoles.length) {
    return res.status(403).json({ message: 'Access denied' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  next();
};

module.exports = roleMiddleware;
