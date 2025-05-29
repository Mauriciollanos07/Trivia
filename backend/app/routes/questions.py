from flask import request, jsonify
from app.routes import questions_bp
from app.models.question import Question
import random

# Import schema here instead of globally
from app.schemas.question import QuestionSchema
question_schema = QuestionSchema()
questions_schema = QuestionSchema(many=True)

@questions_bp.route('', methods=['GET'])
def get_questions():
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    amount = int(request.args.get('amount', 10))
    
    query = Question.query
    
    if category:
        query = query.filter_by(category=category)
    
    if difficulty:
        query = query.filter_by(difficulty=int(difficulty))
    
    questions = query.all()
    
    if len(questions) > amount:
        questions = random.sample(questions, amount)
    
    return jsonify({
        'questions': questions_schema.dump(questions)
    }), 200