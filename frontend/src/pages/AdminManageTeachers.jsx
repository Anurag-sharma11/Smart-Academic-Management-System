import { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminManageTeachers.css";
import { useNavigate } from "react-router-dom";

function AdminManageTeachers() {
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [employeeIdFilter, setEmployeeIdFilter] = useState("");

    const navigate = useNavigate();

    const fetchTeachers = async () => {
        try {
            const response = await API.get("/admin/teachers");
            setTeachers(response.data);
        } catch (error) {
            console.log("Error fetching teachers:", error);
        }
    };

    const handleDelete = async (teacherId) => {
        const confirmDelete = window.confirm(
            "Delete this teacher?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/admin/teachers/${teacherId}`);
            fetchTeachers();
        } catch (error) {
            console.log(error);
            alert("Failed to delete teacher");
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const filteredTeachers = teachers.filter((teacher) => {

        const nameMatch =
            (teacher.name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const departmentMatch =
            (teacher.department || "")
                .toLowerCase()
                .includes(departmentFilter.toLowerCase());

        const employeeMatch =
            (teacher.employee_id || "")
                .toLowerCase()
                .includes(employeeIdFilter.toLowerCase());

        return (
            nameMatch &&
            departmentMatch &&
            employeeMatch
        );
    });

    const sortedTeachers = [...filteredTeachers].sort((a, b) => {
        const aNum =
            parseInt(
                (a.employee_id || "").replace(/\D/g, "")
            ) || 0;

        const bNum =
            parseInt(
                (b.employee_id || "").replace(/\D/g, "")
            ) || 0;

        return aNum - bNum;
    });

    const departmentCount = [
        ...new Set(
            teachers
                .map((teacher) => teacher.department)
                .filter(Boolean)
        ),
    ].length;

    return (
        <div className="admin-manage-teachers">

            {/* Header */}
            <div className="teachers-header">

                <div>
                    <h1>Teacher Management</h1>
                    <p>
                        Manage all faculty members of the institution
                    </p>
                </div>

                <button
                    className="add-teacher-btn"
                    onClick={() =>
                        navigate("/admin-add-teacher")
                    }
                >
                    + Add Teacher
                </button>

            </div>

            {/* Stats */}
            <div className="teacher-stats">

                <div className="teacher-stat-card">
                    <h4>Total Teachers</h4>
                    <h2>{teachers.length}</h2>
                </div>

                <div className="teacher-stat-card">
                    <h4>Departments</h4>
                    <h2>{departmentCount}</h2>
                </div>

            </div>

            {/* Search + Filter */}
            <div className="teacher-filters">

                <input
                    type="text"
                    placeholder="Search Teacher Name..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="Department..."
                    value={departmentFilter}
                    onChange={(e) =>
                        setDepartmentFilter(e.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="Employee ID..."
                    value={employeeIdFilter}
                    onChange={(e) =>
                        setEmployeeIdFilter(e.target.value)
                    }
                />

            </div>

            {/* Table */}
            <div className="teacher-table-container">

                <table className="teacher-table">

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Employee ID</th>
                            <th>Department</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {sortedTeachers.length > 0 ? (
                            sortedTeachers.map((teacher) => (
                                <tr key={teacher.id}>

                                    <td>{teacher.name}</td>

                                    <td>{teacher.email}</td>

                                    <td>
                                        {teacher.employee_id || "-"}
                                    </td>

                                    <td>
                                        {teacher.department || "-"}
                                    </td>

                                    <td>
                                        {teacher.phone || "-"}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/admin-edit-teacher/${teacher.id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            style={{
                                                marginLeft: "10px",
                                            }}
                                            onClick={() =>
                                                handleDelete(
                                                    teacher.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">
                                    No teachers found
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default AdminManageTeachers;