import { useEffect, useState } from "react"
import API from "../services/api"
import "./StudentAttendance.css"

function StudentAttendance() {
  const [data, setData] = useState(null)
  const [openDate, setOpenDate] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/attendance/my")
        setData(res.data)
      } catch (err) {
        console.log(err.response?.data)
      }
    }

    fetchData()
  }, [])

  if (!data) {
    return (
      <div className="attendance-loading">
        Loading Attendance...
      </div>
    )
  }

  // 🔥 GROUP DATA BY DATE
  const grouped = {}

  data.records.forEach((r) => {
    if (!grouped[r.date]) {
      grouped[r.date] = []
    }
    grouped[r.date].push(r)
  })

  return (
    <div className="student-attendance-page">

      {/* HEADER */}

      <div className="attendance-header">

        <div>

          <h1>My Attendance 📅</h1>

          <p>
            Track daily attendance records and subject sessions.
          </p>

        </div>

        <div className="attendance-badge">
          ATTENDANCE TRACKER
        </div>

      </div>

      {/* OVERVIEW CARD */}

      <div className="attendance-overview-card">

        <div className="overview-icon">
          📊
        </div>

        <div>

          <h2>Overall Attendance</h2>

          <h1>
            {data.percentage.toFixed(2)}%
          </h1>

        </div>

      </div>

      {/* RECORDS */}

      <div className="attendance-records">

        {Object.keys(grouped).map((date) => {

          const dayData = grouped[date]

          const presentCount = dayData.filter(
            (d) => d.status === "present"
          ).length

          return (

            <div
              key={date}
              className="attendance-day-card"
            >

              {/* TOP */}

              <div
                className="attendance-day-header"
                onClick={() =>
                  setOpenDate(
                    openDate === date ? null : date
                  )
                }
              >

                <div>

                  <h2>
                    📅
                    {" "}
                    {new Date(date).toDateString()}
                  </h2>

                  <p>
                    {presentCount}
                    {" / "}
                    {dayData.length}
                    {" "}
                    Present
                  </p>

                </div>

                <div className="dropdown-icon">

                  {openDate === date ? "▲" : "▼"}

                </div>

              </div>

              {/* EXPAND */}

              {openDate === date && (

                <div className="attendance-sessions">

                  {dayData.map((r, i) => (

                    <div
                      key={i}
                      className="session-card"
                    >

                      <div>

                        <h3>
                          {r.subject}
                        </h3>

                        <p>
                          Period {r.period_number}
                          {" "}
                          ({r.start_time} - {r.end_time})
                        </p>

                      </div>

                      <div
                        className={
                          r.status === "present"
                            ? "present-status"
                            : "absent-status"
                        }
                      >

                        {r.status}

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          )
        })}

      </div>

    </div>
  )
}

export default StudentAttendance