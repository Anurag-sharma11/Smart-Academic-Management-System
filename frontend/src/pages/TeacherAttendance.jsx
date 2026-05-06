import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

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
    <div className="p-10 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Mark Attendance</h1>

      {/* ATTENDANCE SESSION DETAILS */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <input
          type="date"
          name="date"
          value={attendanceMeta.date}
          onChange={handleMetaChange}
          className="p-3 rounded bg-gray-800"
        />

        <select
          name="subject"
          value={attendanceMeta.subject}
          onChange={handleMetaChange}
          className="p-3 rounded bg-gray-800"
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
          placeholder="Period No"
          value={attendanceMeta.period_number}
          onChange={handleMetaChange}
          className="p-3 rounded bg-gray-800"
        />

        <input
          type="time"
          name="start_time"
          value={attendanceMeta.start_time}
          onChange={handleMetaChange}
          className="p-3 rounded bg-gray-800"
        />

        <input
          type="time"
          name="end_time"
          value={attendanceMeta.end_time}
          onChange={handleMetaChange}
          className="p-3 rounded bg-gray-800"
        />
      </div>

      {/* STUDENTS */}
      <div className="space-y-3">
        {students.map((s) => (
          <div
            key={s.id}
            className="flex justify-between items-center bg-gray-800 p-4 rounded"
          >
            <div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-gray-400">
                {s.student_id}
              </p>
            </div>

            <input
              type="checkbox"
              checked={s.present}
              onChange={() => toggleAttendance(s.id)}
              className="w-5 h-5"
            />
          </div>
        ))}
      </div>

      <button
        onClick={submitAttendance}
        className="mt-8 bg-green-600 px-6 py-3 rounded w-full"
      >
        Submit Attendance
      </button>
      <button
        onClick={() => navigate("/teacher-attendance-history")}
        className="mt-4 bg-blue-600 px-6 py-3 rounded w-full"
      >
        View Attendance Records
      </button>
    </div>
  )
}

export default TeacherAttendance