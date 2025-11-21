from flask import request, jsonify
from app import db
from app.routes import scores_bp
from app.models.score import Score
from marshmallow import ValidationError

# Import schema here instead of globally
from app.schemas.score import ScoreSchema
score_schema = ScoreSchema()
scores_schema = ScoreSchema(many=True)

@scores_bp.route('', methods=['POST'])
def add_score():
    data = request.get_json() or {}
    player_name = data.pop('player_name', None) or data.pop('username', None) or 'Guest'
    
    try:
        # Validate and deserialize input (user_id is optional/ignored for guests)
        score = score_schema.load(data)
        score.user_id = None
        score.player_name = player_name
        
        db.session.add(score)
        db.session.commit()
        
        result = score_schema.dump(score)
        result['username'] = score.player_name
        
        return jsonify({
            'message': 'Score added successfully',
            'score': result
        }), 201
        
    except ValidationError as err:
        return jsonify(err.messages), 400

@scores_bp.route('', methods=['GET'])
def get_user_scores():
    scores = Score.query.order_by(Score.date.desc()).limit(50).all()
    
    # Add username to each score (player_name or linked user)
    result = scores_schema.dump(scores)
    for score_data, score_obj in zip(result, scores):
        score_data['username'] = score_obj.player_name or (score_obj.user.username if score_obj.user else None)
    
    return jsonify({
        'scores': result
    }), 200

@scores_bp.route('/stats', methods=['GET'])
def get_user_stats():
    scores = Score.query.all()
    
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
    total_questions = sum(s.questions_answered or 0 for s in scores)
    correct_answers = sum(s.questions_correct or 0 for s in scores)
    accuracy = (correct_answers / total_questions * 100) if total_questions > 0 else 0
    
    return jsonify({
        'total_games': total_games,
        'average_score': average_score,
        'highest_score': highest_score,
        'total_questions': total_questions,
        'correct_answers': correct_answers,
        'accuracy': accuracy
    }), 200
