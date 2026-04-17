from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.attendance import Attendance
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

# 🔥 UPDATED IMPORT
from app.ml.predictor import predict_attendance_and_risk

attendance_bp = Blueprint("attendance", __name__, url_prefix="/api/attendance")


# 👨‍🏫 MARK ATTENDANCE
@attendance_bp.route("/mark", methods=["POST"])
@jwt_required()
def mark_attendance():
    claims = get_jwt()

    if claims.get("role") != "teacher":
        return jsonify({"message": "Only teacher allowed"}), 403

    data = request.get_json()
    records = data.get("records")

    for record in records:
        attendance = Attendance(
            student_id=record["student_id"],
            status=record["status"]
        )
        db.session.add(attendance)

    db.session.commit()

    return jsonify({"message": "Attendance saved"}), 200


# 👨‍🎓 VIEW ATTENDANCE
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


# 🔥 GENERATE DUMMY DATA
@attendance_bp.route("/generate-data", methods=["GET", "POST"])
def generate_data():
    from random import choice
    from datetime import datetime, timedelta, time

    students = range(1, 31)
    days = 7

    subjects_5 = ["DBMS", "OS", "DS", "CN", "Maths"]
    labs = ["DS Lab", "OS Lab"]

    for day in range(days):
        date_obj = datetime.utcnow() - timedelta(days=day)
        date = date_obj.date()
        weekday = date_obj.weekday()

        for student in students:
            periods = 5

            if weekday in [0, 3, 4]:
                periods = 7

            for i in range(periods):
                if i < 5:
                    subject = subjects_5[i]
                    start = time(8 + i, 30)
                    end = time(9 + i, 30)
                else:
                    subject = labs[i - 5]
                    start = time(13 + (i - 5) * 2, 30)
                    end = time(15 + (i - 5) * 2, 30)

                record = Attendance(
                    student_id=student,
                    date=date,
                    period_number=i + 1,
                    subject=subject,
                    start_time=start,
                    end_time=end,
                    status=choice(["present", "absent"])
                )

                db.session.add(record)

    db.session.commit()

    return {"message": "Clean timetable data generated ✅"}


# 📊 ATTENDANCE PREDICTION (ML INTEGRATED)
@attendance_bp.route("/predict/<int:student_id>", methods=["GET"])
@jwt_required()
def predict_attendance(student_id):

    records = Attendance.query.filter_by(student_id=student_id).all()

    if not records:
        return jsonify({"message": "No data found"}), 404

    # Convert to binary list
    attendance_list = [
        1 if r.status == "present" else 0
        for r in records
    ]

    current_percentage = (sum(attendance_list) / len(attendance_list)) * 100

    # 🔥 CALL ML FUNCTION
    predicted, risk, accuracy, mae = predict_attendance_and_risk(attendance_list)

    if predicted is None:
        return jsonify({"message": "Not enough data"}), 400

    return jsonify({
        "current_attendance": round(current_percentage, 2),
        "predicted_next_week": round(predicted, 2),
        "risk": risk,
        "accuracy": round(accuracy * 100, 2),
        "mae": round(mae, 4)
    })
