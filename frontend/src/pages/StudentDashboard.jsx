import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./StudentDashboard.css"

function StudentDashboard() {
  const [data, setData] = useState(null)

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


  useEffect(() => {
    fetchData()
  }, [])


  if (!data) return <p className="text-white p-10">Loading...</p>

  return (
    <div className="student-dashboard-page">

      {/* HEADER */}

      <div className="student-dashboard-header">

        <div>

          <h1>Welcome Back 🎓</h1>

          <p>
            Track your academics, attendance and performance insights.
          </p>

        </div>

        <div className="student-profile-badge">
          STUDENT PORTAL
        </div>

      </div>

      {/* DASHBOARD GRID */}

      <div className="student-dashboard-grid">

        {/* ATTENDANCE */}

        <div
          onClick={() => navigate("/student-attendance")}
          className="dashboard-card attendance-card"
        >

          <div className="card-icon">
            📊
          </div>

          <h2>Attendance</h2>

          <h1>{data.attendance}%</h1>

          <p>
            Overall attendance percentage
          </p>

        </div>

        {/* PREDICTION */}

        <div
          onClick={() => navigate("/student-attendance")}
          className="dashboard-card prediction-card"
        >

          <div className="card-icon">
            🤖
          </div>

          <h2>AI Prediction</h2>
          <p className="text-2xl">
            AI Module Restricted
          </p>

          <p className="mt-3 text-gray-400">
            Prediction access available through faculty analytics.
          </p>
          
        </div>

        {/* ASSIGNMENTS */}

        <div
          onClick={() => navigate("/student-assignments")}
          className="dashboard-card"
        >

          <div className="card-icon">
            📘
          </div>

          <h2>Total Assignments</h2>

          <h1>{data.total_assignments}</h1>

          <p>
            Assignments available
          </p>

        </div>

        {/* ASSESSMENTS */}

        <div
          onClick={() => navigate("/student-assessment")}
          className="dashboard-card assessment-card"
        >

          <div className="card-icon">
            📝
          </div>

          <h2>Assessments</h2>

          <p className="small-text">
            Attempt your tests
          </p>

        </div>

        {/* SUBMITTED */}

        <div
          onClick={() =>
            navigate("/student-assignments?filter=submitted")
          }
          className="dashboard-card success-card"
        >

          <div className="card-icon">
            ✅
          </div>

          <h2>Submitted</h2>

          <h1>{data.submitted}</h1>

        </div>

        {/* PENDING */}

        <div
          onClick={() =>
            navigate("/student-assignments?filter=pending")
          }
          className="dashboard-card warning-card"
        >

          <div className="card-icon">
            ⏳
          </div>

          <h2>Pending</h2>

          <h1>{data.pending}</h1>

        </div>

        {/* AVG MARKS */}

        <div
          onClick={() => navigate("/student-assignments")}
          className="dashboard-card marks-card"
        >

          <div className="card-icon">
            🎯
          </div>

          <h2>Average Marks</h2>

          <h1>{data.avg_marks}</h1>

        </div>

      </div>

    </div>
  )
}

export default StudentDashboard