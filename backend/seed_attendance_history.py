from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.attendance import Attendance

from datetime import datetime, timedelta, time
import random

app = create_app()

SUBJECTS = [
    ("DBMS", 1, "08:30", "09:30"),
    ("OS", 2, "09:30", "10:30"),
    ("DS", 3, "10:30", "11:30"),
    ("CN", 4, "11:30", "12:30"),
    ("Maths", 5, "12:30", "01:30"),
    ("DS Lab", 6, "01:30", "03:30"),
    ("OS Lab", 7, "03:30", "05:30")
]


def str_to_time(t):
    return datetime.strptime(t, "%H:%M").time()


with app.app_context():

    students = User.query.filter_by(role="student").all()

    for student in students:

        # Each student gets unique attendance tendency
        base_probability = random.uniform(0.55, 0.95)

        for day_offset in range(1, 15):
            date = (datetime.utcnow() - timedelta(days=day_offset)).date()

            weekday = date.weekday()

            # Skip Sundays
            if weekday == 6:
                continue

            periods_today = 7 if weekday in [0, 3, 4] else 5

            for i in range(periods_today):
                subject, period, start, end = SUBJECTS[i]

                # Subject-wise slight variation
                subject_modifier = random.uniform(-0.10, 0.10)

                final_probability = max(
                    0.30,
                    min(0.98, base_probability + subject_modifier)
                )

                status = (
                    "present"
                    if random.random() < final_probability
                    else "absent"
                )

                attendance = Attendance(
                    student_id=student.id,
                    date=date,
                    period_number=period,
                    subject=subject,
                    start_time=str_to_time(start),
                    end_time=str_to_time(end),
                    status=status
                )

                db.session.add(attendance)

    db.session.commit()

    print("✅ Historical attendance generated successfully!")