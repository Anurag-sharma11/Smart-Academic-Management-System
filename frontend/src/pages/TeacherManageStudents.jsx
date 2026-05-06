import { useEffect, useState } from "react"
import API from "../services/api"

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
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Manage Students</h1>

      <input
        type="text"
        placeholder="Search by Name / Email / Student ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 rounded bg-gray-800"
      />

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Semester</th>
              <th className="p-3 text-left">Section</th>
              <th className="p-3 text-left">Student ID</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-t border-gray-700">
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.email}</td>
                <td className="p-3">{student.course}</td>
                <td className="p-3">{student.class_name}</td>
                <td className="p-3">{student.section}</td>
                <td className="p-3">{student.student_id}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => setEditingStudent({ ...student })}
                    className="bg-yellow-500 px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteStudent(student.id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl w-[700px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Edit Student</h2>

            <div className="grid grid-cols-2 gap-4">
              {Object.keys(editingStudent)
                .filter((key) => key !== "id")
                .map((field) => (
                  <input
                    key={field}
                    type="text"
                    value={editingStudent[field] || ""}
                    placeholder={field.replaceAll("_", " ").toUpperCase()}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        [field]: e.target.value
                      })
                    }
                    className="p-3 rounded bg-gray-700"
                  />
                ))}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={updateStudent}
                className="bg-green-600 px-4 py-2 rounded w-full"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditingStudent(null)}
                className="bg-red-600 px-4 py-2 rounded w-full"
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