from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))  # Changed from 5000 to avoid macOS conflict
    app.run(host='0.0.0.0', port=port, debug=True)
