import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5000/api'; // Use this for Android emulator
// const API_URL = 'http://localhost:5000/api'; // Use this for iOS simulator

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('auth_token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

interface Question {
  id: number;
  text: string;
  category: string;
  difficulty: number;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuestionsResponse {
  questions: Question[];
}

export const fetchQuestions = async (
  category?: string, 
  difficulty?: number, 
  amount: number = 10
): Promise<QuestionsResponse> => {
  const response = await api.get('/questions', {
    params: { category, difficulty, amount },
  });
  return response.data;
};

interface ScoreData {
  score: number;
  category?: string;
  difficulty?: number;
  questions_answered: number;
  questions_correct: number;
}

export const submitScore = async (scoreData: ScoreData): Promise<any> => {
  const response = await api.post('/scores', scoreData);
  return response.data;
};

interface UserStats {
  total_games: number;
  average_score: number;
  highest_score: number;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
}

export const fetchUserStats = async (): Promise<UserStats> => {
  const response = await api.get('/scores/stats');
  return response.data;
};

export default api;
