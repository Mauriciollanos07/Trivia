#!/usr/bin/env python
"""
Initialize the Render PostgreSQL database with sample data.
Run this script after deploying to Render to populate the database.
"""
from app import create_app, db
from app.models.user import User
from app.models.question import Question
from werkzeug.security import generate_password_hash
import json

def init_db():
    app = create_app()
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        # Check if we already have data
        if User.query.count() > 0:
            print("Database already contains data. Skipping initialization.")
            return
            
        # Create admin user
        admin = User(
            username="admin",
            email="admin@example.com",
            password_hash=generate_password_hash("adminpassword")
        )
        db.session.add(admin)
        
        # Add sample questions
        try:
            # Try to load questions from a file
            with open('sample_questions.json', 'r') as f:
                questions_data = json.load(f)
                
            for q_data in questions_data:
                question = Question(
                    text=q_data['text'],
                    category=q_data['category'],
                    difficulty=q_data['difficulty'],
                    correct_answer=q_data['correct_answer'],
                    incorrect_answers=q_data['incorrect_answers']
                )
                db.session.add(question)
                
        except FileNotFoundError:
            # Add a few basic questions if file not found
            questions = [
                Question(
                    text="What is the capital of France?",
                    category="Geography",
                    difficulty=1,
                    correct_answer="Paris",
                    incorrect_answers=["London", "Berlin", "Madrid"]
                ),
                Question(
                    text="Who wrote 'Romeo and Juliet'?",
                    category="Literature",
                    difficulty=1,
                    correct_answer="William Shakespeare",
                    incorrect_answers=["Charles Dickens", "Jane Austen", "Mark Twain"]
                ),
                Question(
                    text="What is the chemical symbol for gold?",
                    category="Science",
                    difficulty=1,
                    correct_answer="Au",
                    incorrect_answers=["Ag", "Fe", "Cu"]
                )
            ]
            
            for question in questions:
                db.session.add(question)
        
        # Commit changes
        db.session.commit()
        print("Database initialized with sample data.")

if __name__ == "__main__":
    init_db()