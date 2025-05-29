from app import db
from datetime import datetime

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('scores', lazy=True))
    score = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(100))
    difficulty = db.Column(db.Integer)
    questions_answered = db.Column(db.Integer)
    questions_correct = db.Column(db.Integer)
    date = db.Column(db.DateTime, default=datetime.utcnow)
