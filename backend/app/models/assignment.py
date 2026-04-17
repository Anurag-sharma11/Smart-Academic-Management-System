from app.extensions import db
from datetime import datetime


class Assignment(db.Model):
    __tablename__ = "assignments"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500))

    deadline = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 🔥 Teacher uploaded file
    file_url = db.Column(db.String(255), nullable=True)


class Submission(db.Model):
    __tablename__ = "submissions"

    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(db.Integer, nullable=False)
    assignment_id = db.Column(db.Integer, nullable=False)

    content = db.Column(db.String(500))

    # 🔥 NEW (student uploaded file)
    file_url = db.Column(db.String(255), nullable=True)

    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 🔥 Marks given by teacher
    marks = db.Column(db.Integer, nullable=True)
    
