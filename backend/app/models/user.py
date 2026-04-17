from app.extensions import db
from datetime import datetime
import bcrypt

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # student / teacher / admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    can_access_teacher = db.Column(db.Boolean, default=False)
    can_access_student = db.Column(db.Boolean, default=False)

    def set_password(self, plain_password):
        self.password = bcrypt.hashpw(
            plain_password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')

    def check_password(self, plain_password):
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            self.password.encode('utf-8')
        )