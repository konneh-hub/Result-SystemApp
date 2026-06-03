const { PERMISSIONS } = require('../constants/permissions');
const { hasPermission } = require('./permissionService');

/**
 * GPA ACCESS RULES (CRITICAL)
 * Only EXAM_OFFICER can:
 * - calculate GPA
 * - recalculate GPA
 * - publish CGPA
 *
 * Students can only VIEW their own GPA/CGPA
 * Others can view based on permissions
 */

const canCalculateGPA = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.GPA.CALCULATE);
};

const canRecalculateGPA = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.GPA.RECALCULATE);
};

const canViewGPA = (userId, userRole, targetStudentId) => {
  // ADMIN can view all
  if (userRole === 'admin') {
    return true;
  }

  // STUDENTS can only view their own GPA
  if (userRole === 'student') {
    return userId === targetStudentId;
  }

  // EXAM_OFFICER, DEAN, HOD, LECTURER can view
  if (['exam_officer', 'dean', 'hod', 'lecturer'].includes(userRole)) {
    return true;
  }

  return false;
};

const enforceGPAAccess = (userId, userRole) => (req, res, next) => {
  req.enforceGPACalculation = () => {
    if (!canCalculateGPA(userRole)) {
      return {
        allowed: false,
        message: 'Only exam officers can calculate GPA',
      };
    }
    return { allowed: true };
  };

  req.enforceGPARecalculation = () => {
    if (!canRecalculateGPA(userRole)) {
      return {
        allowed: false,
        message: 'Only exam officers can recalculate GPA',
      };
    }
    return { allowed: true };
  };

  req.canViewGPA = (targetStudentId) => {
    return canViewGPA(userId, userRole, targetStudentId);
  };

  next();
};

module.exports = {
  canCalculateGPA,
  canRecalculateGPA,
  canViewGPA,
  enforceGPAAccess,
};
