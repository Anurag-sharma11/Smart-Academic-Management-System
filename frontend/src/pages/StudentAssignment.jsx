import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import API from "../services/api"
import "./StudentAssignment.css"

function StudentAssignment() {
    const [assignments, setAssignments] = useState([])
    const [answers, setAnswers] = useState({})
    const [files, setFiles] = useState({})

    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const filter = params.get("filter")

    // 🔹 FETCH ASSIGNMENTS
    const fetchAssignments = async () => {
        try {
            const res = await API.get("/assignment/all")
            setAssignments(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    // 🔹 SUBMIT ASSIGNMENT
    const handleSubmit = async (id) => {
        try {
            const formData = new FormData()

            formData.append("content", answers[id] || "")

            if (files[id]) {
                formData.append("file", files[id])
            }

            await API.post(`/assignment/submit/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            alert("Submitted ✅")
            fetchAssignments()

        } catch (err) {
            console.log(err)
            alert("Submission failed ❌")
        }
    }

    useEffect(() => {
        fetchAssignments()
    }, [])

    // 🔥 FILTER LOGIC
    let filteredAssignments = assignments

    if (filter === "pending") {
        filteredAssignments = assignments.filter(a => !a.submitted)
    }

    if (filter === "submitted") {
        filteredAssignments = assignments.filter(a => a.submitted)
    }

    return (
        <div className="student-assignment-page">

            {/* HEADER */}

            <div className="assignment-header">

                <div>

                    <h1>Student Assignments 📘</h1>

                    <p>
                        View assignments, upload submissions and track marks.
                    </p>

                </div>

                <div className="assignment-badge">
                    LMS ASSIGNMENTS
                </div>

            </div>

            {/* EMPTY */}

            {filteredAssignments.length === 0 && (

                <div className="empty-assignment-box">
                    No assignments found
                </div>

            )}

            {/* ASSIGNMENTS */}

            <div className="student-assignment-list">

                {filteredAssignments.map((a) => {

                    const isExpired =
                        new Date(a.deadline) < new Date()

                    return (

                        <div
                            key={a.id}
                            className="student-assignment-card"
                        >

                            {/* TOP */}

                            <div className="assignment-card-top">

                                <div>

                                    <h2>{a.title}</h2>

                                    <p className="assignment-description">
                                        {a.description}
                                    </p>

                                </div>

                                <div
                                    className={
                                        a.submitted
                                            ? "submitted-badge"
                                            : "pending-badge"
                                    }
                                >

                                    {a.submitted
                                        ? "Submitted"
                                        : "Pending"}

                                </div>

                            </div>

                            {/* DEADLINE */}

                            <div className="deadline-row">

                                <span>
                                    📅 Deadline:
                                </span>

                                <p>
                                    {new Date(
                                        a.deadline
                                    ).toLocaleString()}
                                </p>

                            </div>

                            {/* DEADLINE EXPIRED */}

                            {isExpired && (

                                <div className="expired-box">
                                    Deadline Passed ❌
                                </div>

                            )}

                            {/* FILE */}

                            {a.file_url && (

                                <a
                                    href={`http://127.0.0.1:5000${a.file_url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="assignment-file-link"
                                >
                                    View Assignment File 📄
                                </a>

                            )}

                            {/* STATUS */}

                            <div className="assignment-status-grid">

                                <div className="status-card">

                                    <span>Status</span>

                                    <h3>
                                        {a.submitted
                                            ? "Submitted"
                                            : "Not Submitted"}
                                    </h3>

                                </div>

                                <div className="status-card">

                                    <span>Marks</span>

                                    <h3>
                                        {a.marks !== null
                                            ? a.marks
                                            : "Not graded"}
                                    </h3>

                                </div>

                            </div>

                            {/* SUBMISSION UI */}

                            {!a.submitted && !isExpired && (

                                <div className="submission-box">

                                    <textarea
                                        placeholder="Write your answer..."
                                        onChange={(e) =>
                                            setAnswers({
                                                ...answers,
                                                [a.id]: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setFiles({
                                                ...files,
                                                [a.id]: e.target.files[0]
                                            })
                                        }
                                    />

                                    <button
                                        onClick={() =>
                                            handleSubmit(a.id)
                                        }
                                    >
                                        Submit Assignment 🚀
                                    </button>

                                </div>

                            )}

                            {/* CLOSED */}

                            {isExpired && !a.submitted && (

                                <div className="closed-box">
                                    Submission Closed
                                </div>

                            )}

                        </div>

                    )
                })}

            </div>

        </div>
    )
}

export default StudentAssignment