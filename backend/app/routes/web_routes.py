from flask import Blueprint, render_template, redirect, url_for, request, flash, session
from flask_login import login_user, logout_user, login_required, current_user
from app import db
from app.models.user import User
from app.models.question import Question
from app.models.score import Score
import json
import random

web_bp = Blueprint('web', __name__)

@web_bp.route('/home')
def index():
    return render_template('index.html')

@web_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('web.index'))
        
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            login_user(user)
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password', 'danger')
    
    return render_template('login.html')

@web_bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('web.index'))
        
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if password != confirm_password:
            flash('Passwords do not match', 'danger')
            return render_template('register.html')
            
        if User.query.filter_by(username=username).first():
            flash('Username already exists', 'danger')
            return render_template('register.html')
            
        if User.query.filter_by(email=email).first():
            flash('Email already exists', 'danger')
            return render_template('register.html')
        
        user = User(username=username, email=email)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('web.login'))
    
    return render_template('register.html')

@web_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('web.index'))

@web_bp.route('/play', methods=['GET', 'POST'])
@login_required
def play():
    if request.method == 'POST':
        category = request.form.get('category')
        difficulty = request.form.get('difficulty')
        amount = int(request.form.get('amount', 10))
        
        query = Question.query
        
        if category:
            query = query.filter_by(category=category)
        
        if difficulty:
            query = query.filter_by(difficulty=int(difficulty))
        
        questions = query.all()
        
        if len(questions) < amount:
            flash(f'Not enough questions available. Found {len(questions)} questions.', 'warning')
            amount = len(questions)
        
        if len(questions) == 0:
            flash('No questions found for the selected criteria', 'danger')
            return redirect(url_for('web.play'))
        
        # Select random questions
        selected_questions = random.sample(questions, amount)
        
        # Store in session
        session['questions'] = [q.id for q in selected_questions]
        session['current_question'] = 0
        session['score'] = 0
        session['correct_answers'] = 0
        session['category'] = category
        session['difficulty'] = difficulty
        
        return redirect(url_for('web.play'))
    
    # Get all available categories
    categories = db.session.query(Question.category).distinct().all()
    categories = [c[0] for c in categories]
    
    # Check if game is in progress
    game_started = 'questions' in session and session['current_question'] < len(session['questions'])
    
    if game_started:
        current_question_index = session['current_question']
        question_id = session['questions'][current_question_index]
        current_question = Question.query.get(question_id)
        
        # Parse answers
        answers = json.loads(current_question.incorrect_answers)
        answers.append(current_question.correct_answer)
        random.shuffle(answers)
        
        return render_template('play.html', 
                              game_started=True,
                              current_question=current_question,
                              current_question_index=current_question_index,
                              total_questions=len(session['questions']),
                              score=session['score'],
                              answers=answers)
    else:
        # Clear any previous game data
        if 'questions' in session:
            session.pop('questions')
        if 'current_question' in session:
            session.pop('current_question')
        if 'score' in session:
            session.pop('score')
        if 'correct_answers' in session:
            session.pop('correct_answers')
        
        return render_template('play.html', 
                              game_started=False,
                              categories=categories)

@web_bp.route('/answer/<int:question_id>', methods=['POST'])
@login_required
def answer(question_id):
    if 'questions' not in session:
        return redirect(url_for('web.play'))
    
    answer = request.form.get('answer')
    question = Question.query.get(question_id)
    
    if not question:
        flash('Question not found', 'danger')
        return redirect(url_for('web.play'))
    
    # Check if answer is correct
    if answer == question.correct_answer:
        session['score'] += 1
        session['correct_answers'] += 1
    
    # Move to next question
    session['current_question'] += 1
    
    # Check if game is over
    if session['current_question'] >= len(session['questions']):
        # Save score to database
        score = Score(
            user_id=current_user.id,
            score=session['score'],
            category=session.get('category'),
            difficulty=int(session.get('difficulty')) if session.get('difficulty') else None,
            questions_answered=len(session['questions']),
            questions_correct=session['correct_answers']
        )
        db.session.add(score)
        db.session.commit()
        
        # Redirect to results page
        return redirect(url_for('web.results'))
    
    return redirect(url_for('web.play'))

@web_bp.route('/results')
@login_required
def results():
    if 'score' not in session:
        return redirect(url_for('web.play'))
    
    score = session['score']
    total_questions = len(session['questions']) if 'questions' in session else 0
    correct_answers = session['correct_answers'] if 'correct_answers' in session else 0
    
    return render_template('results.html',
                          score=score,
                          total_questions=total_questions,
                          correct_answers=correct_answers)

@web_bp.route('/leaderboard')
def leaderboard():
    scores = Score.query.order_by(Score.score.desc()).limit(20).all()
    
    # Create a list of score dictionaries with username
    score_list = []
    for score in scores:
        score_dict = {
            'score': score.score,
            'category': score.category,
            'difficulty': score.difficulty,
            'questions_answered': score.questions_answered,
            'questions_correct': score.questions_correct,
            'date': score.date,
            'username': score.user.username if score.user else 'Unknown'
        }
        score_list.append(score_dict)
    
    return render_template('leaderboard.html', scores=score_list)

@web_bp.route('/profile')
@login_required
def profile():
    # Get user stats
    scores = Score.query.filter_by(user_id=current_user.id).all()
    
    if not scores:
        stats = {
            'total_games': 0,
            'average_score': 0,
            'highest_score': 0,
            'total_questions': 0,
            'correct_answers': 0,
            'accuracy': 0
        }
    else:
        total_games = len(scores)
        average_score = sum(s.score for s in scores) / total_games
        highest_score = max(s.score for s in scores)
        total_questions = sum(s.questions_answered for s in scores)
        correct_answers = sum(s.questions_correct for s in scores)
        accuracy = (correct_answers / total_questions * 100) if total_questions > 0 else 0
        
        stats = {
            'total_games': total_games,
            'average_score': average_score,
            'highest_score': highest_score,
            'total_questions': total_questions,
            'correct_answers': correct_answers,
            'accuracy': accuracy
        }
    
    # Get recent scores
    recent_scores = Score.query.filter_by(user_id=current_user.id).order_by(Score.date.desc()).limit(10).all()
    
    return render_template('profile.html', stats=stats, recent_scores=recent_scores)