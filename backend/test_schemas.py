from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import json

# Create a test Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Define models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(128))

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.Integer, nullable=False)
    correct_answer = db.Column(db.String(200), nullable=False)
    incorrect_answers = db.Column(db.String(600), nullable=False)

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    score = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(100))
    difficulty = db.Column(db.Integer)
    questions_answered = db.Column(db.Integer)
    questions_correct = db.Column(db.Integer)
    user = db.relationship('User', backref='scores')

# Define schemas
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
    
    password = ma.String(load_only=True)

class QuestionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Question
    
    incorrect_answers_list = ma.Method("get_incorrect_answers")
    
    def get_incorrect_answers(self, obj):
        return obj.incorrect_answers.split('|')

class ScoreSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Score
        include_fk = True

# Create tables
with app.app_context():
    db.create_all()
    
    # Add test data
    user = User(username='testuser', email='test@example.com')
    db.session.add(user)
    
    question = Question(
        text='What is the capital of France?',
        category='Geography',
        difficulty=1,
        correct_answer='Paris',
        incorrect_answers='London|Berlin|Madrid'
    )
    db.session.add(question)
    
    score = Score(
        user_id=1,
        score=100,
        category='Geography',
        difficulty=1,
        questions_answered=10,
        questions_correct=8
    )
    db.session.add(score)
    
    db.session.commit()
    
    # Test serialization
    user_schema = UserSchema()
    question_schema = QuestionSchema()
    score_schema = ScoreSchema()
    
    # Serialize and print results
    print("\n--- User Schema Test ---")
    user_result = user_schema.dump(User.query.first())
    print(json.dumps(user_result, indent=2))
    
    print("\n--- Question Schema Test ---")
    question_result = question_schema.dump(Question.query.first())
    print(json.dumps(question_result, indent=2))
    
    print("\n--- Score Schema Test ---")
    score_result = score_schema.dump(Score.query.first())
    print(json.dumps(score_result, indent=2))
    
    print("\nSchema tests completed successfully!")

if __name__ == '__main__':
    print("Run this script directly to test schemas:")
    print("python test_schemas.py")