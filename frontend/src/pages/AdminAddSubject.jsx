import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./AdminAddSubject.css";

function AdminAddSubject() {
  const navigate = useNavigate();

  const [subjectData, setSubjectData] = useState({
    subject_name: "",
    subject_code: "",
    credits: "",
    subject_type: "Theory",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/subjects/", subjectData);

      alert("Subject created successfully");

      navigate("/admin-manage-subjects");
    } catch (error) {
      console.log(error);
      alert("Failed to create subject");
    }
  };

  return (
    <div className="admin-add-subject">

      <div className="add-subject-header">
        <h1>Add Subject</h1>
        <p>Create a new subject for the institution</p>
      </div>

      <form
        className="subject-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          placeholder="Subject Name"
          value={subjectData.subject_name}
          onChange={(e) =>
            setSubjectData({
              ...subjectData,
              subject_name: e.target.value,
            })
          }
          required
        />

        <input
          type="text"
          placeholder="Subject Code"
          value={subjectData.subject_code}
          onChange={(e) =>
            setSubjectData({
              ...subjectData,
              subject_code: e.target.value,
            })
          }
          required
        />

        <input
          type="number"
          placeholder="Credits"
          value={subjectData.credits}
          onChange={(e) =>
            setSubjectData({
              ...subjectData,
              credits: e.target.value,
            })
          }
          required
        />

        <select
          value={subjectData.subject_type}
          onChange={(e) =>
            setSubjectData({
              ...subjectData,
              subject_type: e.target.value,
            })
          }
        >
          <option value="Theory">
            Theory
          </option>

          <option value="Practical">
            Practical
          </option>
        </select>

        <button
          type="submit"
          className="save-subject-btn"
        >
          Create Subject
        </button>

      </form>

    </div>
  );
}

export default AdminAddSubject;