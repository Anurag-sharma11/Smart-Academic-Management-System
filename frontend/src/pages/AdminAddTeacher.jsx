import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAddTeacher.css";
import API from "../services/api";


function AdminAddTeacher() {
  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    password: "",
    employee_id: "",
    department: "",
    phone: "",
  });

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            await API.post("/auth/register", {
                ...teacherData,
                role: "teacher",
            });

            alert("Teacher created successfully");

            setTeacherData({
                name: "",
                email: "",
                password: "",
                employee_id: "",
                department: "",
                phone: "",
            });

            navigate("/admin-manage-teachers");

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.error ||
                "Failed to create teacher"
            );
        }
    };

  return (
    <div className="admin-add-teacher">
      <div className="add-teacher-header">
        <h1>Add Teacher</h1>
        <p>Create a new faculty account</p>
      </div>

      <div className="teacher-form">

        <input
          type="text"
          placeholder="Teacher Name"
          value={teacherData.name}
          onChange={(e) =>
            setTeacherData({
              ...teacherData,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={teacherData.email}
          onChange={(e) =>
            setTeacherData({
              ...teacherData,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={teacherData.password}
          onChange={(e) =>
            setTeacherData({
              ...teacherData,
              password: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Employee ID"
          value={teacherData.employee_id}
          onChange={(e) =>
            setTeacherData({
              ...teacherData,
              employee_id: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Department"
          value={teacherData.department}
          onChange={(e) =>
            setTeacherData({
              ...teacherData,
              department: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Phone"
          value={teacherData.phone}
          onChange={(e) =>
            setTeacherData({
              ...teacherData,
              phone: e.target.value,
            })
          }
        />

        <button
            className="save-btn"
            onClick={handleSubmit}
        >
            Create Teacher
        </button>

      </div>
    </div>
  );
}

export default AdminAddTeacher;