from app.extensions import db
from datetime import datetime


class Subject(db.Model):
    __tablename__ = "subjects"

    id = db.Column(db.Integer, primary_key=True)

    subject_name = db.Column(
        db.String(150),
        nullable=False
    )

    subject_code = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    credits = db.Column(
        db.Integer,
        nullable=False
    )

    subject_type = db.Column(
        db.String(20),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )