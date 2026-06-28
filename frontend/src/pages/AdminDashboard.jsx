import { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

import {
  FaHome,
  FaChalkboardTeacher,
  FaBook,
  FaSchool,
  FaProjectDiagram,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaBell,
  FaSearch,
  FaUserShield,
} from "react-icons/fa";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await API.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const teacherCount = users.filter(
    (user) => user.role === "teacher"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const subAdminCount = users.filter(
    (user) => user.role === "sub_admin"
  ).length;

  return (
      <>
        {/* WELCOME CARD */}
        <section className="welcome-card">

          <div>
            <h1>
              Welcome Back, Anurag 👋 
            </h1>

            <p>
              Manage faculty, subjects,
              classes and institutional operations.
            </p>
          </div>

          <div className="welcome-badge">
            ALASK ERP
          </div>

        </section>

        {/* STATS */}
        <section className="stats-grid">
          <div className="stat-card">
            <h4>Teachers</h4>
            <h2>{teacherCount}</h2>
          </div>

          <div className="stat-card">
            <h4>Classes</h4>
            <h2>12</h2>
          </div>

          <div className="stat-card">
            <h4>Subjects</h4>
            <h2>42</h2>
          </div>

          <div className="stat-card">
            <h4>Faculty Mapping</h4>
            <h2>18</h2>
          </div>
        </section>

        {/* OPERATIONS */}
        <section className="dashboard-row">
          {/* ACADEMICS */}
          <div className="panel">
            <h2>Academic Management</h2>

            <div className="panel-buttons">
              <button>📚 Manage Subjects</button>

              <button>🏫 Manage Classes</button>

              <button>🎯 Faculty Assignment</button>

              <button>📅 Timetable</button>
            </div>
          </div>

          {/* ADMINISTRATION */}
          <div className="panel">
            <h2>User Administration</h2>

            <div className="panel-buttons">
              <button>👨‍🏫 Manage Teachers</button>

              <button>🛡️ Manage Sub Admins</button>

              <button>⚙️ Permissions</button>

              <button>📊 Analytics</button>
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITIES */}
        <section className="activity-panel">
          <h2>Recent Activities</h2>

          <ul>
            <li>Teacher Added</li>
            <li>Subject Created</li>
            <li>Class Assigned</li>
            <li>Faculty Mapping Updated</li>
          </ul>
        </section>
        </>
  );
}

export default AdminDashboard;