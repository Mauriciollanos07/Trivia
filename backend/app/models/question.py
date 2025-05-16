from app import db

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.Integer, nullable=False)
    correct_answer = db.Column(db.String(200), nullable=False)
    incorrect_answers = db.Column(db.String(600), nullable=False)  # Stored as JSON string
