import json
from app import db
from app.models.question import Question

def test_get_questions(client):
    # Add test questions to the database
    with client.application.app_context():
        q1 = Question(
            text="What is the capital of France?",
            category="Geography",
            difficulty=1,
            correct_answer="Paris",
            incorrect_answers="London|Berlin|Madrid"
        )
        q2 = Question(
            text="Who wrote Hamlet?",
            category="Literature",
            difficulty=2,
            correct_answer="William Shakespeare",
            incorrect_answers="Charles Dickens|Jane Austen|Mark Twain"
        )
        db.session.add_all([q1, q2])
        db.session.commit()
    
    # Test getting all questions
    response = client.get('/questions')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['questions']) == 2
    
    # Test filtering by category
    response = client.get('/questions?category=Geography')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['questions']) == 1
    assert data['questions'][0]['text'] == "What is the capital of France?"