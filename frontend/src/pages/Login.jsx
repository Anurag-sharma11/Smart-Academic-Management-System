import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"
import "./Auth.css"

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
    <div className="auth-page">

      {/* LEFT */}

      <div className="auth-left">

        <div className="auth-overlay"></div>

        <div className="auth-content">

          <h1>ALASK</h1>

          <p>
            Smart Academic Analytics &
            Learning Knowledge System
          </p>

          <div className="auth-features">

            <div>📊 AI Attendance Analytics</div>
            <div>📝 Online Assessments</div>
            <div>📘 Assignment Management</div>
            <div>🤖 Smart Academic Insights</div>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="auth-right">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="auth-card">

          <h2>Welcome Back 👋</h2>

          <p className="auth-subtitle">
            Login to continue your journey.
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>
            Login
          </button>

          <p className="auth-switch">
            Don't have an account?
            {" "}

            <Link to="/register">
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Login