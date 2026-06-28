import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "./AdminEditSubject.css";

function AdminEditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subjectData, setSubjectData] = useState({
    subject_name: "",
    subject_code: "",
    credits: "",
    subject_type: "Theory",
  });

  const fetchSubject = async () => {
    try {
      const response = await API.get(`/subjects/${id}`);

      setSubjectData(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load subject");
    }
  };

  useEffect(() => {
    fetchSubject();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(
        `/subjects/${id}`,
        subjectData
      );

      alert("Subject updated successfully");

      navigate("/admin-manage-subjects");

    } catch (error) {
      console.log(error);
      alert("Failed to update subject");
    }
  };

  return (
    <div className="admin-edit-subject">

      <div className="edit-subject-header">
        <h1>Edit Subject</h1>
        <p>Update subject details</p>
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
          Update Subject
        </button>

      </form>

    </div>
  );
}

export default AdminEditSubject;