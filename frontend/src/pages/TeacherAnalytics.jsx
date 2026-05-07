import { useState } from "react"
import API from "../services/api"
import "./TeacherAnalytics.css"

function TeacherAnalytics() {
  const [filters, setFilters] = useState({
    course: "BCA",
    semester: "6",
    section: "M1"
  })

  const [data, setData] = useState(null)

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await API.post(
        "/attendance/analytics",
        filters,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setData(res.data)

    } catch (err) {
      alert(err.response?.data?.message || "Failed to load analytics")
    }
  }

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="analytics-header">

        <div>

          <h1>Student Insights Report 📊</h1>

          <p>
            Analyze attendance trends, risks and performance insights.
          </p>

        </div>

        <div className="analytics-badge">
          AI ANALYTICS
        </div>

      </div>

      {/* FILTERS */}

      <div className="filters-card">

        <div className="filters-grid">

          <input
            name="course"
            value={filters.course}
            onChange={handleChange}
            placeholder="Course"
          />

          <input
            name="semester"
            value={filters.semester}
            onChange={handleChange}
            placeholder="Semester"
          />

          <input
            name="section"
            value={filters.section}
            onChange={handleChange}
            placeholder="Section"
          />

          <button
            onClick={fetchAnalytics}
            className="analyze-btn"
          >
            Analyze Data
          </button>

        </div>

      </div>

      {data && (
        <>

          {/* STATS */}

          <div className="stats-grid">

            <div className="stats-card">

              <h3>Overall Attendance</h3>

              <h2>
                {data.overall_attendance}%
              </h2>

              <span>
                Academic attendance overview
              </span>

            </div>

            <div className="stats-card risk-card">

              <h3>High Risk Students</h3>

              <h2>
                {data.high_risk_count}
              </h2>

              <span>
                Require immediate attention
              </span>

            </div>

            <div className="stats-card">

              <h3>Best Subject</h3>

              <h2>
                {data.best_subject.name}
              </h2>

              <span>
                {data.best_subject.attendance}%
                attendance
              </span>

            </div>

            <div className="stats-card weak-card">

              <h3>Weakest Subject</h3>

              <h2>
                {data.worst_subject.name}
              </h2>

              <span>
                {data.worst_subject.attendance}%
                attendance
              </span>

            </div>

          </div>

          {/* TOPPERS */}

          <div className="section-card">

            <div className="section-top">

              <h2>
                Subject-wise Toppers 🏆
              </h2>

              <span>
                Best performers by attendance
              </span>

            </div>

            <div className="toppers-grid">

              {Object.entries(data.toppers).map(
                ([subject, topper]) => (

                  <div
                    key={subject}
                    className="topper-card"
                  >

                    <div className="topper-subject">
                      {subject}
                    </div>

                    <h3>
                      {topper.student_name}
                    </h3>

                    <p>
                      ID: {topper.student_id}
                    </p>

                    <div className="attendance-bar">

                      <div
                        className="attendance-fill"
                        style={{
                          width: `${topper.attendance}%`
                        }}
                      ></div>

                    </div>

                    <span>
                      {topper.attendance}%
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

          {/* DEFAULTERS */}

          <div className="section-card">

            <div className="section-top">

              <h2 className="danger-text">
                Attendance Defaulters ⚠️
              </h2>

              <span>
                Students below 40% attendance
              </span>

            </div>

            <div className="table-wrapper">

              <table className="analytics-table">

                <thead>

                  <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Subject</th>
                    <th>Attendance</th>
                  </tr>

                </thead>

                <tbody>

                  {data.defaulters.map((d, i) => (

                    <tr key={i}>

                      <td>{d.student_name}</td>

                      <td>{d.student_id}</td>

                      <td>{d.subject}</td>

                      <td className="danger-text">
                        {d.attendance}%
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </>
      )}

    </div>
  )
}

export default TeacherAnalytics