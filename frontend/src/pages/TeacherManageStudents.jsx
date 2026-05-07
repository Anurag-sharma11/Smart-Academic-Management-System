import { useEffect, useState } from "react"
import API from "../services/api"
import "./TeacherManageStudents.css"

function TeacherManageStudents() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState("")
  const [editingStudent, setEditingStudent] = useState(null)

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await API.get("/student/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setStudents(res.data)
    } catch (err) {
      alert("Failed to fetch students")
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const deleteStudent = async (id) => {
    try {
      const token = localStorage.getItem("token")

      await API.delete(`/student/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchStudents()
    } catch (err) {
      alert("Failed to delete student")
    }
  }

  const updateStudent = async () => {
    try {
      const token = localStorage.getItem("token")

      await API.put(`/student/${editingStudent.id}`, editingStudent, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      alert("Student Updated Successfully ✅")
      setEditingStudent(null)
      fetchStudents()
    } catch (err) {
      alert("Failed to update student")
    }
  }

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase()) ||
    student.student_id?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="manage-students-page">

      {/* HEADER */}
      <div className="manage-header">

        <div>
          <h1>Manage Students 👨‍🎓</h1>

          <p>
            Search, edit and manage all registered students.
          </p>
        </div>

        <div className="student-count">
          {filteredStudents.length} Students
        </div>

      </div>

      {/* SEARCH BAR */}
      <div className="search-container">

        <input
          type="text"
          placeholder="Search by Name / Email / Student ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

      </div>

      {/* TABLE CARD */}
      <div className="table-card">

        <div className="table-wrapper">

          <table className="students-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Section</th>
                <th>Student ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.map((student) => (

                <tr key={student.id}>

                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.class_name}</td>
                  <td>{student.section}</td>
                  <td>{student.student_id}</td>

                  <td>

                    <div className="action-buttons">

                      <button
                        onClick={() =>
                          setEditingStudent({ ...student })
                        }
                        className="edit-btn"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteStudent(student.id)
                        }
                        className="delete-btn"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* EDIT MODAL */}

      {editingStudent && (

        <div className="modal-overlay">

          <div className="edit-modal">

            <h2>Edit Student ✏️</h2>

            <div className="modal-grid">

              {Object.keys(editingStudent)
                .filter((key) => key !== "id")
                .map((field) => (

                  <div
                    className="modal-input-group"
                    key={field}
                  >

                    <label>
                      {field.replaceAll("_", " ")}
                    </label>

                    <input
                      type="text"
                      value={editingStudent[field] || ""}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          [field]: e.target.value
                        })
                      }
                    />

                  </div>

                ))}

            </div>

            <div className="modal-actions">

              <button
                onClick={updateStudent}
                className="save-btn"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditingStudent(null)}
                className="cancel-btn"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default TeacherManageStudents