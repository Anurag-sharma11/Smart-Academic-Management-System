from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.attendance import Attendance
from app.models.assignment import Assignment, Submission
from app.models.user import User
from app.extensions import db

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
    
@student_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_students():
    students = User.query.filter_by(role="student").all()

    return jsonify([
        {
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "student_id": s.student_id,
            "enrollment_no": s.enrollment_no,
            "course": s.course,
            "class_name": s.class_name,
            "section": s.section,
            "age": s.age,
            "gender": s.gender,
            "phone": s.phone
        }
        for s in students
    ])

@student_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_student(id):
    student = User.query.filter_by(id=id, role="student").first()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    return jsonify({
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "student_id": student.student_id,
        "enrollment_no": student.enrollment_no,
        "course": student.course,
        "class_name": student.class_name,
        "section": student.section,
        "age": student.age,
        "gender": student.gender,
        "phone": student.phone
    })

@student_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_student(id):
    student = User.query.filter_by(id=id, role="student").first()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    data = request.get_json()

    student.name = data.get("name", student.name)
    student.email = data.get("email", student.email)
    student.age = data.get("age", student.age)
    student.gender = data.get("gender", student.gender)
    student.phone = data.get("phone", student.phone)
    student.student_id = data.get("student_id", student.student_id)
    student.enrollment_no = data.get("enrollment_no", student.enrollment_no)
    student.course = data.get("course", student.course)
    student.class_name = data.get("class_name", student.class_name)
    student.section = data.get("section", student.section)

    db.session.commit()

    return jsonify({"message": "Student updated successfully"})

@student_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_student(id):
    student = User.query.filter_by(id=id, role="student").first()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    db.session.delete(student)
    db.session.commit()

    return jsonify({"message": "Student deleted successfully"})