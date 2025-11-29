#!/usr/bin/env python3
"""
Migration script to add normal_score and trivialer_score fields to existing Score table
Run this after updating the model but before running flask db migrate
"""

from app import create_app, db
from sqlalchemy import text

def add_score_fields():
    app = create_app()
    
    with app.app_context():
        try:
            # Add the new columns
            with db.engine.connect() as conn:
                conn.execute(text('ALTER TABLE score ADD COLUMN normal_score INTEGER DEFAULT 0'))
                conn.execute(text('ALTER TABLE score ADD COLUMN trivialer_score INTEGER DEFAULT 0'))
                
                # Update existing records to use the current score as normal_score
                conn.execute(text('UPDATE score SET normal_score = score WHERE normal_score = 0'))
                conn.execute(text('UPDATE score SET trivialer_score = score WHERE trivialer_score = 0'))
                conn.commit()
            
            print("Successfully added normal_score and trivialer_score fields")
            
        except Exception as e:
            print(f"Error adding fields (they might already exist): {e}")

if __name__ == '__main__':
    add_score_fields()