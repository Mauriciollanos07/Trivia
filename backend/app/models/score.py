from app import db
from datetime import datetime

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('scores', lazy=True))
    # Store provided player name for guest submissions
    player_name = db.Column(db.String(120))
    normal_score = db.Column(db.Integer, nullable=False, default=0)
    trivialer_score = db.Column(db.Integer, nullable=False, default=0)
    # Keep legacy score field for backward compatibility
    score = db.Column(db.Integer, nullable=False, default=0)
    category = db.Column(db.String(100))
    difficulty = db.Column(db.Integer)
    questions_answered = db.Column(db.Integer)
    questions_correct = db.Column(db.Integer)
    date = db.Column(db.DateTime, default=datetime.utcnow)
