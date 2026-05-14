from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from datetime import timedelta, datetime
from flask_mail import Message
from app.extensions import mail

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

def send_student_credentials(student_email, student_name, password):
    msg = Message(
        subject="Welcome to ALASK - Student Account Created",
        recipients=[student_email]
    )

    msg.body = f"""
Hello {student_name},

Your ALASK student account has been created successfully.

Login Credentials:

Email: {student_email}
Password: {password}

Please login using these credentials.

ALASK Academic Management System
"""

    mail.send(msg)


# ---------------- REGISTER ----------------
@auth_bp.route("/register", methods=["POST"])
@jwt_required()
def register():
    data = request.get_json()
    claims = get_jwt()

    if claims.get("role") not in ["teacher", "admin"]:
        return jsonify({"error": "Access denied"}), 403
    
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

        date_added=datetime.strptime(date_added, "%Y-%m-%dT%H:%M") if date_added else None
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()
    
    if role == "student":
        send_student_credentials(
            student_email=user.email,
            student_name=user.name,
            password=password
        )

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
        "role": user.role,
        "name": user.name,
        "email": user.email
    }), 200
