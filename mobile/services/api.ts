import axios, {isAxiosError} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://127.0.0.1:5000'; // Use this for Android emulator
// const API_URL = 'http://localhost:5000'; // Use this for iOS simulator

// Open Trivia Database API
const OPEN_TRIVIA_API_URL = 'https://opentdb.com';

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

// User interfaces
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Authentication functions
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    await setToken(response.data.access_token);
    return response.data.user;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error during login');
  }
};

export const register = async (userData: RegisterData): Promise<void> => {
  try {
    await api.post('/api/auth/register', userData);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Network error during registration');
  }
};

export const logout = async (): Promise<void> => {
  await removeToken();
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = await getToken();
    if (!token) return null;
    
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    await removeToken(); // Clear invalid token
    return null;
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

// Open Trivia DB interfaces
export enum OpenTriviaDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum OpenTriviaType {
  MULTIPLE = 'multiple',
  BOOLEAN = 'boolean',
}

export interface OpenTriviaCategory {
  id: number;
  name: string;
}

export interface OpenTriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface OpenTriviaResponse {
  response_code: number;
  results: OpenTriviaQuestion[];
}

export const fetchQuestions = async (
  category?: string, 
  difficulty?: number, 
  amount: number = 10
): Promise<QuestionsResponse> => {
  const response = await api.get('/api/questions', {
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
  const response = await api.post('/api/scores', scoreData);
  return response.data;
};

export interface UserStats {
  total_games: number;
  average_score: number;
  highest_score: number;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
}

export interface GeneralStats {
  category: string;
  difficulty: number;
  questions_answered: number;
  questions_correct: number;
  date: string;
}

export const fetchUserStats = async (): Promise<UserStats> => {
  const response = await api.get('/api/scores/stats');
  return response.data;
};

export const fetchGeneralStats = async (): Promise<GeneralStats[]> => {
  const response = await api.get('/api/scores');
  return response.data.scores;
};

// Open Trivia DB API functions
export const fetchOpenTriviaCategories = async (): Promise<OpenTriviaCategory[]> => {
  const response = await axios.get(`${OPEN_TRIVIA_API_URL}/api_category.php`);
  return response.data.trivia_categories;
};

export const fetchOpenTriviaQuestions = async (
  amount: number = 10,
  categoryId?: number,
  difficulty?: OpenTriviaDifficulty,
  type?: OpenTriviaType
): Promise<OpenTriviaResponse> => {
  const params: Record<string, string | number> = { amount };
  
  if (categoryId) params.category = categoryId;
  if (difficulty) params.difficulty = difficulty;
  if (type) params.type = type;
  
  const response = await axios.get(`${OPEN_TRIVIA_API_URL}/api.php`, { params });
  
  // HTML entities in questions and answers need to be decoded
  if (response.data.results) {
    response.data.results = response.data.results.map((q: OpenTriviaQuestion) => ({
      ...q,
      question: decodeHTMLEntities(q.question),
      correct_answer: decodeHTMLEntities(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map(decodeHTMLEntities)
    }));
  }
  
  return response.data;
};

// Helper function to decode HTML entities (like &quot;)
const decodeHTMLEntities = (text: string): string => {
  // Simple replacement for common HTML entities
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&hellip;/g, '...')
    .replace(/&mdash;/g, '-')
    .replace(/&ndash;/g, '-');
};

// Convert Open Trivia DB questions to our app's Question format
export const convertOpenTriviaQuestions = (openTriviaResponse: OpenTriviaResponse): QuestionsResponse => {
  const questions = openTriviaResponse.results.map((q, index) => ({
    id: index + 1,
    text: q.question,
    category: q.category,
    difficulty: q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3,
    correct_answer: q.correct_answer,
    incorrect_answers: q.incorrect_answers
  }));
  
  return { questions };
};

export default api;

// types and function to change password

// Change Password interface
export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

// Function to change password
export const changePassword = async (changePasswordData: ChangePasswordData): Promise<void> => {
  try {
    await api.post('/api/auth/change-password', changePasswordData);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Password change failed');
    }
    throw new Error('Network error during password change');
  }
};
