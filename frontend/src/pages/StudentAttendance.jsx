import { useEffect, useState } from "react"
import API from "../services/api"

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

  if (!data) return <div className="p-10 text-white">Loading...</div>

  // 🔥 GROUP DATA BY DATE
  const grouped = {}

  data.records.forEach((r) => {
    if (!grouped[r.date]) {
      grouped[r.date] = []
    }
    grouped[r.date].push(r)
  })

  return (
    <div className="p-10 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl mb-5">My Attendance</h1>

      <h2 className="mb-5">
        Percentage: {data.percentage.toFixed(2)}%
      </h2>

      {/* 🔥 DAY CARDS */}
      {Object.keys(grouped).map((date) => {
        const dayData = grouped[date]
        const presentCount = dayData.filter(
          (d) => d.status === "present"
        ).length

        return (
          <div
            key={date}
            className="mb-4 bg-gray-800 p-4 rounded-lg shadow"
          >

            {/* 🔹 HEADER */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setOpenDate(openDate === date ? null : date)
              }
            >
              <div>
                <h2 className="text-lg font-bold">
                  📅 {new Date(date).toDateString()}
                </h2>
                <p className="text-sm text-gray-400">
                  {presentCount} / {dayData.length} Present
                </p>
              </div>

              <span className="text-xl">
                {openDate === date ? "▲" : "▼"}
              </span>
            </div>

            {/* 🔥 EXPAND */}
            {openDate === date && (
              <div className="mt-3 space-y-2">
                {dayData.map((r, i) => (
                  <div
                    key={i}
                    className="flex justify-between bg-gray-700 p-2 rounded"
                  >
                    <div>
                      <strong>{r.subject}</strong>
                      <div className="text-xs text-gray-400">
                        Period {r.period_number} ({r.start_time} - {r.end_time})
                      </div>
                    </div>

                    <div
                      className={
                        r.status === "present"
                          ? "text-green-400"
                          : "text-red-400"
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
  )
}

export default StudentAttendance