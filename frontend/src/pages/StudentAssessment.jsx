import { useEffect, useState } from "react"
import API from "../services/api"

function StudentAssessment() {
  const [assessments, setAssessments] = useState([])
  const [selectedTest, setSelectedTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(3600)

  // 📦 Fetch tests
  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/assessment/all")
      setAssessments(res.data)
    }
    fetchData()
  }, [])

  // ⏱️ Timer
  useEffect(() => {
    if (!selectedTest) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedTest])

  // ▶️ Start Test
  const startTest = async (id) => {
    try {
      await API.post(`/assessment/start/${id}`, {
        student_id: 2
      })

      const res = await API.get(`/assessment/questions/${id}`)
      setQuestions(res.data)
      setSelectedTest(id)
      setTimeLeft(3600)
      setAnswers({})
    } catch (err) {
      alert(err.response?.data?.error || "Error starting test")
    }
  }

  // 📝 Answer handler
  const handleAnswer = (qid, value) => {
    setAnswers({ ...answers, [qid]: value })
  }

  // ✅ Submit
  const handleSubmit = async () => {
    try {
      await API.post("/assessment/submit", {
        student_id: 2,
        assessment_id: selectedTest,
        answers: answers,
        score: 0
      })

      alert("Test Submitted ✅")
      setSelectedTest(null)
    } catch (err) {
      alert("Submit error")
    }
  }

  // ⏱️ Format time
  const formatTime = () => {
    const min = Math.floor(timeLeft / 60)
    const sec = timeLeft % 60
    return `${min}:${sec < 10 ? "0" : ""}${sec}`
  }

  // 🧾 TEST LIST UI
  if (!selectedTest) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-10">

        <h1 className="text-3xl font-bold mb-8">
          Available Tests 📝
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {assessments.map((a) => (
            <div
              key={a.id}
              className="bg-gray-800 p-5 rounded-xl shadow hover:bg-gray-700 transition"
            >
              <h2 className="text-xl font-semibold">{a.title}</h2>

              <p className="text-gray-400 mb-4">
                {a.subject}
              </p>

              <button
                onClick={() => startTest(a.id)}
                className="bg-blue-600 px-4 py-2 rounded w-full hover:bg-blue-700"
              >
                Start Test 🚀
              </button>
            </div>
          ))}

        </div>
      </div>
    )
  }

  // 🧠 TEST UI
  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Test Started</h2>
        <div className="text-lg bg-red-600 px-4 py-2 rounded">
          ⏱ {formatTime()}
        </div>
      </div>

      <div className="space-y-6">

        {questions.map((q, index) => (
          <div key={q.id} className="bg-gray-800 p-5 rounded-lg">

            <p className="mb-4 font-semibold">
              Q{index + 1}. {q.question_text}
            </p>

            {/* MCQ */}
            {q.type === "mcq" && q.options.map((opt, i) => (
              <label key={i} className="block mb-2 cursor-pointer">
                <input
                  type="radio"
                  name={q.id}
                  className="mr-2"
                  onChange={() => handleAnswer(q.id, opt)}
                />
                {opt}
              </label>
            ))}

            {/* TRUE/FALSE */}
            {q.type === "tf" && ["True", "False"].map((opt, i) => (
              <label key={i} className="block mb-2 cursor-pointer">
                <input
                  type="radio"
                  name={q.id}
                  className="mr-2"
                  onChange={() => handleAnswer(q.id, opt)}
                />
                {opt}
              </label>
            ))}

            {/* Q&A */}
            {q.type === "qa" && (
              <textarea
                placeholder="Write your answer..."
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) => handleAnswer(q.id, e.target.value)}
              />
            )}

          </div>
        ))}

      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 px-6 py-3 rounded w-full mt-8 text-lg hover:bg-green-700"
      >
        Submit Test ✅
      </button>

    </div>
  )
}

export default StudentAssessment