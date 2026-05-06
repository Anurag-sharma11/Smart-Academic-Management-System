import { useState } from "react"
import API from "../services/api"

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
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Add New Student</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="p-3 rounded bg-gray-800"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-3 rounded bg-gray-800"
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="p-3 rounded bg-gray-800"
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="p-3 rounded bg-gray-800"
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="p-3 rounded bg-gray-800"
          required
        />

        <input
          type="text"
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
          className="p-3 rounded bg-gray-800"
          required
        />

        <input
          type="text"
          name="class_name"
          placeholder="Semester Number"
          value={form.class_name}
          onChange={handleChange}
          className="p-3 rounded bg-gray-800"
          required
        />

        <input
          type="text"
          name="section"
          placeholder="Section"
          value={form.section}
          onChange={handleChange}
          className="p-3 rounded bg-gray-800"
          required
        />

        <input
          type="text"
          name="enrollment_no"
          placeholder="Enrollment Number"
          value={form.enrollment_no}
          onChange={(e) => {
            const value = e.target.value

            setForm({
              ...form,
              enrollment_no: value,
              student_id: sameEnrollment ? value : form.student_id
            })
          }}
          className="p-3 rounded bg-gray-800"
          required
        />

        <input
          type="text"
          name="student_id"
          placeholder="Student ID"
          value={sameEnrollment ? form.enrollment_no : form.student_id}
          onChange={handleChange}
          disabled={sameEnrollment}
          className={`p-3 rounded ${
            sameEnrollment
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gray-800"
          }`}
          required
        />

        <div className="col-span-2 flex items-center gap-3">
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
          <label>Student ID Same as Enrollment Number</label>
        </div>

        <div className="col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            checked={useToday}
            onChange={() => setUseToday(!useToday)}
          />
          <label>Use Today's Date</label>
        </div>

        {!useToday && (
          <input
            type="date"
            name="date_added"
            value={form.date_added}
            onChange={handleChange}
            className="p-3 rounded bg-gray-800 col-span-2"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 py-3 rounded col-span-2"
        >
          Add Student
        </button>
      </form>
    </div>
  )
}

export default TeacherAddStudent