from flask import Flask, jsonify, redirect, url_for, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from app.config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
login_manager = LoginManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:8081", "http://localhost:19006", "http://127.0.0.1:8081", "exp://localhost:8081"], 
                                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                                "allow_headers": ["Content-Type", "Authorization"]}})
    jwt.init_app(app)
    
    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'web.login'
    
    @login_manager.user_loader
    def load_user(user_id):
        from app.models.user import User
        return User.query.get(int(user_id))
    
    # Import models to ensure they are registered with SQLAlchemy
    with app.app_context():
        from app.models import user, score, question
    
    # Initialize Marshmallow
    from app.schemas import init_ma
    init_ma(app)
    
    from app.routes import auth_bp, questions_bp, scores_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(questions_bp)
    app.register_blueprint(scores_bp)
    
    # Import and register web blueprint
    from app.routes.web_routes import web_bp
    app.register_blueprint(web_bp)
    
    # API information route
    @app.route('/api')
    def api_info():
        return jsonify({
            "message": "Welcome to the Trivia API",
            "endpoints": {
                "auth": "/api/auth",
                "questions": "/api/questions",
                "scores": "/api/scores"
            }
        })
        
    # Serve the web interface directly from root
    @app.route('/')
    def index():
        return render_template('index.html')
    
    return app