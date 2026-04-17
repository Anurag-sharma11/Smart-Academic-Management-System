from app.extensions import db
from datetime import datetime

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)

    period_number = db.Column(db.Integer)
    subject = db.Column(db.String(100))

    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)

    status = db.Column(db.String(20))  # present / absent