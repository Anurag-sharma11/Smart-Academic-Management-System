import { useState, useEffect } from "react"
import API from "../services/api"
import "./TeacherAssignment.css"

function TeacherAssignment() {
    const [title, setTitle] = useState("")
    const [deadline, setDeadline] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState(null)

    const [assignments, setAssignments] = useState([])
    const [submissions, setSubmissions] = useState([])
    const [selectedAssignment, setSelectedAssignment] = useState(null)

    // 🔥 NEW STATE FOR MARKS (FIXED)
    const [marksInput, setMarksInput] = useState({})
    const [editingMarks, setEditingMarks] = useState({})

    // 🔹 CREATE ASSIGNMENT
    const handleCreate = async () => {
        try {
            const token = localStorage.getItem("token")

            const formData = new FormData()
            formData.append("title", title)
            formData.append("description", description)
            formData.append("deadline", deadline)

            if (file) {
                formData.append("file", file)
            }

            await API.post("/assignment/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            alert("Assignment Created ✅")

            // 🔥 CLEAR FORM
            setTitle("")
            setDescription("")
            setDeadline("")
            setFile(null)

            fetchAssignments()

        } catch (err) {
            console.log(err)
            alert("Error creating assignment")
        }
    }

    // 🔹 FETCH ASSIGNMENTS
    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem("token")

            const res = await API.get("/assignment/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setAssignments(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    // 🔹 VIEW SUBMISSIONS
    const viewSubmissions = async (id) => {
        try {
            const token = localStorage.getItem("token")

            const res = await API.get(`/assignment/submissions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setSubmissions(res.data)
            setSelectedAssignment(id)
        } catch (err) {
            console.log(err)
        }
    }

    // 🔹 GIVE MARKS
    const giveMarks = async (submissionId, marks) => {
        try {
            const token = localStorage.getItem("token")

            await API.patch(
                `/assignment/grade/${submissionId}`,
                { marks },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            alert("Marks submitted ✅")

            viewSubmissions(selectedAssignment)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchAssignments()
    }, [])

    return (
        <div className="assignment-page">

            {/* HEADER */}

            <div className="assignment-header">

                <div>

                    <h1>Assignment Management 📘</h1>

                    <p>
                        Create assignments, review submissions and evaluate students.
                    </p>

                </div>

                <div className="assignment-badge">
                    LMS MODULE
                </div>

            </div>

            {/* CREATE FORM */}

            <div className="assignment-form-card">

                <h2>Create Assignment</h2>

                <div className="assignment-form-grid">

                    <input
                        type="text"
                        placeholder="Assignment Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <input
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />

                </div>

                <textarea
                    placeholder="Assignment Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="file-upload-box">

                    <label>
                        Upload Assignment File 📄
                    </label>

                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                </div>

                <button
                    onClick={handleCreate}
                    className="create-assignment-btn"
                >
                    Create Assignment
                </button>

            </div>

            {/* ASSIGNMENTS */}

            <div className="assignments-section">

                <div className="section-top">

                    <h2>Assignments 📋</h2>

                    <span>
                        {assignments.length} Assignments
                    </span>

                </div>

                <div className="assignments-grid">

                    {assignments.map((a) => (

                        <div
                            key={a.id}
                            className="assignment-card"
                        >

                            <div className="assignment-top">

                                <h3>{a.title}</h3>

                                <div className="deadline-badge">
                                    Deadline
                                </div>

                            </div>

                            <p className="deadline-text">
                                {new Date(a.deadline).toLocaleString()}
                            </p>

                            {a.file_url && (

                                <a
                                    href={`http://127.0.0.1:5000${a.file_url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="file-link"
                                >
                                    View File 📄
                                </a>

                            )}

                            <button
                                onClick={() => viewSubmissions(a.id)}
                                className="view-submissions-btn"
                            >
                                View Submissions
                            </button>

                        </div>

                    ))}

                </div>

            </div>

            {/* SUBMISSIONS */}

            {selectedAssignment && (

                <div className="submissions-card">

                    <div className="section-top">

                        <h2>
                            Assignment Submissions 📥
                        </h2>

                        <span>
                            Assignment ID: {selectedAssignment}
                        </span>

                    </div>

                    {submissions.length === 0 ? (

                        <div className="empty-box">
                            No submissions yet
                        </div>

                    ) : (

                        <div className="submissions-list">

                            {submissions.map((s) => (

                                <div
                                    key={s.id}
                                    className="submission-item"
                                >

                                    <div className="submission-top">

                                        <div>

                                            <h3>
                                                Student ID: {s.student_id}
                                            </h3>

                                            <p>
                                                Submitted:
                                                {" "}
                                                {new Date(
                                                    s.submitted_at
                                                ).toLocaleString()}
                                            </p>

                                        </div>

                                        <div className="marks-badge">

                                            {s.marks !== null
                                                ? `${s.marks} Marks`
                                                : "Not Graded"}

                                        </div>

                                    </div>

                                    <div className="answer-box">
                                        {s.content}
                                    </div>

                                    {s.file_url && (

                                        <a
                                            href={`http://127.0.0.1:5000${s.file_url}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="file-link"
                                        >
                                            View Student File 📄
                                        </a>

                                    )}

                                    <div className="grading-box">

                                        {s.marks !== null && !editingMarks[s.id] ? (

                                            <div className="marks-display">

                                                <span>
                                                    Marks Given: {s.marks}
                                                </span>

                                                <button
                                                    className="edit-marks-btn"
                                                    onClick={() =>
                                                        setEditingMarks({
                                                            ...editingMarks,
                                                            [s.id]: true
                                                        })
                                                    }
                                                >
                                                    Edit Marks
                                                </button>

                                            </div>

                                        ) : (

                                            <>

                                                <input
                                                    type="number"
                                                    placeholder="Enter marks"
                                                    value={marksInput[s.id] || ""}
                                                    onChange={(e) =>
                                                        setMarksInput({
                                                            ...marksInput,
                                                            [s.id]: e.target.value
                                                        })
                                                    }
                                                />

                                                <button
                                                    onClick={() => {
                                                        giveMarks(s.id, marksInput[s.id])

                                                        setEditingMarks({
                                                            ...editingMarks,
                                                            [s.id]: false
                                                        })
                                                    }}
                                                >
                                                    {s.marks !== null
                                                        ? "Update Marks"
                                                        : "Submit Marks"}
                                                </button>

                                            </>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            )}

        </div>
    )
}

export default TeacherAssignment
