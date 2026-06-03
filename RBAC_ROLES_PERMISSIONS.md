# Slughub RBAC System - Roles, Responsibilities & Permissions

## 🎭 Core Roles

| Role | Description | System Scope |
|------|-------------|--------------|
| **admin** | System owner with full control | Entire system |
| **lecturer** | Upload and manage course results | Own courses only |
| **hod** | Department-level approval | Department results |
| **dean** | Faculty-level approval | Faculty results |
| **exam_officer** | Final verification, GPA, publishing | Entire system |
| **student** | View-only personal results | Own published results |

---

## 📦 Permission Modules

### 1. **USERS Module**
- `users.create` - Create new user
- `users.read` - View user information
- `users.update` - Update user details
- `users.delete` - Deactivate user
- `users.assign_role` - Assign role to user

**Who has access:**
- ✅ **Admin** - All permissions
- ❌ Others - No access

---

### 2. **STUDENTS Module**
- `students.create` - Create student record
- `students.read` - Read student information
- `students.update` - Update student details
- `students.delete` - Soft delete student
- `students.register_course` - Register student for course
- `students.view_profile` - View own profile

**Who has access:**
- ✅ **Admin** - All permissions
- ✅ **Lecturer** - `students.view_profile` (read-only)
- ✅ **HOD** - `students.read`, `students.view_profile`
- ✅ **Dean** - `students.read`, `students.view_profile`
- ✅ **Student** - `students.view_profile` (own only)

---

### 3. **STAFF Module**
- `staff.create` - Create staff record
- `staff.read` - Read staff information
- `staff.update` - Update staff details
- `staff.delete` - Delete staff record
- `staff.assign_department` - Assign staff to department

**Who has access:**
- ✅ **Admin** - All permissions
- ❌ Others - No access

---

### 4. **COURSES Module**
- `courses.create` - Create new course
- `courses.read` - View course information
- `courses.update` - Update course details
- `courses.delete` - Soft delete course
- `courses.assign_lecturer` - Assign lecturer to course

**Who has access:**
- ✅ **Admin** - All permissions
- ✅ **Lecturer** - `courses.read` (read-only)
- ✅ **HOD** - `courses.read`
- ✅ **Dean** - `courses.read`
- ✅ **Student** - `courses.read`

---

### 5. **RESULTS Module** (⭐ CRITICAL)
- `results.create_draft` - Create draft result (lecturer only)
- `results.update_draft` - Update draft result (lecturer only)
- `results.submit` - Submit result for approval
- `results.view_all` - View all results in system
- `results.view_department` - View department results only
- `results.view_own` - View own/personal results
- `results.edit_before_submit` - Edit result before submission

**Who has access:**
- ✅ **Admin** - All permissions
- ✅ **Lecturer** - `create_draft`, `update_draft`, `submit`, `view_own`
- ✅ **HOD** - `view_department`, `view_own`
- ✅ **Dean** - `view_all`
- ✅ **Exam Officer** - `view_all`
- ✅ **Student** - None (access controlled via visibility rules)

**Status-Based Visibility Rules:**
| Status | Visible To |
|--------|-----------|
| draft | Lecturer who created it only |
| submitted | Lecturer + HOD |
| hod_approved | Lecturer + HOD + Dean |
| dean_approved | Dean + Exam Officer |
| verified | Exam Officer only |
| published | Students (own) + All staff |
| rejected | Lecturer + Approver |

---

### 6. **APPROVALS Module** (⭐ CRITICAL)
- `approvals.hod` - HOD approval capability
- `approvals.dean` - Dean approval capability
- `approvals.exam_officer` - Exam officer verification capability
- `approvals.approve` - Generic approve action
- `approvals.reject` - Generic reject action

**Approval Workflow:**
```
Lecturer submits → HOD approves → Dean approves → Exam Officer verifies → Published
                ↓                ↓                ↓
            Can reject at any stage, result returns to Lecturer
```

**Who has access:**
- ✅ **Admin** - All approvals
- ✅ **HOD** - Can approve/reject submitted results
- ✅ **Dean** - Can approve/reject HOD-approved results
- ✅ **Exam Officer** - Can verify dean-approved results

