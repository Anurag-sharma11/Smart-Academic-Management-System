from flask import Flask
from .extensions import db, jwt, migrate, mail
from .config import Config
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ PROPER CORS FIX (IMPORTANT)
    CORS(
        app,
        supports_credentials=True,
        resources={r"/*": {"origins": "http://localhost:5173"}}
    )

    # ✅ GLOBAL HEADERS FIX (VERY IMPORTANT)
    @app.after_request
    def after_request(response):
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        return response

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    
    # ✅ Import models
    from app.models.user import User
    from app.models.attendance import Attendance
    from app.models.assignment import Assignment, Submission

    # ✅ Register blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp)

    from app.routes.admin import admin_bp
    app.register_blueprint(admin_bp)

    from app.routes.attendance import attendance_bp
    app.register_blueprint(attendance_bp)

    from app.routes.assignment import assignment_bp
    app.register_blueprint(assignment_bp)

    from app.routes.student import student_bp
    app.register_blueprint(student_bp)

    from app.models.assessment_model import Assessment, Question, Attempt    
    
    from app.routes.assessment import bp as assessment_bp
    app.register_blueprint(assessment_bp)
    return app