from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)  # Allow null for nickname-only users
    password_hash = db.Column(db.String(128), nullable=True)  # Allow null for nickname-only users
    
    def set_password(self, password):
        if password:  # Only set if password provided
            self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        if not self.password_hash:  # Nickname-only users have no password
            return False
        return check_password_hash(self.password_hash, password)