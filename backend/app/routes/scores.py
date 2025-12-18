from flask import request, jsonify
from app import db
from app.routes import scores_bp
from app.models.score import Score
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from marshmallow import ValidationError

# Import schema here instead of globally
from app.schemas.score import ScoreSchema
score_schema = ScoreSchema()
scores_schema = ScoreSchema(many=True)

@scores_bp.route('', methods=['POST'])
@jwt_required()
def add_score():
    """
    Submit a new score (requires authentication)
    
    Flow:
    1. Mobile app sends score data with JWT token in Authorization header
    2. Extract user ID from JWT token
    3. Link score to authenticated user
    4. Save score to database
    5. Return success response
    
    This ensures:
    - Only authenticated users can submit scores
    - Scores are linked to the correct user
    - No one can submit fake scores for other users
    """
    # Get authenticated user ID from JWT token
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json() or {}
    
    try:
        # Extract scores
        normal_score = data.get('normal_score', 0)
        trivialer_score = data.get('trivialer_score', 0)
        
        # Set legacy score field to normal_score for backward compatibility
        data['score'] = normal_score
        data['normal_score'] = normal_score
        data['trivialer_score'] = trivialer_score
        
        # Validate and deserialize input
        score = score_schema.load(data)
        
        # Link score to authenticated user (not just nickname)
        score.user_id = user.id
        score.player_name = user.username  # Use authenticated user's nickname
        
        db.session.add(score)
        db.session.commit()
        
        result = score_schema.dump(score)
        if isinstance(result, dict):
            result['username'] = score.player_name
        
        return jsonify({
            'message': 'Score added successfully',
            'score': result
        }), 201
        
    except ValidationError as err:
        return jsonify(err.messages), 400

@scores_bp.route('/legacy', methods=['POST'])
def add_score_legacy():
    """
    Legacy score submission (no authentication required)
    Keep this for backward compatibility during migration
    """
    data = request.get_json() or {}
    player_name = data.pop('player_name', None) or data.pop('username', None) or 'Guest'
    
    try:
        # Extract scores
        normal_score = data.get('normal_score', 0)
        trivialer_score = data.get('trivialer_score', 0)
        
        # Set legacy score field to normal_score for backward compatibility
        data['score'] = normal_score
        data['normal_score'] = normal_score
        data['trivialer_score'] = trivialer_score
        
        # Validate and deserialize input
        score = score_schema.load(data)
        score.user_id = None
        score.player_name = player_name
        
        db.session.add(score)
        db.session.commit()
        
        result = score_schema.dump(score)
        if isinstance(result, dict):
            result['username'] = score.player_name
        
        return jsonify({
            'message': 'Score added successfully (legacy)',
            'score': result
        }), 201
        
    except ValidationError as err:
        return jsonify(err.messages), 400

@scores_bp.route('', methods=['GET'])
def get_user_scores():
    """
    Get scores - supports both authenticated and public access
    
    Authenticated users (with JWT token):
    - Get their own scores automatically
    
    Public access (no token):
    - Can specify nickname parameter to get specific user's scores
    - Or get general leaderboard if no nickname specified
    """
    # Check if user is authenticated
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        
        if user_id:
            # Authenticated user - get their scores
            user = User.query.get(user_id)
            if user:
                scores = Score.query.filter_by(user_id=user.id).order_by(Score.date.desc()).all()
                print(f"Fetching authenticated user's scores: {user.username}")
            else:
                scores = []
        else:
            # Public access - use nickname parameter or get leaderboard
            nickname = request.args.get('nickname')
            print(f"Fetching scores for nickname: {nickname}")
            
            if nickname:
                # Get scores for specific nickname
                scores = Score.query.filter_by(player_name=nickname).order_by(Score.date.desc()).all()
            else:
                # Get all scores (for general leaderboard)
                scores = Score.query.order_by(Score.date.desc()).limit(50).all()
                
    except Exception:
        # Fallback to public access
        nickname = request.args.get('nickname')
        print(f"Fetching scores for nickname (fallback): {nickname}")
        
        if nickname:
            scores = Score.query.filter_by(player_name=nickname).order_by(Score.date.desc()).all()
        else:
            scores = Score.query.order_by(Score.date.desc()).limit(50).all()
    
    # Add username to each score (player_name or linked user)
    result = scores_schema.dump(scores)
    for score_data, score_obj in zip(result, scores):
        score_data['username'] = score_obj.player_name or (score_obj.user.username if score_obj.user else None)

    print(f"Returning {len(result)} scores")

    return jsonify({
        'scores': result
    }), 200

