import { useState } from "react"
import API from "../services/api"
import "./TeacherAddStudent.css"

function TeacherAddStudent() {
  const today = new Date().toISOString().split("T")[0]

  const [sameEnrollment, setSameEnrollment] = useState(false)
  const [useToday, setUseToday] = useState(true)

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    gender: "Male",
    phone: "",
    student_id: "",
    enrollment_no: "",
    course: "",
    class_name: "",
    section: "",
    date_added: today
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await API.post("/auth/register", {
        ...form,
        password: "Student@123",
        role: "student",
        student_id: sameEnrollment ? form.enrollment_no : form.student_id
      })

      alert("Student Added Successfully ✅")

      setForm({
        name: "",
        email: "",
        age: "",
        gender: "Male",
        phone: "",
        student_id: "",
        enrollment_no: "",
        course: "",
        class_name: "",
        section: "",
        date_added: today
      })

      setSameEnrollment(false)

    } catch (err) {
      console.log(err.response?.data)
      console.log(err)

      alert(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to add student"
      )
    }
  }

  return (
    <div className="add-student-page">

      <div className="add-student-header">

        <div>
          <h1>Add New Student 👨‍🎓</h1>

          <p>
            Register students into the academic management system.
          </p>
        </div>

        <div className="student-badge">
          STUDENT
        </div>

      </div>

      <div className="student-form-card">

        <form
          onSubmit={handleSubmit}
          className="student-form-grid"
        >

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>

            <input
              type="number"
              name="age"
              placeholder="Enter age"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Course</label>

            <input
              type="text"
              name="course"
              placeholder="Enter course"
              value={form.course}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Semester</label>

            <input
              type="text"
              name="class_name"
              placeholder="Semester Number"
              value={form.class_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Section</label>

            <input
              type="text"
              name="section"
              placeholder="Enter section"
              value={form.section}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Enrollment Number</label>

            <input
              type="text"
              name="enrollment_no"
              placeholder="Enter enrollment number"
              value={form.enrollment_no}
              onChange={(e) => {
                const value = e.target.value

                setForm({
                  ...form,
                  enrollment_no: value,
                  student_id: sameEnrollment
                    ? value
                    : form.student_id
                })
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Student ID</label>

            <input
              type="text"
              name="student_id"
              placeholder="Enter student ID"
              value={
                sameEnrollment
                  ? form.enrollment_no
                  : form.student_id
              }
              onChange={handleChange}
              disabled={sameEnrollment}
              className={sameEnrollment ? "disabled-input" : ""}
              required
            />
          </div>

          <div className="checkbox-group full-width">

            <input
              type="checkbox"
              checked={sameEnrollment}
              onChange={() => {
                const newValue = !sameEnrollment

                setSameEnrollment(newValue)

                if (newValue) {
                  setForm({
                    ...form,
                    student_id: form.enrollment_no
                  })
                }
              }}
            />

            <label>
              Student ID same as Enrollment Number
            </label>

          </div>

          <div className="checkbox-group full-width">

            <input
              type="checkbox"
              checked={useToday}
              onChange={() => setUseToday(!useToday)}
            />

            <label>
              Use Today's Date
            </label>

          </div>

          {!useToday && (
            <div className="form-group full-width">

              <label>Date Added</label>

              <input
                type="date"
                name="date_added"
                value={form.date_added}
                onChange={handleChange}
              />

            </div>
          )}

          <button
            type="submit"
            className="submit-btn full-width"
          >
            Add Student
          </button>

        </form>

      </div>

    </div>
  )
}

export default TeacherAddStudent