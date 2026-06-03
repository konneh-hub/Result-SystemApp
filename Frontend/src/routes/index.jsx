import React, { Suspense, lazy } from 'react';
import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

// Layout
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const UnauthorizedPage = lazy(() => import('../pages/auth/UnauthorizedPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const UsersManagement = lazy(() => import('../pages/admin/UsersManagement'));
const StudentsManagement = lazy(() => import('../pages/admin/StudentsManagement'));
const StaffManagement = lazy(() => import('../pages/admin/StaffManagement'));
const FacultiesManagement = lazy(() => import('../pages/admin/FacultiesManagement'));
const DepartmentsManagement = lazy(() => import('../pages/admin/DepartmentsManagement'));
const ProgrammesManagement = lazy(() => import('../pages/admin/ProgrammesManagement'));
const CoursesManagement = lazy(() => import('../pages/admin/CoursesManagement'));
const RolesManagement = lazy(() => import('../pages/admin/RolesManagement'));
const PermissionsManagement = lazy(() => import('../pages/admin/PermissionsManagement'));
const ReportsPage = lazy(() => import('../pages/admin/ReportsPage'));
const AuditLogsPage = lazy(() => import('../pages/admin/AuditLogsPage'));
const SystemSettingsPage = lazy(() => import('../pages/admin/SystemSettingsPage'));

// Lecturer Pages
const LecturerDashboard = lazy(() => import('../pages/lecturer/LecturerDashboard'));
const MyCoursesPage = lazy(() => import('../pages/lecturer/MyCoursesPage'));
const StudentsInCoursePage = lazy(() => import('../pages/lecturer/StudentsInCoursePage'));
const UploadResultsPage = lazy(() => import('../pages/lecturer/UploadResultsPage'));
const DraftResultsPage = lazy(() => import('../pages/lecturer/DraftResultsPage'));
const SubmittedResultsPage = lazy(() => import('../pages/lecturer/SubmittedResultsPage'));
const ResultHistoryPage = lazy(() => import('../pages/lecturer/ResultHistoryPage'));
const LecturerProfilePage = lazy(() => import('../pages/lecturer/LecturerProfilePage'));

// HOD Pages
const HODDashboard = lazy(() => import('../pages/hod/HODDashboard'));
const DepartmentStudentsPage = lazy(() => import('../pages/hod/DepartmentStudentsPage'));
const DepartmentLecturersPage = lazy(() => import('../pages/hod/DepartmentLecturersPage'));
const PendingApprovalsPage = lazy(() => import('../pages/hod/PendingApprovalsPage'));
const ApprovedResultsPage = lazy(() => import('../pages/hod/ApprovedResultsPage'));
const RejectedResultsPage = lazy(() => import('../pages/hod/RejectedResultsPage'));
const HODReportsPage = lazy(() => import('../pages/hod/HODReportsPage'));
const GraduationRecommendationsPage = lazy(() =>
  import('../pages/hod/GraduationRecommendationsPage')
);

// Dean Pages
const DeanDashboard = lazy(() => import('../pages/dean/DeanDashboard'));
const FacultyDepartmentsPage = lazy(() => import('../pages/dean/FacultyDepartmentsPage'));
const FacultyResultsPage = lazy(() => import('../pages/dean/FacultyResultsPage'));
const DeanApprovalsPage = lazy(() => import('../pages/dean/DeanApprovalsPage'));
const FacultyStatisticsPage = lazy(() => import('../pages/dean/FacultyStatisticsPage'));
const DeanReportsPage = lazy(() => import('../pages/dean/DeanReportsPage'));

// Exam Officer Pages
const ExamOfficerDashboard = lazy(() => import('../pages/examOfficer/ExamOfficerDashboard'));
const VerifyResultsPage = lazy(() => import('../pages/examOfficer/VerifyResultsPage'));
const GPAProcessingPage = lazy(() => import('../pages/examOfficer/GPAProcessingPage'));
const CGPAProcessingPage = lazy(() => import('../pages/examOfficer/CGPAProcessingPage'));
const ResultPublishingPage = lazy(() => import('../pages/examOfficer/ResultPublishingPage'));
const CarryOversPage = lazy(() => import('../pages/examOfficer/CarryOversPage'));
const TranscriptRequestsPage = lazy(() => import('../pages/examOfficer/TranscriptRequestsPage'));
const CSVUploadsPage = lazy(() => import('../pages/examOfficer/CSVUploadsPage'));
const ExamOfficerStatisticsPage = lazy(() =>
  import('../pages/examOfficer/ExamOfficerStatisticsPage')
);
const ExamOfficerReportsPage = lazy(() => import('../pages/examOfficer/ExamOfficerReportsPage'));

// Student Pages
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const StudentProfilePage = lazy(() => import('../pages/student/StudentProfilePage'));
const CourseRegistrationPage = lazy(() => import('../pages/student/CourseRegistrationPage'));
const RegisteredCoursesPage = lazy(() => import('../pages/student/RegisteredCoursesPage'));
const SemesterResultsPage = lazy(() => import('../pages/student/SemesterResultsPage'));
const StudentGPAPage = lazy(() => import('../pages/student/StudentGPAPage'));
const StudentCGPAPage = lazy(() => import('../pages/student/StudentCGPAPage'));
const TranscriptRequestPage = lazy(() => import('../pages/student/TranscriptRequestPage'));
const ResultAppealsPage = lazy(() => import('../pages/student/ResultAppealsPage'));
const StudentNotificationsPage = lazy(() => import('../pages/student/StudentNotificationsPage'));

// 404 Page
const NotFoundPage = lazy(() => import('../pages/auth/NotFoundPage'));

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

const Routes = () => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ReactRoutes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to={`/${userRole}`} replace /> : <AuthLayout />
          }
        >
          <Route index element={<LoginPage />} />
        </Route>

        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? <Navigate to={`/${userRole}`} replace /> : <AuthLayout />
          }
        >
          <Route index element={<ForgotPasswordPage />} />
        </Route>

        <Route
          path="/reset-password/:token"
          element={
            isAuthenticated ? <Navigate to={`/${userRole}`} replace /> : <AuthLayout />
          }
        >
          <Route index element={<ResetPasswordPage />} />
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="students" element={<StudentsManagement />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="faculties" element={<FacultiesManagement />} />
          <Route path="departments" element={<DepartmentsManagement />} />
          <Route path="programmes" element={<ProgrammesManagement />} />
          <Route path="courses" element={<CoursesManagement />} />
          <Route path="roles" element={<RolesManagement />} />
          <Route path="permissions" element={<PermissionsManagement />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
        </Route>

        {/* Lecturer Routes */}
        <Route
          path="/lecturer/*"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<LecturerDashboard />} />
          <Route path="dashboard" element={<LecturerDashboard />} />
          <Route path="courses" element={<MyCoursesPage />} />
          <Route path="courses/:courseId/students" element={<StudentsInCoursePage />} />
          <Route path="results/upload" element={<UploadResultsPage />} />
          <Route path="results/draft" element={<DraftResultsPage />} />
          <Route path="results/submitted" element={<SubmittedResultsPage />} />
          <Route path="results/history" element={<ResultHistoryPage />} />
          <Route path="profile" element={<LecturerProfilePage />} />
        </Route>

        {/* HOD Routes */}
        <Route
          path="/hod/*"
          element={
            <ProtectedRoute allowedRoles={['hod']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<HODDashboard />} />
          <Route path="dashboard" element={<HODDashboard />} />
          <Route path="students" element={<DepartmentStudentsPage />} />
          <Route path="lecturers" element={<DepartmentLecturersPage />} />
          <Route path="approvals" element={<PendingApprovalsPage />} />
          <Route path="approved-results" element={<ApprovedResultsPage />} />
          <Route path="rejected-results" element={<RejectedResultsPage />} />
          <Route path="reports" element={<HODReportsPage />} />
          <Route path="graduation-recommendations" element={<GraduationRecommendationsPage />} />
        </Route>

        {/* Dean Routes */}
        <Route
          path="/dean/*"
          element={
            <ProtectedRoute allowedRoles={['dean']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<DeanDashboard />} />
          <Route path="dashboard" element={<DeanDashboard />} />
          <Route path="departments" element={<FacultyDepartmentsPage />} />
          <Route path="results" element={<FacultyResultsPage />} />
          <Route path="approvals" element={<DeanApprovalsPage />} />
          <Route path="statistics" element={<FacultyStatisticsPage />} />
          <Route path="reports" element={<DeanReportsPage />} />
        </Route>

        {/* Exam Officer Routes */}
        <Route
          path="/exam-officer/*"
          element={
            <ProtectedRoute allowedRoles={['exam_officer']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<ExamOfficerDashboard />} />
          <Route path="dashboard" element={<ExamOfficerDashboard />} />
          <Route path="verify-results" element={<VerifyResultsPage />} />
          <Route path="gpa-processing" element={<GPAProcessingPage />} />
          <Route path="cgpa-processing" element={<CGPAProcessingPage />} />
          <Route path="result-publishing" element={<ResultPublishingPage />} />
          <Route path="carry-overs" element={<CarryOversPage />} />
          <Route path="transcript-requests" element={<TranscriptRequestsPage />} />
          <Route path="csv-uploads" element={<CSVUploadsPage />} />
          <Route path="statistics" element={<ExamOfficerStatisticsPage />} />
          <Route path="reports" element={<ExamOfficerReportsPage />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="course-registration" element={<CourseRegistrationPage />} />
          <Route path="registered-courses" element={<RegisteredCoursesPage />} />
          <Route path="results" element={<SemesterResultsPage />} />
          <Route path="gpa" element={<StudentGPAPage />} />
          <Route path="cgpa" element={<StudentCGPAPage />} />
          <Route path="transcript-request" element={<TranscriptRequestPage />} />
          <Route path="result-appeals" element={<ResultAppealsPage />} />
          <Route path="notifications" element={<StudentNotificationsPage />} />
        </Route>

        {/* Redirect root to login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userRole}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </ReactRoutes>
    </Suspense>
  );
};

export default Routes;