@scores_bp.route('/stats', methods=['GET'])
def get_user_stats():
    """
    Get user statistics - supports both authenticated and public access
    
    Authenticated users (with JWT token):
    - Get their own stats automatically
    
    Public access (no token):
    - Can specify nickname parameter to get specific user's stats
    - Or get global stats if no nickname specified
    """
    # Check if user is authenticated
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        
        if user_id:
            # Authenticated user - get their stats
            user = User.query.get(user_id)
            if user:
                scores = Score.query.filter_by(user_id=user.id).all()
                print(f"Fetching authenticated user's stats: {user.username}")
            else:
                scores = []
        else:
            # Public access - use nickname parameter or get global stats
            nickname = request.args.get('nickname')
            print(f"Fetching stats for nickname: {nickname}")
            
            if nickname:
                # Get stats for specific nickname
                scores = Score.query.filter_by(player_name=nickname).all()
            else:
                # Get global stats
                scores = Score.query.all()
                
    except Exception:
        # Fallback to public access
        nickname = request.args.get('nickname')
        print(f"Fetching stats for nickname (fallback): {nickname}")
        
        if nickname:
            scores = Score.query.filter_by(player_name=nickname).all()
        else:
            scores = Score.query.all()
    
    if not scores:
        print("No scores found, returning zeroed stats")
        return jsonify({
            'total_games': 0,
            'average_normal_score': 0,
            'average_trivialer_score': 0,
            'highest_normal_score': 0,
            'highest_trivialer_score': 0,
            'average_score': 0,
            'highest_score': 0,
            'total_questions': 0,
            'correct_answers': 0,
            'accuracy': 0
        }), 200
    
    total_games = len(scores)
    
    # Calculate stats for both score types
    normal_scores = [s.normal_score or s.score or 0 for s in scores]
    trivialer_scores = [s.trivialer_score or s.score or 0 for s in scores]
    
    average_normal_score = sum(normal_scores) / total_games
    average_trivialer_score = sum(trivialer_scores) / total_games
    highest_normal_score = max(normal_scores)
    highest_trivialer_score = max(trivialer_scores)
    
    # Legacy fields for backward compatibility
    average_score = average_normal_score
    highest_score = highest_normal_score
    
    total_questions = sum(s.questions_answered or 0 for s in scores)
    correct_answers = sum(s.questions_correct or 0 for s in scores)
    accuracy = (correct_answers / total_questions * 100) if total_questions > 0 else 0

    print(f"Returning stats: total_games={total_games}, average_normal_score={average_normal_score}, average_trivialer_score={average_trivialer_score}, highest_normal_score={highest_normal_score}, highest_trivialer_score={highest_trivialer_score}, average_score={average_score}, highest_score={highest_score}, total_questions={total_questions}, correct_answers={correct_answers}, accuracy={accuracy}")
    
    return jsonify({
        'total_games': total_games,
        'average_normal_score': average_normal_score,
        'average_trivialer_score': average_trivialer_score,
        'highest_normal_score': highest_normal_score,
        'highest_trivialer_score': highest_trivialer_score,
        'average_score': average_score,
        'highest_score': highest_score,
        'total_questions': total_questions,
        'correct_answers': correct_answers,
        'accuracy': accuracy
    }), 200
