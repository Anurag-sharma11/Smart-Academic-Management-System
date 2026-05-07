import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./TeacherDashboard.css";

function TeacherDashboard() {
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [prediction, setPrediction] = useState(null);

  const navigate = useNavigate();

  const getPrediction = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/attendance/predict",
        {
          student_id: studentId,
          subject: subject,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPrediction(res.data);
    } catch (err) {
      console.log(err);
      alert("Error fetching prediction");
    }
  };

  return (
    <div className="teacher-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Teacher Dashboard 🚀</h1>
          <p>
            Manage students, attendance, assessments and AI insights smartly.
          </p>
        </div>

        <div className="teacher-profile">
          <div className="profile-circle">T</div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Students</h3>
          <h2>128</h2>
          <span>+12 this month</span>
        </div>

        <div className="stat-card">
          <h3>Attendance Rate</h3>
          <h2>86%</h2>
          <span>Improving steadily</span>
        </div>

        <div className="stat-card">
          <h3>Active Assessments</h3>
          <h2>14</h2>
          <span>4 pending review</span>
        </div>

        <div className="stat-card risk-card">
          <h3>Risk Students</h3>
          <h2>9</h2>
          <span>Need attention</span>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">

        {/* PREDICTION PANEL */}
        <div className="dashboard-card prediction-card">

          <div className="card-header">
            <h2>AI Attendance Prediction 🤖</h2>
            <p>Predict subject-wise attendance risk</p>
          </div>

          <input
            type="text"
            placeholder="Enter Student ID / Enrollment No"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="dashboard-input"
          />

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="dashboard-input"
          >
            <option value="">Select Subject</option>
            <option value="DBMS">DBMS</option>
            <option value="OS">OS</option>
            <option value="DS">DS</option>
            <option value="CN">CN</option>
            <option value="Maths">Maths</option>
            <option value="DS Lab">DS Lab</option>
            <option value="OS Lab">OS Lab</option>
          </select>

          <button
            onClick={getPrediction}
            className="primary-btn"
          >
            Predict Attendance
          </button>

          {prediction && (
            <div className="prediction-result">

              <div className="prediction-item">
                <span>Student</span>
                <strong>{prediction.student_name}</strong>
              </div>

              <div className="prediction-item">
                <span>Subject</span>
                <strong>{prediction.subject}</strong>
              </div>

              <div className="prediction-item">
                <span>Current Attendance</span>
                <strong>{prediction.current_attendance}%</strong>
              </div>

              <div className="prediction-item">
                <span>Next Week Prediction</span>
                <strong>{prediction.predicted_next_week}%</strong>
              </div>

              <div className="prediction-item">
                <span>Model Accuracy</span>
                <strong>{prediction.accuracy}%</strong>
              </div>

              <div className="prediction-item">
                <span>MAE</span>
                <strong>{prediction.mae}</strong>
              </div>

              <div
                className={`risk-badge ${
                  prediction.risk === "High Risk"
                    ? "high-risk"
                    : prediction.risk === "Medium Risk"
                    ? "medium-risk"
                    : "low-risk"
                }`}
              >
                {prediction.risk}
              </div>

            </div>
          )}

        </div>

        {/* QUICK ACTIONS */}
        <div className="dashboard-card">

          <div className="card-header">
            <h2>Quick Actions ⚡</h2>
            <p>Fast access to management tools</p>
          </div>

          <div className="action-grid">

            <button
              onClick={() => navigate("/teacher-add-student")}
              className="action-btn"
            >
              ➕ Add Student
            </button>

            <button
              onClick={() => navigate("/teacher-manage-students")}
              className="action-btn"
            >
              👨‍🎓 Manage Students
            </button>

            <button
              onClick={() => navigate("/teacher-attendance")}
              className="action-btn"
            >
              📅 Attendance
            </button>

            <button
              onClick={() => navigate("/teacher-assignment")}
              className="action-btn"
            >
              📝 Assignments
            </button>

            <button
              onClick={() => navigate("/teacher-assessment")}
              className="action-btn"
            >
              📊 Assessments
            </button>

            <button
              onClick={() => navigate("/teacher-evaluate")}
              className="action-btn"
            >
              ✅ Evaluate
            </button>

            <button
              onClick={() => navigate("/teacher-analytics")}
              className="action-btn"
            >
              📈 Analytics
            </button>

            <button
              onClick={() => window.location.reload()}
              className="action-btn"
            >
              🔄 Refresh
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default TeacherDashboard;