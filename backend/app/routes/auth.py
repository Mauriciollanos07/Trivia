from flask import request, jsonify
from app import db
from app.routes import auth_bp
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import ValidationError

# Import schema here instead of globally
from app.schemas.user import UserSchema
user_schema = UserSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    try:
        # Validate and deserialize input
        user = user_schema.load(data)
        
        # Check for existing username/email
        if User.query.filter_by(username=user.username).first():
            return jsonify({'message': 'Username already exists'}), 400
            
        if User.query.filter_by(email=user.email).first():
            return jsonify({'message': 'Email already exists'}), 400
        
        # Set password (not handled by schema)
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
    
    except ValidationError as err:
        return jsonify(err.messages), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid username or password'}), 401
    
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'access_token': access_token,
        'user': user_schema.dump(user)
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify(user_schema.dump(user)), 200

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    
    # Validate current password
    if not user.check_password(data.get('current_password', '')):
        return jsonify({'message': 'Current password is incorrect'}), 400
    
    # Validate new password
    try:
        # Use schema to validate password
        user_schema.validate_password(data.get('new_password', ''))
    except ValidationError as err:
        return jsonify({'message': err.messages}), 400
    
    # Set new password
    user.set_password(data['new_password'])
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}), 200
