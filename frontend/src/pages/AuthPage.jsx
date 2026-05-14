import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import "./Auth.css"

function AuthPage() {

  const navigate = useNavigate()

  const [isFlipped, setIsFlipped] = useState(false)

  // LOGIN STATES

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // LOGIN

  const handleLogin = async () => {

    try {

      const response = await API.post(
        "/auth/login",
        {
          email,
          password
        }
      )
      console.log(response.data)
      
      const {
        access_token,
        role,
        name,
        email: userEmail
      } = response.data

      localStorage.setItem(
        "token",
        access_token
      )

      localStorage.setItem(
        "role",
        role
      )

      localStorage.setItem(
        "name",
        name
      )

      localStorage.setItem(
        "email",
        userEmail
      )

      if (role === "admin")
        navigate("/admin-dashboard")

      if (role === "teacher")
        navigate("/teacher-dashboard")

      if (role === "student")
        navigate("/student-dashboard")

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

            <div>
              📊 AI Attendance Analytics
            </div>

            <div>
              📝 Online Assessments
            </div>

            <div>
              📘 Assignment Management
            </div>

            <div>
              🤖 Smart Academic Insights
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="auth-right">

        {/* RINGS */}

        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>

        {/* FLIP CONTAINER */}

        <div
          className={
            isFlipped
              ? "flip-card flipped"
              : "flip-card"
          }
        >

          <div className="flip-card-inner">

            {/* LOGIN */}

            <div className="flip-face auth-card">

              <h2>Welcome Back 👋</h2>

              <p className="auth-subtitle">
                Login to continue your journey.
              </p>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button onClick={handleLogin}>
                Login
              </button>

              <p className="auth-switch">
                Contact your teacher/admin for account access.
              </p>

            </div>

            {/* REGISTER */}

            <div className="flip-face flip-back auth-card">

              <h2>Create Account 🚀</h2>

              <p className="auth-subtitle">
                Start your academic journey.
              </p>

              <input
                type="text"
                placeholder="Full Name"
              />

              <input
                type="email"
                placeholder="Email"
              />

              <input
                type="password"
                placeholder="Password"
              />

              <button>
                Register
              </button>

              <p className="auth-switch">

                Already have an account?

                {" "}

                <span
                  onClick={() =>
                    setIsFlipped(false)
                  }
                >
                  Login
                </span>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default AuthPage