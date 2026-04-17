import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      })

      const { access_token, role } = response.data

      localStorage.setItem("token", access_token)
      localStorage.setItem("role", role)

      if (role === "admin") navigate("/admin-dashboard")
      if (role === "teacher") navigate("/teacher-dashboard")
      if (role === "student") navigate("/student-dashboard")

    } catch (error) {
      alert("Invalid Credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          ALASK Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Login
        </button>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login