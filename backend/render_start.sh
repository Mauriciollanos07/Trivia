#!/bin/bash
# Exit on error
set -o errexit

# Start the application
gunicorn 'app:create_app()' --bind=0.0.0.0:$PORT