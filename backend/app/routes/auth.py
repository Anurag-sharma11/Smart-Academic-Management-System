from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token
from datetime import timedelta, datetime

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ---------------- REGISTER ----------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")
    date_added = data.get("date_added")

    if not all([name, email, password, role]):
        return jsonify({"error": "Name, email, password, and role are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User(
        name=name,
        email=email,
        role=role,

        age=data.get("age"),
        gender=data.get("gender"),
        phone=data.get("phone"),

        student_id=data.get("student_id"),
        enrollment_no=data.get("enrollment_no"),

        course=data.get("course"),
        class_name=data.get("class_name"),
        section=data.get("section"),

        employee_id=data.get("employee_id"),
        department=data.get("department"),

        date_added=datetime.strptime(date_added, "%Y-%m-%d").date() if date_added else None
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user_id": user.id
    }), 201


# ---------------- LOGIN ----------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role,
            "can_access_teacher": user.can_access_teacher,
            "can_access_student": user.can_access_student
        }
    )

    return jsonify({
        "access_token": access_token,
        "role": user.role
    }), 200