import { Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppColors } from '@/constants/Colors';

export default function Login() {
  const router = useRouter();
  const { login, register, isLoading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login
        if (!username || !password) {
          throw new Error('Please enter both username and password');
        }
        
        await login({ username, password });
        router.replace('/');
      } else {
        // Register
        if (!username || !email || !password) {
          throw new Error('Please fill in all fields');
        }
        
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        
        await register({ username, email, password });
        Alert.alert('Success', 'Registration successful! Please log in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <>
      <Stack.Screen options={{ title: isLogin ? 'Login' : 'Register' }} />
      <View style={styles.container}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!isLoading}
        />
        
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? 'Sign In' : 'Register'}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.switchButton} 
          onPress={toggleAuthMode}
          disabled={isLoading}
        >
          <Text style={styles.switchText}>
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: AppColors.darkBlue,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: AppColors.lightText,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: AppColors.inputBorder,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: AppColors.darkerBlue,
    color: AppColors.lightText,
  },
  button: {
    backgroundColor: AppColors.successButton, // Keep green for login/register
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: AppColors.disabledButton,
  },
  buttonText: {
    color: AppColors.lightText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    padding: 10,
  },
  switchText: {
    color: AppColors.successButton, // Keep green for login/register links
    fontSize: 16,
  },
  errorText: {
    color: AppColors.dangerButton,
    marginBottom: 15,
    textAlign: 'center',
    width: '100%',
  },
});