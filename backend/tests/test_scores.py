def test_add_score(client):
    # Add a score as guest
    response = client.post('/api/scores', 
                          json={
                              'score': 100,
                              'category': 'Geography',
                              'difficulty': 2,
                              'questions_answered': 10,
                              'questions_correct': 8,
                              'player_name': 'GuestPlayer'
                          })
    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'Score added successfully'
    assert data['score']['username'] == 'GuestPlayer'

def test_get_user_scores(client):
    # Add a score first
    client.post('/api/scores', 
               json={
                   'score': 100,
                   'category': 'Geography',
                   'difficulty': 2,
                   'questions_answered': 10,
                   'questions_correct': 8,
                   'player_name': 'GuestPlayer'
               })
    
    # Get scores
    response = client.get('/api/scores')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['scores']) == 1
    assert data['scores'][0]['score'] == 100
    assert data['scores'][0]['category'] == 'Geography'
    assert data['scores'][0]['username'] == 'GuestPlayer'

def test_get_user_stats(client):
    # Add a score first
    client.post('/api/scores', 
               json={
                   'score': 100,
                   'category': 'Geography',
                   'difficulty': 2,
                   'questions_answered': 10,
                   'questions_correct': 8
               })
    
    # Get stats (now aggregated)
    response = client.get('/api/scores/stats')
    assert response.status_code == 200
    data = response.get_json()
    assert data['total_games'] == 1
    assert data['average_score'] == 100
    assert data['highest_score'] == 100
    assert data['total_questions'] == 10
    assert data['correct_answers'] == 8
    assert data['accuracy'] == 80.0
