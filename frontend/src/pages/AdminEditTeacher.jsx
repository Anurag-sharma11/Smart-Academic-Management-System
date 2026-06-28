import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "./AdminEditTeacher.css";

function AdminEditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    employee_id: "",
    department: "",
    phone: "",
  });

  const fetchTeacher = async () => {
    try {
      const response = await API.get(`/admin/teachers/${id}`);

      setTeacherData({
        name: response.data.name || "",
        email: response.data.email || "",
        employee_id: response.data.employee_id || "",
        department: response.data.department || "",
        phone: response.data.phone || "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load teacher");
    }
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/admin/teachers/${id}`, teacherData);

      alert("Teacher updated successfully");

      navigate("/admin-manage-teachers");
    } catch (error) {
      console.log(error);
      alert("Failed to update teacher");
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  return (
    <div className="admin-edit-teacher">
      <div className="edit-teacher-header">
        <h1>Edit Teacher</h1>
        <p>Update teacher information</p>
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
          className="update-btn"
          onClick={handleUpdate}
        >
          Update Teacher
        </button>

      </div>
    </div>
  );
}

export default AdminEditTeacher;