import { Outlet, useNavigate, useLocation } from "react-router-dom";
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

import "../pages/AdminDashboard.css";

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    return (<div className="admin-layout">

        <aside className="sidebar">
            <div className="logo">
                <div className="logo-icon">A</div>

                <div className="logo-text">
                    <h2>ALASK</h2>
                    <span>Admin ERP</span>
                </div>
            </div>

            <nav className="menu">

                <button
                    className={
                        location.pathname === "/admin-dashboard"
                            ? "menu-item active"
                            : "menu-item"
                    }
                    onClick={() => navigate("/admin-dashboard")}
                >
                    <FaHome />
                    <span>Dashboard</span>
                </button>

                <button
                    className={
                        location.pathname.includes(
                            "/admin-manage-teachers"
                        ) ||
                            location.pathname.includes(
                                "/admin-add-teacher"
                            ) ||
                            location.pathname.includes(
                                "/admin-edit-teacher"
                            )
                            ? "menu-item active"
                            : "menu-item"
                    }
                    onClick={() => navigate("/admin-manage-teachers")}
                >
                    <FaChalkboardTeacher />
                    <span>Teachers</span>
                </button>

                <button
                    className={
                        location.pathname.includes("/admin-manage-subjects") ||
                            location.pathname.includes("/admin-add-subject") ||
                            location.pathname.includes("/admin-edit-subject")
                            ? "menu-item active"
                            : "menu-item"
                    }
                    onClick={() => navigate("/admin-manage-subjects")}
                >
                    <FaBook />
                    <span>Subjects</span>
                </button>

                <button className="menu-item">
                    <FaSchool />
                    <span>Classes</span>
                </button>

                <button className="menu-item">
                    <FaProjectDiagram />
                    <span>Faculty Mapping</span>
                </button>

                <button className="menu-item">
                    <FaCalendarAlt />
                    <span>Timetable</span>
                </button>

                <button className="menu-item">
                    <FaChartLine />
                    <span>Analytics</span>
                </button>

                <button className="menu-item">
                    <FaUserShield />
                    <span>Sub Admins</span>
                </button>

                <button className="menu-item">
                    <FaCog />
                    <span>Settings</span>
                </button>

            </nav>
        </aside>

        <main className="main-content">

            <header className="topbar">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search..."
                    />
                </div>

                <div className="top-actions">
                    <FaBell className="top-icon" />

                    <div className="profile-circle">
                        A
                    </div>
                </div>
            </header>

            <Outlet />

        </main>

    </div>

    );
}

export default AdminLayout;
