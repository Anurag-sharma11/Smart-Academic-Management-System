from flask import Blueprint, request, jsonify, send_from_directory, make_response
from app.extensions import db
from app.models.assignment import Assignment, Submission
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from datetime import datetime
import os
import mimetypes

from werkzeug.utils import secure_filename

assignment_bp = Blueprint("assignment", __name__, url_prefix="/api/assignment")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

# 👨‍🏫 CREATE ASSIGNMENT (WITH FILE UPLOAD)


@assignment_bp.route("/create", methods=["POST"])
@jwt_required()
def create_assignment():
    claims = get_jwt()

    if claims.get("role") != "teacher":
        return jsonify({"message": "Only teacher allowed"}), 403

    title = request.form.get("title")
    description = request.form.get("description")
    deadline = request.form.get("deadline")

    file = request.files.get("file")

    file_url = None

    if file:
        filename = secure_filename(file.filename)

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        filepath = os.path.join(UPLOAD_FOLDER, filename)
        print("Saving file to:", UPLOAD_FOLDER)
        file.save(filepath)

        # 🔥 IMPORTANT FIX
        file_url = f"/api/assignment/uploads/{filename}"

    assignment = Assignment(
        title=title,
        description=description,
        deadline=datetime.fromisoformat(deadline),
        file_url=file_url
    )

    db.session.add(assignment)
    db.session.commit()

    return jsonify({
        "message": "Assignment created",
        "file_url": file_url
    }), 201


# 👨‍🎓 GET ALL ASSIGNMENTS
@assignment_bp.route("/all", methods=["GET"])
@jwt_required()
def get_assignments():
    claims = get_jwt()
    user_id = int(get_jwt_identity())

    assignments = Assignment.query.all()

    result = []

    for a in assignments:
        submission = Submission.query.filter_by(
            student_id=user_id,
            assignment_id=a.id
        ).first()

        result.append({
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "deadline": a.deadline,
            "file_url": a.file_url,
            "submitted": True if submission else False,
            "marks": submission.marks if submission else None
        })

    return jsonify(result), 200


# 👨‍🎓 SUBMIT ASSIGNMENT
@assignment_bp.route("/submit/<int:assignment_id>", methods=["POST"])
@jwt_required()
def submit_assignment(assignment_id):
    import uuid

    claims = get_jwt()

    if claims.get("role") != "student":
        return {"message": "Only students allowed"}, 403

    assignment = Assignment.query.get(assignment_id)

    if not assignment:
        return {"message": "Assignment not found"}, 404

    if datetime.utcnow() > assignment.deadline:
        return {"message": "Deadline passed"}, 400

    student_id = int(get_jwt_identity())

    content = request.form.get("content")
    file = request.files.get("file")

    file_url = None   # 🔥 IMPORTANT reset every time

    if file:
        unique_name = str(uuid.uuid4()) + "_" + secure_filename(file.filename)

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        filepath = os.path.join(UPLOAD_FOLDER, unique_name)
        file.save(filepath)

        file_url = f"/api/assignment/uploads/{unique_name}"

    # 🔥 IMPORTANT: create NEW submission (not reuse)
    submission = Submission(
        student_id=student_id,
        assignment_id=assignment_id,
        content=content,
        file_url=file_url
    )

    db.session.add(submission)
    db.session.commit()

    return {"message": "Submitted successfully"}, 200


# 👨‍🏫 VIEW SUBMISSIONS
@assignment_bp.route("/submissions/<int:assignment_id>", methods=["GET"])
@jwt_required()
def view_submissions(assignment_id):
    claims = get_jwt()

    if claims.get("role") != "teacher":
        return jsonify({"message": "Only teacher allowed"}), 403

    submissions = Submission.query.filter_by(
        assignment_id=assignment_id
    ).all()

    result = []

    for s in submissions:
        result.append({
            "id": s.id,
            "student_id": s.student_id,
            "content": s.content,
            "file_url": s.file_url,   # 🔥 ADD THIS
            "submitted_at": s.submitted_at,
            "marks": s.marks
        })

    return jsonify(result), 200


# 👨‍🏫 GIVE MARKS
@assignment_bp.route("/grade/<int:submission_id>", methods=["PATCH"])
@jwt_required()
def grade_submission(submission_id):
    claims = get_jwt()

    if claims.get("role") != "teacher":
        return jsonify({"message": "Only teacher allowed"}), 403

    submission = Submission.query.get(submission_id)

    if not submission:
        return jsonify({"message": "Submission not found"}), 404

    data = request.get_json()

    submission.marks = data.get("marks")

    db.session.commit()

    return jsonify({"message": "Marks added successfully"}), 200


# 🔥🔥 NEW: SERVE FILES (THIS FIXES 404)
@assignment_bp.route("/uploads/<filename>", methods=["GET"])
def get_uploaded_file(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(file_path):
        return jsonify({"message": "File not found"}), 404

    mime_type, _ = mimetypes.guess_type(file_path)

    response = make_response(
        send_from_directory(
            UPLOAD_FOLDER,
            filename,
            mimetype=mime_type,
            as_attachment=False
        )
    )

    response.headers["Content-Disposition"] = f'inline; filename="{filename}"'

    return response
