import { useEffect, useState } from "react"
import API from "../services/api"

function AdminDashboard() {
  const [users, setUsers] = useState([])

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await API.get("/admin/users")

      setUsers(response.data)
    } catch (error) {
      console.log("Error fetching users:", error)
    }
  }

  // Update permission
  const updatePermission = async (id, field, value) => {
    try {
      const token = localStorage.getItem("token")

      await API.patch(
        `/admin/update-permission/${id}`,
        { [field]: value }
      )

      fetchUsers()
    } catch (error) {
      console.log("Error updating permission:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard 🚀</h1>

      <table className="w-full border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Teacher Access</th>
            <th className="p-3 border">Student Access</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="text-center border-t border-gray-700"
            >
              <td className="p-3 border">{user.id}</td>
              <td className="p-3 border">{user.name}</td>
              <td className="p-3 border">{user.email}</td>
              <td className="p-3 border">{user.role}</td>

              <td className="p-3 border">
                <input
                  type="checkbox"
                  checked={user.can_access_teacher || false}
                  onChange={(e) =>
                    updatePermission(
                      user.id,
                      "can_access_teacher",
                      e.target.checked
                    )
                  }
                />
              </td>

              <td className="p-3 border">
                <input
                  type="checkbox"
                  checked={user.can_access_student || false}
                  onChange={(e) =>
                    updatePermission(
                      user.id,
                      "can_access_student",
                      e.target.checked
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminDashboard