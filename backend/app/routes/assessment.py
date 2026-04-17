from flask import Blueprint, request, jsonify
from app.extensions import db
from datetime import datetime, timedelta
from app.models.assessment_model import Assessment, Question, Attempt
import json

bp = Blueprint('assessment', __name__, url_prefix='/api/assessment')


@bp.route("/create", methods=["POST", "OPTIONS"])
def create_assessment():
    if request.method == "OPTIONS":
        return "", 200

    data = request.json

    new_assessment = Assessment(
        title=data.get("title"),
        subject=data.get("subject"),
        teacher_id=data.get("teacher_id")
    )

    db.session.add(new_assessment)
    db.session.commit()

    return {
        "message": "Assessment created",
        "assessment_id": new_assessment.id
    }

# create API


@bp.route("/add-question", methods=["POST", "OPTIONS"])
def add_question():
    if request.method == "OPTIONS":
        return "", 200

    data = request.json

    question = Question(
        assessment_id=data.get("assessment_id"),
        question_text=data.get("question_text"),
        type=data.get("type"),
        options=json.dumps(data.get("options")) if data.get(
            "options") else None,
        correct_answer=data.get("correct_answer")
    )

    db.session.add(question)
    db.session.commit()

    return {"message": "Question added"}


@bp.route('/all', methods=['GET'])
def get_all_assessments():
    try:
        assessments = Assessment.query.all()

        result = []
        for a in assessments:
            result.append({
                "id": a.id,
                "title": a.title,
                "subject": a.subject,
                "assigned_at": a.assigned_at
            })

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/questions/<int:assessment_id>', methods=['GET'])
def get_questions(assessment_id):
    try:
        questions = Question.query.filter_by(assessment_id=assessment_id).all()

        result = []
        for q in questions:
            result.append({
                "id": q.id,
                "question_text": q.question_text,
                "type": q.type,
                "options": json.loads(q.options) if q.options else []
            })

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/start/<int:assessment_id>', methods=['POST'])
def start_test(assessment_id):
    try:
        data = request.json
        student_id = data.get('student_id')

        assessment = Assessment.query.get(assessment_id)

        if not assessment:
            return jsonify({"error": "Assessment not found"}), 404

        # 🔥 1️⃣ Check start window (1 hour)
        if datetime.utcnow() > assessment.assigned_at + timedelta(hours=1):
            return jsonify({"error": "Start time expired"}), 400

        # 🔥 2️⃣ Prevent multiple attempts
        existing = Attempt.query.filter_by(
            student_id=student_id,
            assessment_id=assessment_id
        ).first()

        if existing:
            return jsonify({"error": "Already attempted"}), 400

        # 🔥 3️⃣ Create attempt
        attempt = Attempt(
            student_id=student_id,
            assessment_id=assessment_id,
            started_at=datetime.utcnow()
        )

        db.session.add(attempt)
        db.session.commit()

        return jsonify({"message": "Test started"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/submit', methods=['POST'])
def submit_test():
    try:
        data = request.json

        student_id = data.get('student_id')
        assessment_id = data.get('assessment_id')
        score = data.get('score', 0)

        attempt = Attempt.query.filter_by(
            student_id=student_id,
            assessment_id=assessment_id
        ).first()

        if not attempt:
            return jsonify({"error": "Attempt not found"}), 404

        attempt.answers = json.dumps(data.get("answers") or {})

        # 🔥 Check 1-hour completion limit
        if datetime.utcnow() > attempt.started_at + timedelta(hours=1):
            return jsonify({"error": "Time over"}), 400

        attempt.submitted_at = datetime.utcnow()
        attempt.score = score

        db.session.commit()

        return jsonify({"message": "Test submitted successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/attempts', methods=['GET'])
def get_attempts():
    attempts = Attempt.query.all()

    result = []

    for a in attempts:
        # 🔥 Get assessment details
        assessment = Assessment.query.get(a.assessment_id)

        # 🔥 Parse answers
        answers = json.loads(a.answers) if a.answers else {}

        enriched_answers = []

        for qid, ans in answers.items():
            question = Question.query.get(int(qid))

            enriched_answers.append({
                "question": question.question_text if question else "Deleted Question",
                "answer": ans
            })

        result.append({
            "id": a.id,
            "student_id": a.student_id,
            "assessment_id": a.assessment_id,

            # ✅ NEW FIELDS
            "title": assessment.title if assessment else "N/A",
            "subject": assessment.subject if assessment else "N/A",

            "score": a.score,
            "answers": enriched_answers
        })

    return jsonify(result)


@bp.route('/mark/<int:id>', methods=['PATCH'])
def give_marks(id):
    data = request.json

    attempt = Attempt.query.get(id)
    if not attempt:
        return jsonify({"error": "Attempt not found"}), 404
    attempt.score = data.get("score")

    db.session.commit()

    return jsonify({"message": "Marks updated"})
