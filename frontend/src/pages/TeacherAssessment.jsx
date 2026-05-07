import { useState } from "react"
import API from "../services/api"
import "./TeacherAssessment.css"

function TeacherAssessment() {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [questions, setQuestions] = useState([])

  // ➕ Add Question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        type: "mcq",
        options: ["", "", "", ""],
        correct_answer: ""
      }
    ])
  }

  // ❌ Remove Question
  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index)
    setQuestions(updated)
  }

  // 🔄 Handle Question Change
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions]
    updated[index][field] = value

    // 🔥 Adjust based on type
    if (field === "type") {
      if (value === "mcq") {
        updated[index].options = ["", "", "", ""]
        updated[index].correct_answer = ""
      } else if (value === "tf") {
        updated[index].options = ["True", "False"]
        updated[index].correct_answer = ""
      } else if (value === "qa") {
        updated[index].options = []
        updated[index].correct_answer = ""
      }
    }

    setQuestions(updated)
  }

  // ✏️ Handle Options
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions]
    updated[qIndex].options[optIndex] = value
    setQuestions(updated)
  }

  // 🚀 Submit
  const submitAssessment = async () => {
    try {
      const res = await API.post("/assessment/create", {
        title,
        subject,
        teacher_id: 1
      })

      const assessment_id = res.data.assessment_id

      for (let q of questions) {
        await API.post("/assessment/add-question", {
          assessment_id,
          question_text: q.question_text,
          type: q.type,
          options: q.options,
          correct_answer: q.correct_answer
        })
      }

      alert("Assessment Created ✅")
      setQuestions([])
      setTitle("")
      setSubject("")

    } catch (err) {
      alert("Error creating assessment")
    }
  }

  return (
    <div className="assessment-page">

      {/* HEADER */}

      <div className="assessment-header">

        <div>

          <h1>Create Assessment 📝</h1>

          <p>
            Design smart assessments and manage question sets.
          </p>

        </div>

        <div className="assessment-badge">
          ASSESSMENT PANEL
        </div>

      </div>

      {/* MAIN CARD */}

      <div className="assessment-card">

        {/* TOP FORM */}

        <div className="assessment-top-grid">

          <div className="input-group">

            <label>Assessment Title</label>

            <input
              placeholder="Enter assessment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

          </div>

          <div className="input-group">

            <label>Subject</label>

            <input
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

          </div>

        </div>

        {/* ADD QUESTION */}

        <button
          onClick={addQuestion}
          className="add-question-btn"
        >
          + Add Question
        </button>

        {/* QUESTIONS */}

        <div className="questions-container">

          {questions.map((q, index) => (

            <div
              key={index}
              className="question-card"
            >

              {/* TOP */}

              <div className="question-top">

                <h3>
                  Question {index + 1}
                </h3>

                <button
                  onClick={() => removeQuestion(index)}
                  className="remove-btn"
                >
                  ✖
                </button>

              </div>

              {/* QUESTION */}

              <div className="input-group">

                <label>Question Text</label>

                <input
                  placeholder="Enter question"
                  value={q.question_text}
                  onChange={(e) =>
                    handleQuestionChange(
                      index,
                      "question_text",
                      e.target.value
                    )
                  }
                />

              </div>

              {/* TYPE */}

              <div className="input-group">

                <label>Question Type</label>

                <select
                  value={q.type}
                  onChange={(e) =>
                    handleQuestionChange(
                      index,
                      "type",
                      e.target.value
                    )
                  }
                >
                  <option value="mcq">MCQ</option>
                  <option value="tf">True / False</option>
                  <option value="qa">Q&A</option>
                </select>

              </div>

              {/* MCQ */}

              {q.type === "mcq" && (

                <div className="options-grid">

                  {q.options.map((opt, i) => (

                    <input
                      key={i}
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(
                          index,
                          i,
                          e.target.value
                        )
                      }
                    />

                  ))}

                </div>

              )}

              {/* TF */}

              {q.type === "tf" && (

                <div className="tf-box">
                  Options: True / False
                </div>

              )}

              {/* ANSWER */}

              {q.type !== "qa" && (

                <div className="input-group">

                  <label>Correct Answer</label>

                  <input
                    placeholder="Enter correct answer"
                    value={q.correct_answer}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        "correct_answer",
                        e.target.value
                      )
                    }
                  />

                </div>

              )}

            </div>

          ))}

        </div>

        {/* SUBMIT */}

        <button
          onClick={submitAssessment}
          className="submit-assessment-btn"
        >
          Submit Assessment
        </button>

      </div>

    </div>
  )
}

export default TeacherAssessment