# Slughub - University Result Management System

A production-ready backend system for managing university results, built with Node.js, Express, MySQL, and JWT authentication.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database (mysql2 pool)
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File uploads (CSV processing)

## Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   ├── db.js           # MySQL connection pool
│   │   └── jwt.js          # JWT token generation/verification
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT authentication
│   │   ├── roleMiddleware.js    # Role-based access control
│   │   └── errorHandler.js      # Centralized error handling
│   ├── modules/
│   │   ├── auth/           # Authentication (register, login)
│   │   ├── users/          # User management (CRUD)
│   │   ├── students/       # Student management
│   │   ├── staff/          # Staff management
│   │   ├── courses/        # Course management
│   │   ├── results/        # Result workflow (draft → approved → published)
│   │   ├── gpa/            # GPA calculations
│   │   ├── approvals/      # Approval tracking
│   │   ├── csv/            # CSV batch processing
│   │   └── publications/   # Result publication
│   ├── routes/
│   │   └── index.js        # Route aggregation
│   ├── utils/
│   │   ├── logger.js       # Logging utility
│   │   ├── gpaCalculator.js    # GPA computation
│   │   └── csvParser.js    # CSV parsing
│   ├── app.js              # Express app setup
│   └── server.js           # Server initialization
├── .env                    # Environment variables
├── package.json            # Dependencies
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/konneh-hub/Result-SystemApp.git
   cd Result-SystemApp/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend root with:
   ```env
   PORT=4000
   DB_HOST=DOUBLE
   DB_USER=root
   DB_PASSWORD=Mk@15590
   DB_NAME=slughubresult
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=8h
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:4000`

## Database Schema

Required MySQL tables:
- `users` - System users with roles
- `roles` - User roles (admin, lecturer, hod, dean, exam_officer, student)
- `students` - Student profiles
- `staff` - Staff profiles
- `courses` - Course catalog
- `results` - Result records with workflow status
- `course_registrations` - Student course enrollments
- `result_approvals` - Approval tracking with comments
- `result_publications` - Publication history
- `csv_upload_batches` - CSV upload logs
- `gpa_calculations_log` - GPA calculation history
- `grade_points_map` - Grade to GPA mapping

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login and get JWT token

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user

### Students
- `GET /api/students` - List students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Soft delete student
- `GET /api/students/:id` - Get student profile
- `POST /api/students/:id/register-course` - Register student for course

### Staff
- `GET /api/staff` - List staff
- `POST /api/staff` - Create staff (admin only)
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff (admin only)

### Courses
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Soft delete course
- `POST /api/courses/assign` - Assign lecturer to course

### Results
- `POST /api/results/draft` - Create draft result (lecturer only)
- `PUT /api/results/:id` - Update draft result (lecturer only)
- `POST /api/results/submit/:id` - Submit result for approval (lecturer only)
- `POST /api/results/approve/:id` - Approve result (hod/dean/exam_officer)
- `POST /api/results/reject/:id` - Reject result with comment
- `GET /api/results/published/:studentId` - Get published results

### GPA
- `GET /api/gpa/student/:id/:semester` - Get semester GPA
- `GET /api/gpa/cgpa/:id` - Get cumulative GPA

### CSV Processing
- `POST /api/csv/upload` - Upload CSV file
- `POST /api/csv/process/:batchId` - Process uploaded batch

### Publications
- `POST /api/publications/publish` - Publish results (exam_officer only)
- `GET /api/publications/:studentId` - Get published results

### Approvals
- `GET /api/approvals/history/:resultId` - Get approval history

## Result Workflow

Results follow a strict approval workflow:

1. **Draft** (Lecturer) - Initial result entry
2. **Submitted** (Lecturer) - Submitted for approval
3. **HOD Approved** (HOD) - HOD reviews and approves
4. **Dean Approved** (Dean) - Dean reviews and approves
5. **Verified** (Exam Officer) - Final verification
6. **Published** (Exam Officer) - Results visible to students
7. **Rejected** (Any approver) - Sent back to lecturer for revision

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

## Role-Based Access Control (RBAC)

- **admin** - Full system access
- **lecturer** - Create/submit results, view courses
- **hod** - Approve results, manage department staff
- **dean** - Approve results, manage faculty staff
- **exam_officer** - Verify and publish results
- **student** - View own profile and published results

## Error Handling

All errors are centrally handled and returned as JSON:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `409` - Conflict (duplicate entry)
- `500` - Server error

## Logging

All system actions are logged with timestamps:

```json
{
  "timestamp": "2026-06-03T11:38:51.516Z",
  "level": "info",
  "message": "User logged in",
  "userId": 5,
  "email": "lecturer@university.edu"
}
```

## Security Features

- **Password Hashing** - Bcrypt with salt rounds: 12
- **JWT Tokens** - Secure token generation with 8-hour expiry
- **Role-Based Access** - Middleware enforces permissions
- **Soft Deletes** - Data retention via deleted_at timestamps
- **Input Validation** - Required fields validation on all endpoints

## Production Deployment

### Prerequisites
- Node.js v24.x or higher
- MySQL 5.7+
- Environment variables configured

### Build & Deploy
```bash
npm install --production
npm start
```

## Development

### Run in development mode
```bash
npm start
```

### Check syntax
```bash
node -c src/app.js
```

## Support

For issues or questions, please open an issue on the GitHub repository.

## License

All rights reserved. Slughub © 2026
