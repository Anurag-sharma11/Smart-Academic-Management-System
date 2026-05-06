import { Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/AdminDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import StudentDashboard from "./pages/StudentDashboard"
import TeacherAttendance from "./pages/TeacherAttendance"
import StudentAttendance from "./pages/StudentAttendance"
import ProtectedRoute from "./components/ProtectedRoute"
import TeacherAssignment from "./pages/TeacherAssignment"
import StudentAssignment from "./pages/StudentAssignment"
import TeacherAssessment from "./pages/TeacherAssessment"
import StudentAssessment from "./pages/StudentAssessment"
import TeacherEvaluate from "./pages/TeacherEvaluate"
import TeacherAddStudent from "./pages/TeacherAddStudent"
import TeacherManageStudents from "./pages/TeacherManageStudents"
import TeacherAttendanceHistory from "./pages/TeacherAttendanceHistory"
import TeacherAnalytics from "./pages/TeacherAnalytics"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Teacher Dashboard */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* 🔥 NEW: Teacher Attendance */}
      <Route
        path="/teacher-attendance"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherAttendance />
          </ProtectedRoute>
        }
      />

      {/* 🔥 NEW: Student Attendance */}
      <Route
        path="/student-attendance"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentAttendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-assignment"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherAssignment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-assignments"
        element={
          <ProtectedRoute allowedRoles={["admin", "student"]}>
            <StudentAssignment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-assessment"
        element={
          <ProtectedRoute allowedRoles={["admin", "student"]}>
            <StudentAssessment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-assessment"
        element={
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <TeacherAssessment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-evaluate"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherEvaluate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-add-student"
        element={
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <TeacherAddStudent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-manage-students"
        element={
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <TeacherManageStudents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-attendance-history"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherAttendanceHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-analytics"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherAnalytics />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App