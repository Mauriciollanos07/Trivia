def test_add_score(client, auth_headers):
    # Add a score
    response = client.post('/api/scores', 
                          json={
                              'score': 100,
                              'category': 'Geography',
                              'difficulty': 2,
                              'questions_answered': 10,
                              'questions_correct': 8
                          },
                          headers=auth_headers)
    assert response.status_code == 201
    assert response.get_json()['message'] == 'Score added successfully'

def test_get_user_scores(client, auth_headers):
    # Add a score first
    client.post('/api/scores', 
               json={
                   'score': 100,
                   'category': 'Geography',
                   'difficulty': 2,
                   'questions_answered': 10,
                   'questions_correct': 8
               },
               headers=auth_headers)
    
    # Get user scores
    response = client.get('/api/scores', headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['scores']) == 1
    assert data['scores'][0]['score'] == 100
    assert data['scores'][0]['category'] == 'Geography'

def test_get_user_stats(client, auth_headers):
    # Add a score first
    client.post('/api/scores', 
               json={
                   'score': 100,
                   'category': 'Geography',
                   'difficulty': 2,
                   'questions_answered': 10,
                   'questions_correct': 8
               },
               headers=auth_headers)
    
    # Get user stats
    response = client.get('/api/scores/stats', headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['total_games'] == 1
    assert data['average_score'] == 100
    assert data['highest_score'] == 100
    assert data['total_questions'] == 10
    assert data['correct_answers'] == 8
    assert data['accuracy'] == 80.0
