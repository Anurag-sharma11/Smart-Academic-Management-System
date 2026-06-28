import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./AdminManageSubjects.css";

function AdminManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      const response = await API.get("/subjects/");
      setSubjects(response.data);
    } catch (error) {
      console.log("Error fetching subjects:", error);
    }
  };

  const handleDelete = async (subjectId) => {
    const confirmDelete = window.confirm(
      "Delete this subject?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/subjects/${subjectId}`);
      fetchSubjects();
    } catch (error) {
      console.log(error);
      alert("Failed to delete subject");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter((subject) => {
    const nameMatch =
      (subject.subject_name || "")
        .toLowerCase()
        .includes(searchName.toLowerCase());

    const codeMatch =
      (subject.subject_code || "")
        .toLowerCase()
        .includes(searchCode.toLowerCase());

    const typeMatch =
      (subject.subject_type || "")
        .toLowerCase()
        .includes(typeFilter.toLowerCase());

    return (
      nameMatch &&
      codeMatch &&
      typeMatch
    );
  });

  const theoryCount = subjects.filter(
    (s) => s.subject_type === "Theory"
  ).length;

  const practicalCount = subjects.filter(
    (s) => s.subject_type === "Practical"
  ).length;

  return (
    <div className="admin-manage-subjects">

      {/* Header */}
      <div className="subjects-header">

        <div>
          <h1>Subject Management</h1>
          <p>
            Manage all institutional subjects
          </p>
        </div>

        <button
          className="add-subject-btn"
          onClick={() =>
            navigate("/admin-add-subject")
          }
        >
          + Add Subject
        </button>

      </div>

      {/* Stats */}
      <div className="subject-stats">

        <div className="subject-stat-card">
          <h4>Total Subjects</h4>
          <h2>{subjects.length}</h2>
        </div>

        <div className="subject-stat-card">
          <h4>Theory Subjects</h4>
          <h2>{theoryCount}</h2>
        </div>

        <div className="subject-stat-card">
          <h4>Practical Subjects</h4>
          <h2>{practicalCount}</h2>
        </div>

      </div>

      {/* Filters */}
      <div className="subject-filters">

        <input
          type="text"
          placeholder="Search Subject Name..."
          value={searchName}
          onChange={(e) =>
            setSearchName(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Subject Code..."
          value={searchCode}
          onChange={(e) =>
            setSearchCode(e.target.value)
          }
        />

        <select
            value={typeFilter}
            onChange={(e) =>
                setTypeFilter(e.target.value)
            }
        >
            <option value="">
                All Types
            </option>

            <option value="Theory">
                Theory
            </option>

            <option value="Practical">
                Practical
            </option>
        </select>

      </div>

      {/* Table */}
      <div className="subject-table-container">

        <table className="subject-table">

          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Code</th>
              <th>Credits</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => (
                <tr key={subject.id}>

                  <td>{subject.subject_name}</td>

                  <td>{subject.subject_code}</td>

                  <td>{subject.credits}</td>

                  <td>{subject.subject_type}</td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(
                          `/admin-edit-subject/${subject.id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(subject.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  No subjects found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminManageSubjects;