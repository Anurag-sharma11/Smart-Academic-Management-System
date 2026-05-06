from app import create_app
from app.extensions import db
from app.models.user import User

app = create_app()

with app.app_context():
    seeded_students = User.query.filter(
        User.email.like("student%@bca.com")
    ).all()

    for student in seeded_students:
        db.session.delete(student)

    db.session.commit()

    print(f"✅ Deleted {len(seeded_students)} seeded students")