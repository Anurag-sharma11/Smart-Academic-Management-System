import { useState } from "react"
import API from "../services/api"

function TeacherAttendance() {
  const [students, setStudents] = useState([
    { id: 1, name: "Student 1", present: false },
    { id: 2, name: "Student 2", present: false },
  ])

  const handleChange = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, present: !s.present } : s
      )
    )
  }

  const submitAttendance = async () => {
    const records = students.map((s) => ({
      student_id: s.id,
      status: s.present ? "present" : "absent",
    }))

    try {
      await API.post("/attendance/mark", { records })
      alert("Attendance Submitted ✅")
    } catch (err) {
      console.log(err.response?.data)
    }
  }

  return (
    <div className="p-10 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl mb-5">Teacher Attendance</h1>

      {students.map((s) => (
        <div key={s.id} className="mb-3">
          <label>
            <input
              type="checkbox"
              checked={s.present}
              onChange={() => handleChange(s.id)}
            />{" "}
            {s.name}
          </label>
        </div>
      ))}

      <button
        onClick={submitAttendance}
        className="bg-blue-500 px-4 py-2 mt-4"
      >
        Submit Attendance
      </button>
    </div>
  )
}

export default TeacherAttendance