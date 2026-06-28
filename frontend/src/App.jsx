import { Routes, Route } from "react-router-dom"

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
import AuthPage from "./pages/AuthPage"
import AdminManageTeachers from "./pages/AdminManageTeachers";
import AdminAddTeacher from "./pages/AdminAddTeacher";
import AdminEditTeacher from "./pages/AdminEditTeacher";
import AdminLayout from "./layouts/AdminLayout";
import AdminManageSubjects from "./pages/AdminManageSubjects";
import AdminAddSubject from "./pages/AdminAddSubject";
import AdminEditSubject from "./pages/AdminEditSubject";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}> <AdminLayout /> </ProtectedRoute>
        }
      >

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin-manage-teachers"
          element={<AdminManageTeachers />}
        />

        <Route
          path="/admin-add-teacher"
          element={<AdminAddTeacher />}
        />

        <Route
          path="/admin-edit-teacher/:id"
          element={<AdminEditTeacher />}
        /> 
        
        <Route
          path="/admin-manage-subjects"
          element={<AdminManageSubjects />}
        />

        <Route
          path="/admin-add-subject"
          element={<AdminAddSubject />}
        />

        <Route
          path="/admin-edit-subject/:id"
          element={<AdminEditSubject />}
        />

        </Route>


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