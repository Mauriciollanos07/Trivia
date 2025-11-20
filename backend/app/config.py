import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database
    database_url = os.environ.get('DATABASE_URL')
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    # Ensure instance directory exists for SQLite
    instance_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../instance'))
    os.makedirs(instance_dir, exist_ok=True)
    
    # Use Render tmp dir when on Render, otherwise use provided DATABASE_URL or local SQLite
    if os.environ.get('RENDER') == 'true':
        SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/trivia.db'
    else:
        SQLALCHEMY_DATABASE_URI = database_url or f"sqlite:///{os.path.join(instance_dir, 'trivia.db')}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security - Remove fallback values for production
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Session
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = timedelta(hours=2)
