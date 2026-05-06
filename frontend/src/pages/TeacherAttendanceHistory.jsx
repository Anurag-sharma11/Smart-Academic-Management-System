import { useEffect, useState } from "react"
import API from "../services/api"

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
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Attendance Records</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <input
          type="date"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value })
          }
          className="p-3 rounded bg-gray-800"
        />

        <input
          type="text"
          placeholder="Filter by Subject"
          value={filters.subject}
          onChange={(e) =>
            setFilters({ ...filters, subject: e.target.value })
          }
          className="p-3 rounded bg-gray-800"
        />

        <input
          type="number"
          placeholder="Filter by Period"
          value={filters.period}
          onChange={(e) =>
            setFilters({ ...filters, period: e.target.value })
          }
          className="p-3 rounded bg-gray-800"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Period</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Student ID</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-gray-700">
                <td className="p-3">{r.date}</td>
                <td className="p-3">{r.subject}</td>
                <td className="p-3">{r.period_number}</td>
                <td className="p-3">
                  {r.start_time} - {r.end_time}
                </td>
                <td className="p-3">{r.student_id}</td>
                <td
                  className={`p-3 font-semibold ${
                    r.status === "present"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TeacherAttendanceHistory