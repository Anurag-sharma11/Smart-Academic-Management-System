import { useEffect, useState } from "react"
import API from "../services/api"

function TeacherEvaluate() {
  const [attempts, setAttempts] = useState([])
  const [selected, setSelected] = useState(null)
  const [questions, setQuestions] = useState([])
  const [marks, setMarks] = useState("")

  // 📦 Fetch all submissions
  useEffect(() => {
    fetchAttempts()
  }, [])

  const fetchAttempts = async () => {
    try {
      const res = await API.get("/assessment/attempts")
      setAttempts(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // 🔍 VIEW + LOAD QUESTIONS
  const handleEvaluate = async (attempt) => {
    try {
      setSelected(attempt)

      const res = await API.get(
        `/assessment/questions/${attempt.assessment_id}`
      )
      setQuestions(res.data)

    } catch (err) {
      console.log(err)
    }
  }

  // ✅ Submit marks
  const submitMarks = async () => {
    try {
      await API.patch(`/assessment/mark/${selected.id}`, {
        score: marks
      })

      alert("Marks updated ✅")
      setSelected(null)
      setMarks("")
      fetchAttempts()

    } catch (err) {
      alert("Error updating marks")
    }
  }

  // 🔍 SINGLE VIEW
  if (selected) {
    console.log("FULL SELECTED:", selected)
    console.log("ANSWERS:", selected.answers)
    return (
      <div className="min-h-screen bg-gray-900 text-white p-10">

        <h2 className="text-2xl mb-6">Evaluate Submission 📝</h2>

        {selected.answers.map((item, index) => (
            <div key={index} className="bg-gray-800 p-4 mb-4 rounded">

                <p className="mb-2 font-semibold">
                    Q{index + 1}. {item.question}
                </p>

                <p className="text-green-400">
                    Answer: {item.answer || "Not Answered"}
                </p>

            </div>
        ))}

        {/* MARKS INPUT */}
        <input
          type="number"
          placeholder="Enter Marks"
          value={marks}
          className="p-2 bg-gray-700 rounded w-full mt-4"
          onChange={(e) => setMarks(e.target.value)}
        />

        <button
          onClick={submitMarks}
          className="bg-green-600 px-4 py-2 rounded w-full mt-3"
        >
          Submit Marks
        </button>

        <button
          onClick={() => setSelected(null)}
          className="mt-4 text-gray-400"
        >
          ← Back
        </button>
      </div>
    )
  }

  // 📋 LIST VIEW
  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">

      <h1 className="text-3xl mb-8">
        Student Submissions 📄
      </h1>

      {attempts.length === 0 ? (
        <p>No submissions yet</p>
      ) : (
        <div className="space-y-4">

          {attempts.map((a) => (
            <div key={a.id} className="bg-gray-800 p-4 rounded">

            <p><b>Student ID:</b> {a.student_id}</p>
            <p><b>Assessment:</b> {a.title}</p>
            <p><b>Subject:</b> {a.subject}</p>
            <p><b>Score:</b> {a.score ?? "Not graded"}</p>

              <button
                onClick={() => handleEvaluate(a)}
                className="bg-blue-600 px-4 py-2 rounded mt-3"
              >
                Evaluate
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default TeacherEvaluate