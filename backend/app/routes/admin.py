from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.models.user import User
from flask import request
from app.extensions import db

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def get_all_users():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"message": "Access denied"}), 403

    users = User.query.all()

    user_list = []
    for user in users:
        user_list.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "can_access_teacher": user.can_access_teacher,
            "can_access_student": user.can_access_student
        })

    return jsonify(user_list), 200


@admin_bp.route("/update-permission/<int:user_id>", methods=["PATCH"])
@jwt_required()
def update_permission(user_id):

    claims = get_jwt()

    # Only admin allowed
    if claims.get("role") != "admin":
        return jsonify({"message": "Access denied"}), 403

    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()

    user.can_access_teacher = data.get(
        "can_access_teacher", user.can_access_teacher)
    user.can_access_student = data.get(
        "can_access_student", user.can_access_student)

    db.session.commit()

    return jsonify({
        "message": "Permissions updated successfully",
        "user": {
            "id": user.id,
            "can_access_teacher": user.can_access_teacher,
            "can_access_student": user.can_access_student
        }
    }), 200

@admin_bp.route("/teachers", methods=["GET"])
@jwt_required()
def get_teachers():

    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"message": "Access denied"}), 403

    teachers = User.query.filter_by(role="teacher").all()

    return jsonify([
        {
            "id": teacher.id,
            "name": teacher.name,
            "email": teacher.email,
            "employee_id": teacher.employee_id,
            "department": teacher.department,
            "phone": teacher.phone
        }
        for teacher in teachers
    ]), 200
    
@admin_bp.route("/teachers/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_teacher(id):

    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"message": "Access denied"}), 403

    teacher = User.query.filter_by(
        id=id,
        role="teacher"
    ).first()

    if not teacher:
        return jsonify({
            "message": "Teacher not found"
        }), 404

    db.session.delete(teacher)
    db.session.commit()

    return jsonify({
        "message": "Teacher deleted successfully"
    }), 200
    
@admin_bp.route("/teachers/<int:id>", methods=["GET"])
@jwt_required()
def get_teacher(id):

    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"message": "Access denied"}), 403

    teacher = User.query.filter_by(
        id=id,
        role="teacher"
    ).first()

    if not teacher:
        return jsonify({
            "message": "Teacher not found"
        }), 404

    return jsonify({
        "id": teacher.id,
        "name": teacher.name,
        "email": teacher.email,
        "employee_id": teacher.employee_id,
        "department": teacher.department,
        "phone": teacher.phone
    })
    
@admin_bp.route("/teachers/<int:id>", methods=["PUT"])
@jwt_required()
def update_teacher(id):

    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"message": "Access denied"}), 403

    teacher = User.query.filter_by(
        id=id,
        role="teacher"
    ).first()

    if not teacher:
        return jsonify({
            "message": "Teacher not found"
        }), 404

    data = request.get_json()

    teacher.name = data.get("name", teacher.name)
    teacher.email = data.get("email", teacher.email)
    teacher.employee_id = data.get(
        "employee_id",
        teacher.employee_id
    )
    teacher.department = data.get(
        "department",
        teacher.department
    )
    teacher.phone = data.get(
        "phone",
        teacher.phone
    )

    db.session.commit()

    return jsonify({
        "message": "Teacher updated successfully"
    })