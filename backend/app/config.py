import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database
    database_url = os.environ.get('DATABASE_URL')
    #if database_url and database_url.startswith('postgres://'):
    #    database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    # For Render deployment - use /tmp directory which is writable
    if os.environ.get('RENDER') == 'true':
        SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/trivia.db'
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///instance/trivia.db'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security - Remove fallback values for production
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Session
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = timedelta(hours=2)
