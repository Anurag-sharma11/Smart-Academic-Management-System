from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt

from app.extensions import db
from app.models.subject import Subject

subject_bp = Blueprint(
    "subject",
    __name__,
    url_prefix="/api/subjects"
)


# -----------------------------
# GET ALL SUBJECTS
# -----------------------------
@subject_bp.route("/", methods=["GET"])
@jwt_required()
def get_subjects():

    subjects = Subject.query.all()

    return jsonify([
        {
            "id": subject.id,
            "subject_name": subject.subject_name,
            "subject_code": subject.subject_code,
            "credits": subject.credits,
            "subject_type": subject.subject_type
        }
        for subject in subjects
    ])


# -----------------------------
# GET SINGLE SUBJECT
# -----------------------------
@subject_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_subject(id):

    subject = Subject.query.get(id)

    if not subject:
        return jsonify({
            "message": "Subject not found"
        }), 404

    return jsonify({
        "id": subject.id,
        "subject_name": subject.subject_name,
        "subject_code": subject.subject_code,
        "credits": subject.credits,
        "subject_type": subject.subject_type
    })


# -----------------------------
# CREATE SUBJECT
# -----------------------------
@subject_bp.route("/", methods=["POST"])
@jwt_required()
def create_subject():

    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({
            "message": "Access denied"
        }), 403

    data = request.get_json()

    subject = Subject(
        subject_name=data["subject_name"],
        subject_code=data["subject_code"],
        credits=data["credits"],
        subject_type=data["subject_type"]
    )

    db.session.add(subject)
    db.session.commit()

    return jsonify({
        "message": "Subject created successfully"
    }), 201


# -----------------------------
# UPDATE SUBJECT
# -----------------------------
@subject_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_subject(id):

    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({
            "message": "Access denied"
        }), 403

    subject = Subject.query.get(id)

    if not subject:
        return jsonify({
            "message": "Subject not found"
        }), 404

    data = request.get_json()

    subject.subject_name = data.get(
        "subject_name",
        subject.subject_name
    )

    subject.subject_code = data.get(
        "subject_code",
        subject.subject_code
    )

    subject.credits = data.get(
        "credits",
        subject.credits
    )

    subject.subject_type = data.get(
        "subject_type",
        subject.subject_type
    )

    db.session.commit()

    return jsonify({
        "message": "Subject updated successfully"
    })


# -----------------------------
# DELETE SUBJECT
# -----------------------------
@subject_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_subject(id):

    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({
            "message": "Access denied"
        }), 403

    subject = Subject.query.get(id)

    if not subject:
        return jsonify({
            "message": "Subject not found"
        }), 404

    db.session.delete(subject)
    db.session.commit()

    return jsonify({
        "message": "Subject deleted successfully"
    })