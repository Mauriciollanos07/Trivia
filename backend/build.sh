#!/bin/bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Run database migrations
flask db upgrade

# Optional: Add sample questions if needed
# python add_sample_questions.py