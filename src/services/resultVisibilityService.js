const { query } = require('../config/db');

/**
 * RESULT VISIBILITY RULES (CRITICAL)
 * Status    | Who can see
 * draft     | Lecturer only
 * submitted | HOD + Lecturer
 * approved  | Dean + Exam Officer
 * verified  | Exam Officer
 * published | Students + Everyone allowed
 * rejected  | Lecturer + Approver
 */

const canViewResult = async (userId, userRole, resultId) => {
  try {
    const results = await query('SELECT * FROM results WHERE id = ? AND deleted_at IS NULL', [resultId]);
    if (!results.length) {
      return { canView: false, reason: 'Result not found' };
    }

    const result = results[0];
    const status = result.status;

    // ADMIN can see everything
    if (userRole === 'admin') {
      return { canView: true };
    }

    // STUDENT - only published results for themselves
    if (userRole === 'student') {
      if (status !== 'verified' && status !== 'published') {
        return { canView: false, reason: 'Results are not yet published' };
      }
      if (result.student_id !== userId) {
        return { canView: false, reason: 'Cannot view other students results' };
      }
      return { canView: true };
    }

    // LECTURER - owns the result (created it) or submitted for approval
    if (userRole === 'lecturer') {
      if (result.created_by !== userId && result.status === 'draft') {
        return { canView: false, reason: 'Cannot view draft results created by others' };
      }
      return { canView: true };
    }

    // HOD - can see submitted results in their department
    if (userRole === 'hod') {
      if (status !== 'submitted' && status !== 'hod_approved' && status !== 'dean_approved' && status !== 'verified' && status !== 'published') {
        return { canView: false, reason: 'HOD can only view submitted or approved results' };
      }
      return { canView: true };
    }

    // DEAN - can see all non-draft results
    if (userRole === 'dean') {
      if (status === 'draft') {
        return { canView: false, reason: 'DEAN cannot view draft results' };
      }
      return { canView: true };
    }

    // EXAM_OFFICER - can see all results except draft
    if (userRole === 'exam_officer') {
      if (status === 'draft') {
        return { canView: false, reason: 'Cannot view draft results before submission' };
      }
      return { canView: true };
    }

    return { canView: false, reason: 'Unauthorized access' };
  } catch (error) {
    return { canView: false, reason: 'Access control check failed' };
  }
};

const filterVisibleResults = async (userId, userRole, results) => {
  if (userRole === 'admin') {
    return results;
  }

  const visibleResults = [];

  for (const result of results) {
    const { canView } = await canViewResult(userId, userRole, result.id);
    if (canView) {
      visibleResults.push(result);
    }
  }

  return visibleResults;
};

const enforceResultVisibility = (userId, userRole) => (req, res, next) => {
  req.canViewResult = async (resultId) => {
    return canViewResult(userId, userRole, resultId);
  };

  req.filterVisibleResults = async (results) => {
    return filterVisibleResults(userId, userRole, results);
  };

  next();
};

module.exports = {
  canViewResult,
  filterVisibleResults,
  enforceResultVisibility,
};
