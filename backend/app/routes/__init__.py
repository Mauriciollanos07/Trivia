from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
questions_bp = Blueprint('questions', __name__, url_prefix='/api/questions')
scores_bp = Blueprint('scores', __name__, url_prefix='/api/scores')

# Import routes to register them with blueprints
from app.routes import auth, questions, scores
