import { useState } from "react"
import API from "../services/api"

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
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">
        Student Insights Report 📊
      </h1>

      {/* FILTERS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <input
          name="course"
          value={filters.course}
          onChange={handleChange}
          placeholder="Course"
          className="p-3 rounded bg-gray-800"
        />

        <input
          name="semester"
          value={filters.semester}
          onChange={handleChange}
          placeholder="Semester"
          className="p-3 rounded bg-gray-800"
        />

        <input
          name="section"
          value={filters.section}
          onChange={handleChange}
          placeholder="Section"
          className="p-3 rounded bg-gray-800"
        />

        <button
          onClick={fetchAnalytics}
          className="bg-blue-600 rounded px-4"
        >
          Analyze
        </button>
      </div>

      {data && (
        <>
          {/* SUMMARY CARDS */}
          <div className="grid md:grid-cols-4 gap-4 mb-10">

            <div className="bg-gray-800 p-5 rounded-xl">
              <h3>Overall Attendance</h3>
              <p className="text-2xl font-bold">
                {data.overall_attendance}%
              </p>
            </div>

            <div className="bg-gray-800 p-5 rounded-xl">
              <h3>High Risk Students</h3>
              <p className="text-2xl font-bold text-red-400">
                {data.high_risk_count}
              </p>
            </div>

            <div className="bg-gray-800 p-5 rounded-xl">
              <h3>Best Subject</h3>
              <p className="font-bold">
                {data.best_subject.name}
              </p>
              <p>{data.best_subject.attendance}%</p>
            </div>

            <div className="bg-gray-800 p-5 rounded-xl">
              <h3>Weakest Subject</h3>
              <p className="font-bold">
                {data.worst_subject.name}
              </p>
              <p>{data.worst_subject.attendance}%</p>
            </div>

          </div>

          {/* TOPPERS */}
          <div className="mb-10">
            <h2 className="text-2xl mb-4 font-bold">
              Subject-wise Toppers 🏆
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(data.toppers).map(([subject, topper]) => (
                <div
                  key={subject}
                  className="bg-gray-800 p-4 rounded-xl"
                >
                  <h3 className="font-bold">{subject}</h3>
                  <p>{topper.student_name}</p>
                  <p>ID: {topper.student_id}</p>
                  <p>{topper.attendance}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* DEFAULTERS */}
          <div>
            <h2 className="text-2xl mb-4 font-bold text-red-400">
              Attendance Defaulters (&lt;40%)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800 rounded-xl">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Student ID</th>
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Attendance</th>
                  </tr>
                </thead>

                <tbody>
                  {data.defaulters.map((d, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-700"
                    >
                      <td className="p-3">{d.student_name}</td>
                      <td className="p-3">{d.student_id}</td>
                      <td className="p-3">{d.subject}</td>
                      <td className="p-3 text-red-400">
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