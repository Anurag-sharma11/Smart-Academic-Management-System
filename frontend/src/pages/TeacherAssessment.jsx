import { useState } from "react"
import API from "../services/api"

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
    <div className="min-h-screen bg-gray-900 text-white p-8">

      <h1 className="text-3xl font-bold mb-6">
        Create Assessment 📝
      </h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">

        {/* TITLE + SUBJECT */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            placeholder="Title"
            className="p-2 rounded bg-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Subject"
            className="p-2 rounded bg-gray-700"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={addQuestion}
          className="bg-indigo-600 px-4 py-2 rounded mb-6"
        >
          + Add Question
        </button>

        {/* QUESTIONS */}
        {questions.map((q, index) => (
          <div key={index} className="bg-gray-700 p-4 mb-4 rounded-lg relative">

            {/* REMOVE BUTTON */}
            <button
              onClick={() => removeQuestion(index)}
              className="absolute top-2 right-2 text-red-400"
            >
              ✖
            </button>

            <h3 className="mb-2 font-semibold">
              Question {index + 1}
            </h3>

            {/* QUESTION TEXT */}
            <input
              placeholder="Enter question"
              className="w-full p-2 mb-2 rounded bg-gray-600"
              value={q.question_text}
              onChange={(e) =>
                handleQuestionChange(index, "question_text", e.target.value)
              }
            />

            {/* TYPE */}
            <select
              className="w-full p-2 mb-2 rounded bg-gray-600"
              value={q.type}
              onChange={(e) =>
                handleQuestionChange(index, "type", e.target.value)
              }
            >
              <option value="mcq">MCQ</option>
              <option value="tf">True / False</option>
              <option value="qa">Q&A</option>
            </select>

            {/* MCQ OPTIONS */}
            {q.type === "mcq" && q.options.map((opt, i) => (
              <input
                key={i}
                placeholder={`Option ${i + 1}`}
                className="w-full p-2 mb-2 rounded bg-gray-600"
                value={opt}
                onChange={(e) =>
                  handleOptionChange(index, i, e.target.value)
                }
              />
            ))}

            {/* TRUE/FALSE */}
            {q.type === "tf" && (
              <div className="text-gray-300 mb-2">
                Options: True / False
              </div>
            )}

            {/* CORRECT ANSWER (ONLY FOR MCQ & TF) */}
            {q.type !== "qa" && (
              <input
                placeholder="Correct Answer"
                className="w-full p-2 rounded bg-gray-600"
                value={q.correct_answer}
                onChange={(e) =>
                  handleQuestionChange(index, "correct_answer", e.target.value)
                }
              />
            )}

          </div>
        ))}

        {/* SUBMIT */}
        <button
          onClick={submitAssessment}
          className="bg-green-600 px-6 py-2 rounded w-full mt-4"
        >
          Submit Assessment
        </button>

      </div>
    </div>
  )
}

export default TeacherAssessment