const { ROLE_PERMISSIONS } = require('../constants/permissions');

const getPermissionsForRole = (role) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions;
};

const hasPermission = (role, action) => {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(action);
};

const hasAnyPermission = (role, actions = []) => {
  const permissions = getPermissionsForRole(role);
  return actions.some((action) => permissions.includes(action));
};

const hasAllPermissions = (role, actions = []) => {
  const permissions = getPermissionsForRole(role);
  return actions.every((action) => permissions.includes(action));
};

module.exports = {
  getPermissionsForRole,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
};
