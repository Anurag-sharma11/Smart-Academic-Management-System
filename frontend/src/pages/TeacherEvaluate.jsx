import { useEffect, useState } from "react"
import API from "../services/api"
import "./TeacherEvaluate.css"

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
      <div className="evaluate-page">

        {/* HEADER */}

        <div className="evaluate-header">

          <div>

            <h1>Evaluate Submission 📝</h1>

            <p>
              Review student answers and assign marks.
            </p>

          </div>

          <div className="evaluate-badge">
            EVALUATION MODE
          </div>

        </div>

        {/* ANSWERS */}

        <div className="answers-container">

          {selected.answers.map((item, index) => (

            <div
              key={index}
              className="answer-card"
            >

              <div className="question-number">
                Q{index + 1}
              </div>

              <h3>
                {item.question}
              </h3>

              <div className="student-answer">

                <span>Student Answer</span>

                <p>
                  {item.answer || "Not Answered"}
                </p>

              </div>

            </div>

          ))}

        </div>

        {/* MARKING */}

        <div className="marking-card">

          <h2>Assign Marks</h2>

          <input
            type="number"
            placeholder="Enter Marks"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />

          <button
            onClick={submitMarks}
            className="submit-score-btn"
          >
            Submit Marks
          </button>

          <button
            onClick={() => setSelected(null)}
            className="back-btn"
          >
            ← Back to Submissions
          </button>

        </div>

      </div>
    )
  }

  // 📋 LIST VIEW
  return (
    <div className="evaluate-page">

      {/* HEADER */}

      <div className="evaluate-header">

        <div>

          <h1>Student Submissions 📄</h1>

          <p>
            Review assessment attempts and grading status.
          </p>

        </div>

        <div className="evaluate-badge">
          SUBMISSIONS
        </div>

      </div>

      {attempts.length === 0 ? (

        <div className="empty-state">
          No submissions yet
        </div>

      ) : (

        <div className="submissions-grid">

          {attempts.map((a) => (

            <div
              key={a.id}
              className="submission-card"
            >

              <div className="submission-top">

                <h2>{a.title}</h2>

                <div
                  className={
                    a.score !== null
                      ? "graded-badge"
                      : "pending-badge"
                  }
                >
                  {a.score !== null
                    ? "Graded"
                    : "Pending"}

                </div>

              </div>

              <div className="submission-details">

                <p>
                  <span>Student ID:</span>
                  {a.student_id}
                </p>

                <p>
                  <span>Subject:</span>
                  {a.subject}
                </p>

                <p>
                  <span>Score:</span>

                  {a.score ?? "Not graded"}
                </p>

              </div>

              <button
                onClick={() => handleEvaluate(a)}
                className="evaluate-btn"
              >
                Evaluate Submission
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default TeacherEvaluate