---

### 7. **GPA Module** (⭐ CRITICAL)
- `gpa.calculate` - Calculate student GPA (exam_officer ONLY)
- `gpa.recalculate` - Recalculate GPA
- `gpa.view` - View GPA information
- `cgpa.view` - View cumulative GPA

**Critical Business Rule:**
🚫 **ONLY EXAM_OFFICER can:**
- Calculate GPA
- Recalculate GPA
- Publish CGPA

**Who has access:**
- ✅ **Admin** - All GPA operations
- ✅ **Exam Officer** - `calculate`, `recalculate`, `view`, `cgpa.view`
- ✅ **Lecturer** - `view`
- ✅ **HOD** - `view`
- ✅ **Dean** - `view`
- ✅ **Student** - `view`, `cgpa.view` (own only)

---

### 8. **CSV Module**
- `csv.upload` - Upload CSV file
- `csv.process` - Process uploaded batch
- `csv.view_logs` - View upload logs
- `csv.export_errors` - Export processing errors

**Who has access:**
- ✅ **Admin** - All CSV operations
- ✅ **Exam Officer** - All CSV operations

---

### 9. **PUBLICATIONS Module** (⭐ CRITICAL)
- `results.publish` - Publish results (exam_officer ONLY)
- `results.unpublish` - Unpublish results
- `results.view_published` - View published results

**Critical Business Rule:**
🚫 **Students MUST NEVER:**
- See draft results
- See submitted results
- See approval comments
- See raw results table

✅ **Students CAN:**
- View own published results only
- View GPA/CGPA after publication

**Who has access:**
- ✅ **Admin** - All publication operations
- ✅ **Exam Officer** - `publish`, `unpublish`, `view_published`
- ✅ **Student** - `view_published` (own only)

---

### 10. **REPORTS Module**
- `reports.department` - Generate department reports
- `reports.faculty` - Generate faculty reports
- `reports.institution` - Generate institution reports
- `reports.transcript` - Generate transcript reports

**Who has access:**
- ✅ **Admin** - All reports
- ✅ **HOD** - `department`
- ✅ **Dean** - `faculty`
- ✅ **Exam Officer** - `institution`

---

### 11. **SETTINGS Module** (Admin only)
- `settings.manage` - Manage system settings
- `audit.view` - View audit logs
- `system.backup` - Perform system backup
- `system.restore` - Restore from backup

**Who has access:**
- ✅ **Admin** - All settings operations
- ❌ Others - No access

---

## 🔐 Critical Security Rules

### 1. Result Visibility Rule
```javascript
// NEVER allow students to see:
- draft results
- submitted results
- approval comments
- approver feedback
- rejection reasons (without explicit permission)
```

### 2. GPA Rule
```javascript
// ONLY exam_officer can:
- calculate GPA from results
- recalculate GPA
- publish CGPA
```

### 3. Data Integrity Rule
```javascript
// Students MUST NEVER:
- access raw results table
- access approval tables
- access calculation logs
- see other students' data
```

---

## 📊 Role Responsibility Matrix

### ADMIN
**Responsibilities:**
- System configuration and maintenance
- User creation and role assignment
- Emergency overrides and system fixes
- Audit log review
- Backup and restoration

**Permissions:** All 80+ permissions

---

### LECTURER
**Responsibilities:**
- Create and maintain draft results
- Submit results for approval
- Update results before submission
- Monitor own course results

**Permissions:**
- `courses.read`
- `results.create_draft`
- `results.update_draft`
- `results.submit`
- `results.view_own`
- `students.view_profile`

**Cannot:**
- Approve results
- Publish results
- Access other lecturers' results

---

### HOD (Head of Department)
**Responsibilities:**
- Review submitted results from department lecturers
- Approve or reject results
- Monitor department performance
- Generate department reports

**Permissions:**
- `results.view_department`
- `approvals.hod`
- `approvals.approve`
- `approvals.reject`
- `reports.department`
- `students.read`
- `courses.read`

**Cannot:**
- Publish final results
- Calculate GPA
- Access other departments

---

### DEAN (Faculty Leader)
**Responsibilities:**
- Review HOD-approved results
- Approve or reject for final verification
- Monitor faculty performance
- Generate faculty reports

