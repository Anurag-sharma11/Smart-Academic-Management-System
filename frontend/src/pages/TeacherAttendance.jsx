import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./TeacherAttendance.css"

function TeacherAttendance() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])

  const [attendanceMeta, setAttendanceMeta] = useState({
    date: new Date().toISOString().split("T")[0],
    subject: "",
    period_number: "",
    start_time: "",
    end_time: ""
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await API.get("/student/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const formatted = res.data.map((s) => ({
        ...s,
        present: false
      }))

      setStudents(formatted)

    } catch (err) {
      alert("Failed to load students")
    }
  }

  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, present: !s.present } : s
      )
    )
  }

  const handleMetaChange = (e) => {
    setAttendanceMeta({
      ...attendanceMeta,
      [e.target.name]: e.target.value
    })
  }

  const submitAttendance = async () => {
    try {
      const token = localStorage.getItem("token")

      const records = students.map((s) => ({
        student_id: s.id,
        status: s.present ? "present" : "absent"
      }))

      await API.post(
        "/attendance/mark",
        {
          ...attendanceMeta,
          records
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert("Attendance Submitted Successfully ✅")

      setStudents((prev) =>
        prev.map((s) => ({
          ...s,
          present: false
        }))
      )

    } catch (err) {
      console.log(err.response?.data)
      alert("Failed to submit attendance")
    }
  }

  return (
    <div className="attendance-page">

      {/* HEADER */}
      <div className="attendance-header">

        <div>
          <h1>Attendance Management 📅</h1>

          <p>
            Manage and track classroom attendance efficiently.
          </p>
        </div>

        <div className="attendance-badge">
          LIVE SESSION
        </div>

      </div>

      {/* SESSION CARD */}
      <div className="session-card">

        <h2>Attendance Session Details</h2>

        <div className="session-grid">

          <input
            type="date"
            name="date"
            value={attendanceMeta.date}
            onChange={handleMetaChange}
          />

          <select
            name="subject"
            value={attendanceMeta.subject}
            onChange={handleMetaChange}
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

          <input
            type="number"
            name="period_number"
            placeholder="Period Number"
            value={attendanceMeta.period_number}
            onChange={handleMetaChange}
          />

          <input
            type="time"
            name="start_time"
            value={attendanceMeta.start_time}
            onChange={handleMetaChange}
          />

          <input
            type="time"
            name="end_time"
            value={attendanceMeta.end_time}
            onChange={handleMetaChange}
          />

        </div>

      </div>

      {/* STUDENT LIST */}
      <div className="students-card">

        <div className="students-top">

          <h2>Student Attendance List</h2>

          <span>
            {students.length} Students
          </span>

        </div>

        <div className="students-list">

          {students.map((s) => (

            <div
              key={s.id}
              className={`student-row ${s.present ? "present-row" : ""
                }`}
            >

              <div className="student-info">

                <div className="student-avatar">
                  {s.name?.charAt(0)}
                </div>

                <div>

                  <p className="student-name">
                    {s.name}
                  </p>

                  <p className="student-id">
                    {s.student_id}
                  </p>

                </div>

              </div>

              <label className="switch">

                <input
                  type="checkbox"
                  checked={s.present}
                  onChange={() => toggleAttendance(s.id)}
                />

                <span className="slider"></span>

              </label>

            </div>

          ))}

        </div>

      </div>

      {/* ACTION BUTTONS */}

      <div className="attendance-actions">

        <button
          onClick={submitAttendance}
          className="submit-attendance-btn"
        >
          Submit Attendance
        </button>

        <button
          onClick={() =>
            navigate("/teacher-attendance-history")
          }
          className="history-btn"
        >
          View Attendance Records
        </button>

      </div>

    </div>
  )
}

export default TeacherAttendance