# API Endpoints Documentation

## Base URL
All requests use the base URL from environment: `VITE_API_URL` (default: http://localhost:5000)

## Authentication Endpoints

### POST /auth/login
Login user and receive JWT token
```javascript
Request: { email: string, password: string }
Response: { token: string, user: { id, email, firstName, lastName, role } }
```

### POST /auth/register
Register new user
```javascript
Request: { email, password, firstName, lastName, role }
Response: { user: { ...userData } }
```

### POST /auth/forgot-password
Request password reset email
```javascript
Request: { email: string }
Response: { message: string }
```

### POST /auth/reset-password
Reset password with token
```javascript
Request: { token, password, confirmPassword }
Response: { message: string }
```

### PUT /auth/profile
Update user profile
```javascript
Request: { firstName, lastName, email, ...other fields }
Response: { user: { ...updatedUser } }
```

## Student Endpoints

### GET /students
Get all students
```javascript
Response: { data: [ { id, email, firstName, lastName, ... } ] }
```

### GET /students/:id
Get student by ID
```javascript
Response: { data: { ...studentData } }
```

### POST /students
Create new student
```javascript
Request: { email, firstName, lastName, studentId, ... }
Response: { data: { ...newStudent } }
```

### PUT /students/:id
Update student
```javascript
Request: { firstName, lastName, ... }
Response: { data: { ...updatedStudent } }
```

### GET /students/:studentId/results
Get student results
```javascript
Response: { data: [ { courseId, courseName, score, grade, ... } ] }
```

### GET /students/:studentId/gpa
Get student GPA
```javascript
Response: { data: { semester, gpa, courses: [ ... ] } }
```

### GET /students/:studentId/cgpa
Get student CGPA
```javascript
Response: { data: { cgpa, history: [ ... ] } }
```

## Course Endpoints

### GET /courses
Get all courses
```javascript
Response: { data: [ { id, code, name, lecturerId, ... } ] }
```

### GET /courses/:id
Get course by ID
```javascript
Response: { data: { ...courseData } }
```

### POST /courses
Create course
```javascript
Request: { code, name, lecturerId, departmentId, units, ... }
Response: { data: { ...newCourse } }
```

### GET /courses/:courseId/students
Get enrolled students
```javascript
Response: { data: [ { id, email, firstName, lastName, ... } ] }
```

## Result Endpoints

### POST /results
Create result
```javascript
Request: { studentId, courseId, caScore, examScore, ... }
Response: { data: { ...result } }
```

### GET /results/student/:studentId
Get student results
```javascript
Response: { data: [ { courseId, caScore, examScore, total, grade, ... } ] }
```

### POST /results/upload
Upload results (CSV)
```javascript
Request: FormData with CSV file
Response: { data: { uploaded: number, errors: [] } }
```

### POST /results/submit
Submit results for approval
```javascript
Request: { resultIds: [ ... ] }
Response: { data: { submitted: number } }
```

### GET /results/pending-approval
Get pending approvals
```javascript
Response: { data: [ { ...resultData, status: 'pending' } ] }
```

### POST /results/:id/approve
Approve result
```javascript
Request: { comment?: string }
Response: { data: { ...approvedResult } }
```

### POST /results/:id/reject
Reject result
```javascript
Request: { reason: string }
Response: { data: { ...rejectedResult } }
```

## GPA Endpoints

### POST /gpa/calculate
Calculate student GPA
```javascript
Request: { studentId, semester }
Response: { data: { gpa: number, courseDetails: [ ... ] } }
```

### POST /gpa/cgpa/calculate
Calculate CGPA
```javascript
Request: { studentId }
Response: { data: { cgpa: number, semesters: [ ... ] } }
```

## Admin Endpoints

### GET /admin/dashboard/stats
Get dashboard statistics
```javascript
Response: { data: { totalStudents, totalStaff, totalCourses, totalFaculties, totalDepartments } }
```

### GET /admin/logs
Get system logs
```javascript
Response: { data: [ { id, action, userId, timestamp, ... } ] }
```

### GET /admin/audit-logs
Get audit logs
```javascript
Response: { data: [ { id, action, userId, changes, timestamp, ... } ] }
```

## Department Endpoints

### GET /departments
Get all departments
```javascript
Response: { data: [ { id, name, facultyId, hodId, ... } ] }
```

### GET /departments/:id
Get department by ID
```javascript
Response: { data: { ...departmentData } }
```

### GET /faculties/:facultyId/departments
Get faculty departments
```javascript
Response: { data: [ { ...departmentData } ] }
```

## Faculty Endpoints

### GET /faculties
Get all faculties
```javascript
Response: { data: [ { id, name, deanId, ... } ] }
```

### GET /faculties/:id
Get faculty by ID
```javascript
Response: { data: { ...facultyData } }
```

## Error Responses

All errors follow this format:
```javascript
{ 
  status: number,
  message: string,
  errors?: { field: [ "error message" ] }
}
```

### Common Status Codes
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

## Authentication Header

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

The token is automatically added by axios interceptor.

---

For complete API documentation, refer to backend README.md or Swagger docs.