**Permissions:**
- `results.view_all`
- `approvals.dean`
- `approvals.approve`
- `approvals.reject`
- `reports.faculty`
- `students.read`
- `courses.read`

**Cannot:**
- Publish final results
- Modify results
- Access system settings

---

### EXAM_OFFICER (⭐ CRITICAL ROLE)
**Responsibilities:**
- Final result verification before publication
- GPA and CGPA calculation
- Publish results to students
- Handle CSV batch processing
- Generate institutional reports

**Permissions:**
- `results.view_all`
- `approvals.exam_officer`
- `gpa.calculate`
- `gpa.recalculate`
- `results.publish`
- `results.unpublish`
- `csv.upload`
- `csv.process`
- `reports.institution`

**Critical Abilities:**
- ✅ Only role that can publish results
- ✅ Only role that can calculate GPA
- ✅ Only role that can recalculate GPA

---

### STUDENT
**Responsibilities:**
- View own published results
- Check GPA/CGPA after publication
- Access transcript

**Permissions:**
- `results.view_published` (own only)
- `gpa.view` (own only)
- `cgpa.view` (own only)
- `courses.read`
- `students.view_profile` (own only)

**Restrictions:**
- ❌ Cannot see draft results
- ❌ Cannot see submitted results
- ❌ Cannot see approval comments
- ❌ Cannot see other students' results
- ❌ Cannot see calculation logs

---

## 🛡️ Access Control Implementation

### Permission Check Pattern
```javascript
// Check single permission
const hasPermission = permissionService.hasPermission(role, PERMISSIONS.RESULTS.CREATE_DRAFT);

// Check any of multiple permissions
const hasAnyPermission = permissionService.hasAnyPermission(role, [
  PERMISSIONS.APPROVALS.APPROVE,
  PERMISSIONS.APPROVALS.REJECT
]);

// Check all permissions required
const hasAllPermissions = permissionService.hasAllPermissions(role, [
  PERMISSIONS.RESULTS.VIEW_ALL,
  PERMISSIONS.GPA.CALCULATE
]);
```

### Middleware Usage
```javascript
// Basic role check
router.get('/results', roleMiddleware(['admin', 'lecturer']), controller);

// Permission check
router.post('/results/draft', permissionMiddleware([PERMISSIONS.RESULTS.CREATE_DRAFT]), controller);

// Multiple permissions (any)
router.post('/results/approve', permissionMiddleware([
  PERMISSIONS.APPROVALS.APPROVE,
  PERMISSIONS.APPROVALS.REJECT
], false), controller);

// Result visibility enforcement
router.get('/results/:id', enforceResultVisibility, controller);
```

---

## 📋 Approval Workflow State Machine

```
START
  ↓
[Draft] ← Only Lecturer can edit
  ↓
[Submitted] ← Lecturer submits
  ↓
  ├─ HOD Reviews
  │   ├─ REJECT → Back to Draft + notification to Lecturer
  │   └─ APPROVE → Next stage
  │
[HOD Approved]
  ↓
  ├─ Dean Reviews
  │   ├─ REJECT → Back to Draft + notification
  │   └─ APPROVE → Next stage
  │
[Dean Approved]
  ↓
  ├─ Exam Officer Verifies
  │   ├─ REJECT → Back to Draft
  │   └─ VERIFY → Ready for publication
  │
[Verified]
  ↓
[Published] ← Students can now see
```

---

## 🚨 Enforcement Points

| Rule | Enforced At | Service |
|------|-------------|---------|
| Result visibility | `resultVisibilityService.js` | Query-time filtering |
| GPA calculation | `gpaAccessService.js` | Request validation |
| Student data access | `authMiddleware.js` | Reject if unauthorized |
| Result status workflow | Controller logic | Prevent invalid transitions |
| CSV processing | CSV controller | Batch validation |

---

## 📝 Notes

- All permissions are case-sensitive
- Roles are immutable (cannot be created ad-hoc)
- Permission checks happen at middleware AND controller level
- Result visibility is enforced at query level AND response filtering
- Audit logs track all permission-based actions
