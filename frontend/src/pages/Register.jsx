import { Link } from "react-router-dom"
import "./Auth.css"

function Register() {
  return (
    <div className="auth-page">

      {/* LEFT */}

      <div className="auth-left">

        <div className="auth-overlay"></div>

        <div className="auth-content">

          <h1>Join ALASK 🚀</h1>

          <p>
            Experience intelligent academic management.
          </p>

          <div className="auth-features">

            <div>📊 Attendance Tracking</div>
            <div>📝 Smart Examination System</div>
            <div>📘 Assignment Submission</div>
            <div>🎯 Student Performance Insights</div>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="auth-right">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="auth-card">

          <h2>Create Account</h2>

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

            <Link to="/">
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Register