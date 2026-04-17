import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function TeacherDashboard() {
  const [studentId, setStudentId] = useState("")
  const [prediction, setPrediction] = useState(null)

  const navigate = useNavigate()

  // 🔥 AI PREDICTION
  const getPrediction = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await API.get(`/attendance/predict/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPrediction(res.data)
    } catch (err) {
      alert("Error fetching prediction")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">

      <h1 className="text-3xl font-bold mb-10">
        Teacher Dashboard 🚀
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 🔮 AI Prediction */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">AI Attendance Prediction 🤖</h2>

          <input
            type="number"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full mb-3 p-2 rounded bg-gray-700"
          />

          <button
            onClick={getPrediction}
            className="bg-blue-600 px-4 py-2 rounded w-full"
          >
            Predict
          </button>

          {prediction && (
            <div className="mt-4">
              <p>📊 Current: {prediction.current_attendance}%</p>
              <p>🔮 Next Week: {prediction.predicted_next_week}%</p>
              <p>⚠️ Risk: {prediction.risk}</p>
            </div>
          )}
        </div>

        {/* 🧾 Attendance */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Attendance</h2>

          <button
            onClick={() => navigate("/teacher-attendance")}
            className="bg-green-600 px-4 py-2 rounded w-full"
          >
            Mark Attendance
          </button>
        </div>

        {/* 📘 Assignment */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Assignments</h2>

          <button
            onClick={() => navigate("/teacher-assignment")}
            className="bg-purple-600 px-4 py-2 rounded w-full"
          >
            Manage Assignments
          </button>
        </div>

        {/* 📝 NEW: Assessment */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Assessment</h2>

          <button
            onClick={() => navigate("/teacher-assessment")}
            className="bg-indigo-600 px-4 py-2 rounded w-full"
          >
            Create Assessment
          </button>
        </div>

        {/* 📊 Quick Actions */}
        <div className="bg-gray-800 p-6 rounded-xl md:col-span-2">
          <h2 className="text-xl mb-4">Quick Actions</h2>

          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-500 px-4 py-2 rounded w-full"
          >
            Refresh Data
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Evaluate Assessments</h2>

          <button
            onClick={() => navigate("/teacher-evaluate")}
            className="bg-red-600 px-4 py-2 rounded w-full"
          >
            Check Submissions
          </button>
        </div>

      </div>
    </div>
  )
}

export default TeacherDashboard