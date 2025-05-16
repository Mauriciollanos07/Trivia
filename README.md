# Trivia App

A full-stack trivia application with a Flask backend API and React Native mobile frontend.

## Project Structure

- `backend/` - Flask API server
- `mobile/` - React Native mobile app
- `docs/` - Project documentation

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On macOS/Linux
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up the database:
   ```
   flask db init
   flask db migrate
   flask db upgrade
   ```

5. Run the development server:
   ```
   flask run
   ```

### Mobile Setup

1. Navigate to the mobile directory:
   ```
   cd mobile
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Run on Android or iOS:
   ```
   npm run android
   npm run ios
   ```