from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.attendance import Attendance
from app.models.assignment import Assignment, Submission

student_bp = Blueprint("student", __name__, url_prefix="/api/student")


@student_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def student_dashboard():

    student_id = int(get_jwt_identity())

    # 📊 ATTENDANCE
    records = Attendance.query.filter_by(student_id=student_id).all()

    total = len(records)
    present = sum(1 for r in records if r.status == "present")

    attendance_percentage = (present / total * 100) if total > 0 else 0

    # 🤖 SIMPLE PREDICTION
    next_week = (
        attendance_percentage - 5
        if attendance_percentage > 50
        else attendance_percentage + 5
    )

    # 📘 ASSIGNMENTS
    assignments = Assignment.query.all()
    submissions = Submission.query.filter_by(student_id=student_id).all()

    submitted_count = len(submissions)
    total_assignments = len(assignments)
    pending = total_assignments - submitted_count

    # 🎯 MARKS
    marks_list = [s.marks for s in submissions if s.marks is not None]
    avg_marks = sum(marks_list) / len(marks_list) if marks_list else 0

    return jsonify({
        "student_id": student_id,
        "attendance": round(attendance_percentage, 2),
        "prediction": round(next_week, 2),
        "total_assignments": total_assignments,
        "submitted": submitted_count,
        "pending": pending,
        "avg_marks": round(avg_marks, 2)
    })