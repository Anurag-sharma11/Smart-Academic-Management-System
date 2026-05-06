import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function TeacherDashboard() {
  const [studentId, setStudentId] = useState("")
  const [subject, setSubject] = useState("")
  const [prediction, setPrediction] = useState(null)

  const navigate = useNavigate()

  // SUBJECT-WISE AI PREDICTION
  const getPrediction = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await API.post(
        "/attendance/predict",
        {
          student_id: studentId,
          subject: subject
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setPrediction(res.data)

    } catch (err) {
      console.log("FULL ERROR:", err)
      console.log("RESPONSE:", err.response)
      console.log("DATA:", err.response?.data)
      alert("Error fetching prediction")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">

      <h1 className="text-3xl font-bold mb-10">
        Teacher Dashboard 🚀
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* SUBJECT-WISE AI PREDICTION */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">
            Subject-wise Attendance Prediction 🤖
          </h2>

          <input
            type="text"
            placeholder="Enter Student ID / Enrollment No"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full mb-3 p-2 rounded bg-gray-700"
          />

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mb-3 p-2 rounded bg-gray-700"
          >
            <option value="">Select Subject</option>
            <option value="DBMS">DBMS</option>
            <option value="OS">OS</option>
            <option value="DS">DS</option>
            <option value="CN">CN</option>
            <option value="Maths">Maths</option>
            <option value="DS Lab">DS Lab</option>
            <option value="OS Lab">OS Lab</option>
          </select>

          <button
            onClick={getPrediction}
            className="bg-blue-600 px-4 py-2 rounded w-full"
          >
            Predict
          </button>

          {prediction && (
            <div className="mt-4 space-y-1">
              <p>👤 {prediction.student_name}</p>
              <p>📘 Subject: {prediction.subject}</p>
              <p>📊 Current: {prediction.current_attendance}%</p>
              <p>🔮 Next Week: {prediction.predicted_next_week}%</p>

              <p
                className={
                  prediction.risk === "High Risk"
                    ? "text-red-400 font-bold"
                    : prediction.risk === "Medium Risk"
                    ? "text-yellow-400 font-bold"
                    : "text-green-400 font-bold"
                }
              >
                ⚠️ {prediction.risk}
              </p>

              <p>🎯 Accuracy: {prediction.accuracy}%</p>
              <p>📉 MAE: {prediction.mae}</p>
            </div>
          )}
        </div>

        {/* NEW STUDENTS */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">New Student</h2>

          <button
            onClick={() => navigate("/teacher-add-student")}
            className="bg-cyan-600 px-4 py-2 rounded w-full"
          >
            Add Student
          </button>
        </div>

        {/* MANAGE STUDENTS */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Manage Students</h2>

          <button
            onClick={() => navigate("/teacher-manage-students")}
            className="bg-teal-600 px-4 py-2 rounded w-full"
          >
            View / Edit Students
          </button>
        </div>

        {/* ATTENDANCE */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Attendance</h2>

          <button
            onClick={() => navigate("/teacher-attendance")}
            className="bg-green-600 px-4 py-2 rounded w-full"
          >
            Mark Attendance
          </button>
        </div>

        {/* ASSIGNMENTS */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Assignments</h2>

          <button
            onClick={() => navigate("/teacher-assignment")}
            className="bg-purple-600 px-4 py-2 rounded w-full"
          >
            Manage Assignments
          </button>
        </div>

        {/* ASSESSMENT */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Assessment</h2>

          <button
            onClick={() => navigate("/teacher-assessment")}
            className="bg-indigo-600 px-4 py-2 rounded w-full"
          >
            Create Assessment
          </button>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-gray-800 p-6 rounded-xl md:col-span-2">
          <h2 className="text-xl mb-4">Quick Actions</h2>

          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-500 px-4 py-2 rounded w-full"
          >
            Refresh Data
          </button>
        </div>

        {/* EVALUATE */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Evaluate Assessments</h2>

          <button
            onClick={() => navigate("/teacher-evaluate")}
            className="bg-red-600 px-4 py-2 rounded w-full"
          >
            Check Submissions
          </button>
        </div>
        
        {/* Insights */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">
            Student Insights Report
          </h2>

          <button
            onClick={() => navigate("/teacher-analytics")}
            className="bg-pink-600 px-4 py-2 rounded w-full"
          >
            View Analytics
          </button>
        </div>

      </div>
    </div>
  )
}

export default TeacherDashboard