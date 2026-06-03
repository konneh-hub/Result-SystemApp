// ============================================
// PERMISSIONS CONSTANTS
// Slughub Result Management System
// ============================================

const PERMISSIONS = {
  // USERS MODULE
  USERS: {
    CREATE: 'users.create',
    READ: 'users.read',
    UPDATE: 'users.update',
    DELETE: 'users.delete',
    ASSIGN_ROLE: 'users.assign_role',
  },

  // STUDENTS MODULE
  STUDENTS: {
    CREATE: 'students.create',
    READ: 'students.read',
    UPDATE: 'students.update',
    DELETE: 'students.delete',
    REGISTER_COURSE: 'students.register_course',
    VIEW_PROFILE: 'students.view_profile',
  },

  // STAFF MODULE
  STAFF: {
    CREATE: 'staff.create',
    READ: 'staff.read',
    UPDATE: 'staff.update',
    DELETE: 'staff.delete',
    ASSIGN_DEPARTMENT: 'staff.assign_department',
  },

  // COURSES MODULE
  COURSES: {
    CREATE: 'courses.create',
    READ: 'courses.read',
    UPDATE: 'courses.update',
    DELETE: 'courses.delete',
    ASSIGN_LECTURER: 'courses.assign_lecturer',
  },

  // RESULTS MODULE
  RESULTS: {
    CREATE_DRAFT: 'results.create_draft',
    UPDATE_DRAFT: 'results.update_draft',
    SUBMIT: 'results.submit',
    VIEW_ALL: 'results.view_all',
    VIEW_DEPARTMENT: 'results.view_department',
    VIEW_OWN: 'results.view_own',
    EDIT_BEFORE_SUBMIT: 'results.edit_before_submit',
  },

  // APPROVALS MODULE
  APPROVALS: {
    HOD: 'approvals.hod',
    DEAN: 'approvals.dean',
    EXAM_OFFICER: 'approvals.exam_officer',
    APPROVE: 'approvals.approve',
    REJECT: 'approvals.reject',
  },

  // GPA MODULE
  GPA: {
    CALCULATE: 'gpa.calculate',
    RECALCULATE: 'gpa.recalculate',
    VIEW: 'gpa.view',
    CGPA_VIEW: 'cgpa.view',
  },

  // CSV MODULE
  CSV: {
    UPLOAD: 'csv.upload',
    PROCESS: 'csv.process',
    VIEW_LOGS: 'csv.view_logs',
    EXPORT_ERRORS: 'csv.export_errors',
  },

  // PUBLICATIONS MODULE
  PUBLICATIONS: {
    PUBLISH: 'results.publish',
    UNPUBLISH: 'results.unpublish',
    VIEW_PUBLISHED: 'results.view_published',
  },

  // REPORTS MODULE
  REPORTS: {
    DEPARTMENT: 'reports.department',
    FACULTY: 'reports.faculty',
    INSTITUTION: 'reports.institution',
    TRANSCRIPT: 'reports.transcript',
  },

  // SETTINGS MODULE
  SETTINGS: {
    MANAGE: 'settings.manage',
    AUDIT_VIEW: 'audit.view',
    BACKUP: 'system.backup',
    RESTORE: 'system.restore',
  },
};

// ============================================
// ROLE → PERMISSION MAPPING
// ============================================

const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS).flatMap((obj) => Object.values(obj)),

  lecturer: [
    PERMISSIONS.COURSES.READ,
    PERMISSIONS.RESULTS.CREATE_DRAFT,
    PERMISSIONS.RESULTS.UPDATE_DRAFT,
    PERMISSIONS.RESULTS.SUBMIT,
    PERMISSIONS.RESULTS.VIEW_OWN,
    PERMISSIONS.STUDENTS.VIEW_PROFILE,
  ],

  hod: [
    PERMISSIONS.RESULTS.VIEW_DEPARTMENT,
    PERMISSIONS.APPROVALS.HOD,
    PERMISSIONS.APPROVALS.APPROVE,
    PERMISSIONS.APPROVALS.REJECT,
    PERMISSIONS.REPORTS.DEPARTMENT,
    PERMISSIONS.STUDENTS.READ,
    PERMISSIONS.COURSES.READ,
  ],

  dean: [
    PERMISSIONS.RESULTS.VIEW_ALL,
    PERMISSIONS.APPROVALS.DEAN,
    PERMISSIONS.APPROVALS.APPROVE,
    PERMISSIONS.APPROVALS.REJECT,
    PERMISSIONS.REPORTS.FACULTY,
    PERMISSIONS.STUDENTS.READ,
    PERMISSIONS.COURSES.READ,
  ],

  exam_officer: [
    PERMISSIONS.RESULTS.VIEW_ALL,
    PERMISSIONS.APPROVALS.EXAM_OFFICER,
    PERMISSIONS.GPA.CALCULATE,
    PERMISSIONS.GPA.RECALCULATE,
    PERMISSIONS.PUBLICATIONS.PUBLISH,
    PERMISSIONS.PUBLICATIONS.UNPUBLISH,
    PERMISSIONS.CSV.UPLOAD,
    PERMISSIONS.CSV.PROCESS,
    PERMISSIONS.REPORTS.INSTITUTION,
  ],

  student: [
    PERMISSIONS.PUBLICATIONS.VIEW_PUBLISHED,
    PERMISSIONS.GPA.VIEW,
    PERMISSIONS.GPA.CGPA_VIEW,
    PERMISSIONS.COURSES.READ,
    PERMISSIONS.STUDENTS.VIEW_PROFILE,
  ],
};

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
};
