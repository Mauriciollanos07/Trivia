from flask import request, jsonify
from app import db
from app.routes import scores_bp
from app.models.score import Score
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

# Import schema here instead of globally
from app.schemas.score import ScoreSchema
score_schema = ScoreSchema()
scores_schema = ScoreSchema(many=True)

@scores_bp.route('', methods=['POST'])
@jwt_required()
def add_score():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Add user_id to the data
        data['user_id'] = user_id
        
        # Validate and deserialize input
        score = score_schema.load(data)
        
        db.session.add(score)
        db.session.commit()
        
        return jsonify({
            'message': 'Score added successfully',
            'score': score_schema.dump(score)
        }), 201
        
    except ValidationError as err:
        return jsonify(err.messages), 400

@scores_bp.route('', methods=['GET'])
@jwt_required()
def get_user_scores():
    user_id = get_jwt_identity()
    
    scores = Score.query.filter_by(user_id=user_id).order_by(Score.date.desc()).all()
    
    # Add username to each score
    result = scores_schema.dump(scores)
    for score_data, score_obj in zip(result, scores):
        score_data['username'] = score_obj.user.username if score_obj.user else None
    
    return jsonify({
        'scores': result
    }), 200

@scores_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    user_id = get_jwt_identity()
    
    scores = Score.query.filter_by(user_id=user_id).all()
    
    if not scores:
        return jsonify({
            'total_games': 0,
            'average_score': 0,
            'highest_score': 0,
            'total_questions': 0,
            'correct_answers': 0,
            'accuracy': 0
        }), 200
    
    total_games = len(scores)
    average_score = sum(s.score for s in scores) / total_games
    highest_score = max(s.score for s in scores)
    total_questions = sum(s.questions_answered for s in scores)
    correct_answers = sum(s.questions_correct for s in scores)
    accuracy = (correct_answers / total_questions * 100) if total_questions > 0 else 0
    
    return jsonify({
        'total_games': total_games,
        'average_score': average_score,
        'highest_score': highest_score,
        'total_questions': total_questions,
        'correct_answers': correct_answers,
        'accuracy': accuracy
    }), 200