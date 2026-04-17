from app import create_app
from app.routes.attendance import attendance_bp
from app.routes.student import student_bp
from flask import send_from_directory
import os

app = create_app()

# 🔥 REGISTER ALL BLUEPRINTS
app.register_blueprint(attendance_bp)
app.register_blueprint(student_bp)

# 🔥 SAFE UPLOAD PATH
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

@app.route("/uploads/<filename>")
def get_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=True)