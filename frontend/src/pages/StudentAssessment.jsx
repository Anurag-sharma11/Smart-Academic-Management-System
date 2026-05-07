import { useEffect, useState } from "react"
import API from "../services/api"
import "./StudentAssessment.css"

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
      <div className="student-assessment-page">

        {/* HEADER */}

        <div className="assessment-header">

          <div>

            <h1>Available Tests 📝</h1>

            <p>
              Start assessments and evaluate your academic performance.
            </p>

          </div>

          <div className="assessment-badge">
            ONLINE EXAMINATION
          </div>

        </div>

        {/* TEST GRID */}

        <div className="assessment-grid">

          {assessments.map((a) => (

            <div
              key={a.id}
              className="assessment-card"
            >

              <div className="assessment-icon">
                📝
              </div>

              <h2>{a.title}</h2>

              <p>{a.subject}</p>

              <button
                onClick={() => startTest(a.id)}
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
    <div className="student-assessment-page">

      {/* TOP BAR */}

      <div className="test-topbar">

        <div>

          <h1>Assessment Started 🧠</h1>

          <p>
            Complete all questions before timer ends.
          </p>

        </div>

        <div className="timer-box">
          ⏱ {formatTime()}
        </div>

      </div>

      {/* QUESTIONS */}

      <div className="questions-wrapper">

        {questions.map((q, index) => (

          <div
            key={q.id}
            className="question-card"
          >

            <div className="question-badge">
              Question {index + 1}
            </div>

            <h2>
              {q.question_text}
            </h2>

            {/* MCQ */}

            {q.type === "mcq" && (

              <div className="options-list">

                {q.options.map((opt, i) => (

                  <label
                    key={i}
                    className="option-item"
                  >

                    <input
                      type="radio"
                      name={q.id}
                      onChange={() =>
                        handleAnswer(q.id, opt)
                      }
                    />

                    {opt}

                  </label>

                ))}

              </div>

            )}

            {/* TRUE FALSE */}

            {q.type === "tf" && (

              <div className="options-list">

                {["True", "False"].map((opt, i) => (

                  <label
                    key={i}
                    className="option-item"
                  >

                    <input
                      type="radio"
                      name={q.id}
                      onChange={() =>
                        handleAnswer(q.id, opt)
                      }
                    />

                    {opt}

                  </label>

                ))}

              </div>

            )}

            {/* QA */}

            {q.type === "qa" && (

              <textarea
                placeholder="Write your answer..."
                onChange={(e) =>
                  handleAnswer(
                    q.id,
                    e.target.value
                  )
                }
              />

            )}

          </div>

        ))}

      </div>

      {/* SUBMIT */}

      <button
        onClick={handleSubmit}
        className="submit-test-btn"
      >
        Submit Test ✅
      </button>

    </div>
  )
}

export default StudentAssessment