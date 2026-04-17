import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import API from "../services/api"

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
        <div className="min-h-screen bg-gray-900 text-white p-10">

            <h1 className="text-3xl font-bold mb-6">
                Student Assignments 📘
            </h1>

            {/* 🔥 EMPTY STATE */}
            {filteredAssignments.length === 0 && (
                <p className="text-gray-400">No assignments found</p>
            )}

            {filteredAssignments.map((a) => {
                const isExpired = new Date(a.deadline) < new Date()

                return (
                    <div
                        key={a.id}
                        className="bg-gray-800 p-5 rounded mb-5 hover:scale-[1.01] transition"
                    >

                        <h2 className="text-xl font-bold">{a.title}</h2>

                        <p className="text-gray-300">{a.description}</p>

                        <p className="text-sm text-gray-400 mt-1">
                            Deadline: {new Date(a.deadline).toLocaleString()}
                        </p>

                        {/* 🔥 DEADLINE STATUS */}
                        {isExpired && (
                            <p className="text-red-400 mt-1">
                                Deadline Passed ❌
                            </p>
                        )}

                        {/* 🔥 VIEW TEACHER FILE */}
                        {a.file_url && (
                            <a
                                href={`http://127.0.0.1:5000${a.file_url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 underline block mt-2"
                            >
                                View Assignment File 📄
                            </a>
                        )}

                        {/* 🔥 STATUS */}
                        <div className="mt-2">
                            <p>
                                Status:{" "}
                                {a.submitted
                                    ? "✅ Submitted"
                                    : "❌ Not Submitted"}
                            </p>

                            <p>
                                Marks:{" "}
                                {a.marks !== null
                                    ? `${a.marks}`
                                    : "Not graded"}
                            </p>
                        </div>

                        {/* 🔥 SUBMIT UI */}
                        {!a.submitted && !isExpired && (
                            <div className="mt-3">

                                <textarea
                                    placeholder="Write your answer..."
                                    className="w-full p-2 bg-gray-700 rounded outline-none"
                                    onChange={(e) =>
                                        setAnswers({
                                            ...answers,
                                            [a.id]: e.target.value
                                        })
                                    }
                                />

                                <input
                                    type="file"
                                    className="mt-2"
                                    onChange={(e) =>
                                        setFiles({
                                            ...files,
                                            [a.id]: e.target.files[0]
                                        })
                                    }
                                />

                                <button
                                    onClick={() => handleSubmit(a.id)}
                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 mt-3 rounded"
                                >
                                    Submit Assignment 🚀
                                </button>
                            </div>
                        )}

                        {/* 🔥 BLOCK IF DEADLINE PASSED */}
                        {isExpired && !a.submitted && (
                            <p className="text-red-400 mt-3">
                                Submission closed
                            </p>
                        )}

                    </div>
                )
            })}
        </div>
    )
}

export default StudentAssignment