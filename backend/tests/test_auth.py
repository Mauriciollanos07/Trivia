def test_register(client):
    response = client.post('/register', json={
        'username': 'newuser',
        'email': 'new@example.com',
        'password': 'password123'
    })
    assert response.status_code == 201
    assert response.get_json()['message'] == 'User registered successfully'

def test_login(client):
    # Register a user first
    client.post('/register', json={
        'username': 'loginuser',
        'email': 'login@example.com',
        'password': 'password123'
    })
    
    # Test login
    response = client.post('/login', json={
        'username': 'loginuser',
        'password': 'password123'
    })
    assert response.status_code == 200
    assert 'access_token' in response.get_json()
    assert 'user_id' in response.get_json()
    assert 'username' in response.get_json()