import { useEffect, useState } from "react"
import API from "../services/api"
import "./TeacherAttendanceHistory.css"

function TeacherAttendanceHistory() {
  const [records, setRecords] = useState([])
  const [filters, setFilters] = useState({
    date: "",
    subject: "",
    period: ""
  })

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await API.get("/attendance/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setRecords(res.data)

    } catch (err) {
      alert("Failed to load attendance records")
    }
  }

  const filtered = records.filter((r) =>
    (filters.date === "" || r.date === filters.date) &&
    (filters.subject === "" ||
      r.subject.toLowerCase().includes(filters.subject.toLowerCase())) &&
    (filters.period === "" || String(r.period_number) === filters.period)
  )

  return (
    <div className="attendance-history-page">

      {/* HEADER */}

      <div className="history-header">

        <div>

          <h1>Attendance Records 📅</h1>

          <p>
            Monitor attendance sessions and student presence history.
          </p>

        </div>

        <div className="history-badge">
          ATTENDANCE LOGS
        </div>

      </div>

      {/* FILTERS */}

      <div className="filters-card">

        <div className="filters-grid">

          <input
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters({
                ...filters,
                date: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Filter by Subject"
            value={filters.subject}
            onChange={(e) =>
              setFilters({
                ...filters,
                subject: e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Filter by Period"
            value={filters.period}
            onChange={(e) =>
              setFilters({
                ...filters,
                period: e.target.value
              })
            }
          />

        </div>

      </div>

      {/* TABLE */}

      <div className="history-table-card">

        <div className="table-top">

          <h2>Attendance Sessions</h2>

          <span>
            {filtered.length} Records
          </span>

        </div>

        <div className="table-wrapper">

          <table className="history-table">

            <thead>

              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Period</th>
                <th>Time</th>
                <th>Student ID</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {filtered.map((r) => (

                <tr key={r.id}>

                  <td>{r.date}</td>

                  <td>{r.subject}</td>

                  <td>{r.period_number}</td>

                  <td>
                    {r.start_time} - {r.end_time}
                  </td>

                  <td>{r.student_id}</td>

                  <td>

                    <span
                      className={
                        r.status === "present"
                          ? "present-badge"
                          : "absent-badge"
                      }
                    >
                      {r.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default TeacherAttendanceHistory