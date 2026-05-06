from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.attendance import Attendance
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.ml.predictor import predict_attendance_and_risk
from datetime import datetime

attendance_bp = Blueprint("attendance", __name__, url_prefix="/api/attendance")


# =========================================================
# MARK ATTENDANCE
# =========================================================
@attendance_bp.route("/mark", methods=["POST"])
@jwt_required()
def mark_attendance():
    claims = get_jwt()

    if claims.get("role") != "teacher":
        return jsonify({"message": "Only teacher allowed"}), 403

    data = request.get_json()

    records = data.get("records", [])
    date_str = data.get("date")
    subject = data.get("subject")
    period_number = data.get("period_number")
    start_time_str = data.get("start_time")
    end_time_str = data.get("end_time")

    if not all([
        records,
        date_str,
        subject,
        period_number,
        start_time_str,
        end_time_str
    ]):
        return jsonify({"message": "All attendance fields are required"}), 400

    attendance_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    start_time = datetime.strptime(start_time_str, "%H:%M").time()
    end_time = datetime.strptime(end_time_str, "%H:%M").time()

    for record in records:
        attendance = Attendance(
            student_id=record["student_id"],
            status=record["status"],
            date=attendance_date,
            subject=subject,
            period_number=period_number,
            start_time=start_time,
            end_time=end_time
        )

        db.session.add(attendance)

    db.session.commit()

    return jsonify({"message": "Attendance saved successfully"}), 200


# =========================================================
# STUDENT VIEW OWN ATTENDANCE
# =========================================================
@attendance_bp.route("/my", methods=["GET"])
@jwt_required()
def my_attendance():
    user_id = get_jwt_identity()

    records = Attendance.query.filter_by(student_id=user_id).all()

    result = []
    present = 0

    for r in records:
        if r.status == "present":
            present += 1

        result.append({
            "date": r.date.strftime("%Y-%m-%d"),
            "status": r.status,
            "period_number": r.period_number,
            "subject": r.subject,
            "start_time": str(r.start_time),
            "end_time": str(r.end_time)
        })

    total = len(records)
    percentage = (present / total * 100) if total > 0 else 0

    return jsonify({
        "records": result,
        "percentage": percentage
    })


# =========================================================
# TEACHER VIEW ALL ATTENDANCE
# =========================================================
@attendance_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_attendance():
    claims = get_jwt()

    if claims.get("role") != "teacher":
        return jsonify({"message": "Only teacher allowed"}), 403

    records = Attendance.query.order_by(
        Attendance.date.desc(),
        Attendance.period_number.asc()
    ).all()

    result = []

    for r in records:
        student = User.query.get(r.student_id)

        result.append({
            "id": r.id,
            "student_id": student.student_id if student else "N/A",
            "student_name": student.name if student else "Unknown",
            "date": r.date.strftime("%Y-%m-%d"),
            "subject": r.subject,
            "period_number": r.period_number,
            "start_time": str(r.start_time),
            "end_time": str(r.end_time),
            "status": r.status
        })

    return jsonify(result)


# =========================================================
# ATTENDANCE PREDICTION
# =========================================================
@attendance_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict_attendance():
    claims = get_jwt()

    if claims.get("role") != "teacher":
        return jsonify({"message": "Only teacher allowed"}), 403

    data = request.get_json()

    student_identifier = data.get("student_id")
    subject = data.get("subject")

    if not student_identifier or not subject:
        return jsonify({"message": "Student ID and Subject required"}), 400

    student = User.query.filter(
        (User.student_id == student_identifier) |
        (User.enrollment_no == student_identifier)
    ).first()

    if not student:
        return jsonify({"message": "Student not found"}), 404

    records = Attendance.query.filter_by(
        student_id=student.id,
        subject=subject
    ).order_by(
        Attendance.date.asc(),
        Attendance.period_number.asc()
    )

    if not records:
        return jsonify({"message": "No attendance data for this subject"}), 404

    attendance_list = [
        1 if r.status == "present" else 0
        for r in records
    ]

    current_percentage = (sum(attendance_list) / len(attendance_list)) * 100

    predicted, risk, accuracy, mae = predict_attendance_and_risk(attendance_list)

    if predicted is None:
        return jsonify({"message": "Not enough data"}), 400

    return jsonify({
        "student_name": student.name,
        "subject": subject,
        "current_attendance": round(current_percentage, 2),
        "predicted_next_week": round(predicted, 2),
        "risk": risk,
        "accuracy": round(accuracy, 2),
        "mae": round(mae, 4)
    })
    
# =========================================================
# Analytics
# =========================================================    
@attendance_bp.route("/analytics", methods=["POST"])
@jwt_required()
def attendance_analytics():
    claims = get_jwt()

    if claims.get("role") != "teacher":
        return jsonify({"message": "Only teacher allowed"}), 403

    data = request.get_json()

    course = data.get("course")
    semester = data.get("semester")
    section = data.get("section")

    students = User.query.filter_by(
        role="student",
        course=course,
        class_name=semester,
        section=section
    ).all()

    if not students:
        return jsonify({"message": "No students found"}), 404

    student_ids = [s.id for s in students]

    records = Attendance.query.filter(
        Attendance.student_id.in_(student_ids)
    ).all()

    if not records:
        return jsonify({"message": "No attendance data found"}), 404

    total_present = sum(1 for r in records if r.status == "present")
    overall_attendance = round((total_present / len(records)) * 100, 2)

    subject_map = {}
    student_subject_map = {}

    for r in records:
        if r.subject not in subject_map:
            subject_map[r.subject] = {"present": 0, "total": 0}

        subject_map[r.subject]["total"] += 1
        if r.status == "present":
            subject_map[r.subject]["present"] += 1

        key = (r.student_id, r.subject)

        if key not in student_subject_map:
            student_subject_map[key] = {"present": 0, "total": 0}

        student_subject_map[key]["total"] += 1
        if r.status == "present":
            student_subject_map[key]["present"] += 1

    subject_percentages = {
        sub: round((v["present"] / v["total"]) * 100, 2)
        for sub, v in subject_map.items()
    }

    best_subject = max(subject_percentages, key=subject_percentages.get)
    worst_subject = min(subject_percentages, key=subject_percentages.get)

    toppers = {}
    defaulters = []

    for (student_id, subject), stats in student_subject_map.items():
        percentage = round((stats["present"] / stats["total"]) * 100, 2)

        student = User.query.get(student_id)

        if (
            subject not in toppers or
            percentage > toppers[subject]["attendance"]
        ):
            toppers[subject] = {
                "student_name": student.name,
                "student_id": student.student_id,
                "attendance": percentage
            }

        if percentage < 40:
            defaulters.append({
                "student_name": student.name,
                "student_id": student.student_id,
                "subject": subject,
                "attendance": percentage
            })

    return jsonify({
        "overall_attendance": overall_attendance,
        "high_risk_count": len(defaulters),
        "best_subject": {
            "name": best_subject,
            "attendance": subject_percentages[best_subject]
        },
        "worst_subject": {
            "name": worst_subject,
            "attendance": subject_percentages[worst_subject]
        },
        "toppers": toppers,
        "defaulters": defaulters
    })