import { useState, useEffect } from "react"
import API from "../services/api"

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
        <div className="min-h-screen bg-gray-900 text-white p-10">

            {/* 🔥 CREATE FORM */}
            <div className="bg-gray-800 p-6 rounded-xl w-96 shadow-lg mb-10">
                <h2 className="text-2xl font-bold mb-4">
                    Create Assignment 📘
                </h2>

                <input
                    type="text"
                    placeholder="Assignment Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-4 p-3 rounded bg-gray-700 outline-none"
                />

                <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full mb-4 p-3 rounded bg-gray-700 outline-none"
                />

                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mb-4 p-3 rounded bg-gray-700 outline-none"
                />

                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full mb-4 p-3 rounded bg-gray-700 outline-none"
                />

                <button
                    onClick={handleCreate}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
                >
                    Create Assignment
                </button>
            </div>

            {/* 🔥 ASSIGNMENT LIST */}
            <h2 className="text-2xl mb-4">Assignments 📋</h2>

            {assignments.map((a) => (
                <div key={a.id} className="bg-gray-800 p-4 rounded mb-4">
                    <h3 className="text-lg font-bold">{a.title}</h3>
                    <p>Deadline: {new Date(a.deadline).toLocaleString()}</p>

                    {/* 🔥 FILE VIEW */}
                    {a.file_url && (
                        <a
                            href={`http://127.0.0.1:5000${a.file_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 underline block mt-2"
                        >
                            View File 📄
                        </a>
                    )}

                    <button
                        onClick={() => viewSubmissions(a.id)}
                        className="bg-yellow-500 px-3 py-1 rounded mt-2"
                    >
                        View Submissions
                    </button>
                </div>
            ))}

            {/* 🔥 SUBMISSIONS UI */}
            {selectedAssignment && (
                <div className="mt-8 bg-gray-800 p-5 rounded">
                    <h2 className="text-xl mb-4">
                        Submissions (Assignment ID: {selectedAssignment})
                    </h2>

                    {submissions.length === 0 ? (
                        <p>No submissions yet</p>
                    ) : (
                        submissions.map((s) => (
                            <div key={s.id} className="border p-3 mb-3 rounded">

                                <p><strong>Student ID:</strong> {s.student_id}</p>
                                <p><strong>Answer:</strong> {s.content}</p>

                                {s.file_url && (
                                    <a
                                        href={`http://127.0.0.1:5000${s.file_url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-400 underline block mt-2"
                                    >
                                        View Student File 📄
                                    </a>
                                )}

                                <p>
                                    <strong>Time:</strong>{" "}
                                    {new Date(s.submitted_at).toLocaleString()}
                                </p>

                                <p>
                                    <strong>Marks:</strong>{" "}
                                    {s.marks !== null ? s.marks : "Not graded"}
                                </p>

                                {/* 🔥 FIXED INPUT */}
                                <input
                                    type="number"
                                    placeholder="Enter marks"
                                    onChange={(e) =>
                                        setMarksInput({
                                            ...marksInput,
                                            [s.id]: e.target.value
                                        })
                                    }
                                    className="p-2 bg-gray-700 rounded mr-2 mt-2"
                                />

                                {/* 🔥 FIXED BUTTON */}
                                <button
                                    onClick={() => giveMarks(s.id, marksInput[s.id])}
                                    className="bg-green-600 px-3 py-1 rounded mt-2"
                                >
                                    Submit Marks
                                </button>

                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default TeacherAssignment
