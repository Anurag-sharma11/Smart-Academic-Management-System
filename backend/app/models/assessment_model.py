from app.extensions import db
from datetime import datetime
import json

# ✅ Assessment Table
class Assessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(100))
    teacher_id = db.Column(db.Integer)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)


# ✅ Question Table
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessment.id'))
    question_text = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50))  # mcq / tf / qa
    options = db.Column(db.Text)  # store as JSON string
    correct_answer = db.Column(db.String(200))


# ✅ Attempt Table
class Attempt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer)
    assessment_id = db.Column(db.Integer)
    started_at = db.Column(db.DateTime)
    submitted_at = db.Column(db.DateTime)
    score = db.Column(db.Float)
    answers = db.Column(db.Text)