import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function StudentDashboard() {
  const [data, setData] = useState(null)
  const [predictionData, setPredictionData] = useState(null)

  const navigate = useNavigate()

  // 📊 FETCH DASHBOARD DATA
  const fetchData = async () => {
    try {
      const res = await API.get("/student/dashboard")
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // 🤖 FETCH ML PREDICTION
  const fetchPrediction = async (studentId) => {
    try {
      const res = await API.get(`/attendance/predict/${studentId}`)
      setPredictionData(res.data)
    } catch (err) {
      console.log("Prediction error:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (data && data.student_id) {
      fetchPrediction(data.student_id)
    }
  }, [data])

  if (!data) return <p className="text-white p-10">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">

      <h1 className="text-3xl font-bold mb-6">
        Student Dashboard 🎓
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 📊 ATTENDANCE */}
        <div
          onClick={() => navigate("/student-attendance")}
          className="bg-gray-800 p-5 rounded cursor-pointer hover:bg-gray-700 transition"
        >
          <h2>📊 Attendance</h2>
          <p className="text-2xl">{data.attendance}%</p>
        </div>

        {/* 🤖 ML PREDICTION */}
        <div
          onClick={() => navigate("/student-attendance")}
          className="bg-gray-800 p-5 rounded cursor-pointer hover:bg-gray-700 transition"
        >
          <h2>🤖 Prediction</h2>

          {predictionData ? (
            <>
              <p className="text-2xl">
                {predictionData.predicted_next_week}%
              </p>

              <p
                className={
                  predictionData.risk === "High Risk"
                    ? "text-red-500 font-bold"
                    : predictionData.risk === "Medium Risk"
                      ? "text-yellow-400 font-bold"
                      : "text-green-400 font-bold"
                }
              >
                {predictionData.risk}
              </p>

              <div className="mt-2 text-sm text-gray-400">
                <div>Accuracy: {predictionData.accuracy}%</div>
                <div>MAE: {predictionData.mae}</div>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* 📘 TOTAL ASSIGNMENTS */}
        <div
          onClick={() => navigate("/student-assignments")}
          className="bg-gray-800 p-5 rounded cursor-pointer hover:bg-gray-700 transition"
        >
          <h2>📘 Total Assignments</h2>
          <p className="text-2xl">{data.total_assignments}</p>
        </div>

        {/* 📝 NEW: ASSESSMENT (ADDED) */}
        <div
          onClick={() => navigate("/student-assessment")}
          className="bg-gray-800 p-5 rounded cursor-pointer hover:bg-gray-700 transition border border-indigo-500"
        >
          <h2>📝 Assessments</h2>
          <p className="text-sm text-gray-400 mt-2">
            Attempt your tests
          </p>
        </div>

        {/* ✅ SUBMITTED */}
        <div
          onClick={() => navigate("/student-assignments?filter=submitted")}
          className="bg-gray-800 p-5 rounded cursor-pointer hover:bg-gray-700 transition"
        >
          <h2>✅ Submitted</h2>
          <p className="text-2xl">{data.submitted}</p>
        </div>

        {/* ⏳ PENDING */}
        <div
          onClick={() => navigate("/student-assignments?filter=pending")}
          className="bg-gray-800 p-5 rounded cursor-pointer hover:bg-gray-700 transition"
        >
          <h2>⏳ Pending</h2>
          <p className="text-2xl">{data.pending}</p>
        </div>

        {/* 🎯 AVG MARKS */}
        <div
          onClick={() => navigate("/student-assignments")}
          className="bg-gray-800 p-5 rounded cursor-pointer hover:bg-gray-700 transition"
        >
          <h2>🎯 Avg Marks</h2>
          <p className="text-2xl">{data.avg_marks}</p>
        </div>

      </div>
    </div>
  )
}

export default StudentDashboard