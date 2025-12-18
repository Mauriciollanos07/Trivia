import axios, {isAxiosError} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Environment-based API URL configuration
const getApiUrl = () => {
  if (__DEV__) {
    // Development mode - temporarily using Render for testing
    //return 'https://trivia-6xsr.onrender.com'; // Render instance
    return 'http://localhost:5001'; // Local Flask server
    // For Android emulator, use: 'http://10.0.2.2:5001'
  } else {
    // Production mode
    return process.env.EXPO_PUBLIC_API_URL || 'https://trivia-6xsr.onrender.com';
  }
};

const API_URL = getApiUrl();

// Open Trivia Database API
const OPEN_TRIVIA_API_URL = 'https://opentdb.com';

console.log('API URL configured as:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
    console.log('Attempting login to:', API_URL);
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    await setToken(response.data.access_token);
    return response.data.user;
  } catch (error) {
    console.error('Login error:', error);
    if (isAxiosError(error)) {
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
        throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        console.error('Network error - no response received');
        throw new Error('Cannot connect to server. Check your network connection.');
      }
    }
    throw new Error('Network error during login');
  }
};

/**
 * Register a new user with just a nickname (no password required)
 * 
 * Flow:
 * 1. User enters nickname in mobile app
 * 2. App calls this function
 * 3. Backend creates user with unique nickname
 * 4. Backend returns JWT token
 * 5. App stores token and user is automatically logged in
 * 6. All future requests use this token
 */
export const registerNickname = async (nickname: string): Promise<User> => {
  try {
    console.log('Registering nickname:', nickname);
    const response = await api.post<AuthResponse>('/api/auth/register-nickname', { nickname });
    
    // Store the JWT token for future requests
    await setToken(response.data.access_token);
    
    // Store nickname locally for backward compatibility
    await AsyncStorage.setItem('player_nickname', nickname);
    
    return response.data.user;
  } catch (error) {
    console.error('Nickname registration error:', error);
    if (isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Registration failed');
      }
    }
    throw new Error('Network error during registration');
  }
};

/**
 * Check if a nickname is available before registration
 * Provides real-time feedback to user
 */
export const checkNicknameAvailability = async (nickname: string): Promise<boolean> => {
  try {
    const response = await api.post('/api/auth/check-nickname', { nickname });
    return response.data.available;
  } catch (error) {
    console.error('Error checking nickname availability:', error);
    return false;
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
  // Clear authentication token
  await removeToken();
  // Keep nickname for legacy compatibility but user will need to re-register
  // await AsyncStorage.removeItem('player_nickname');
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
  normal_score: number;
  trivialer_score: number;
  category?: string;
  difficulty?: number;
  questions_answered: number;
  questions_correct: number;
  player_name?: string;
}

// Legacy function - use checkNicknameAvailability for new registrations
export const validatePlayerName = async (playerName: string): Promise<boolean> => {
  try {
    const response = await api.get('/api/scores', { params: { nickname: playerName } });
    return response.data.scores.length === 0; // Available if no scores found
  } catch (error) {
    console.error('Error validating player name:', error);
    return false;
  }
};

/**
 * Submit score using authentication
 * 
 * Flow:
 * 1. Mobile app calls this function with score data
 * 2. JWT token is automatically added to request (via interceptor)
 * 3. Backend verifies token and links score to authenticated user
 * 4. Score is saved with user_id, ensuring data integrity
 */
export const submitScore = async (scoreData: ScoreData): Promise<any> => {
  try {
    // Check if user is authenticated
    const token = await getToken();
    
    if (token) {
      // Authenticated submission - token automatically added by interceptor
      const response = await api.post('/api/scores', scoreData);
      return response.data;
    } else {
      // Fallback to legacy submission for users without accounts
      const nickname = await AsyncStorage.getItem('player_nickname');
      const payload = {
        player_name: nickname || 'Guest',
        ...scoreData,
      };
      const response = await api.post('/api/scores/legacy', payload);
      return response.data;
    }
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
};

export interface UserStats {
  total_games: number;
  average_score: number;
  highest_score: number;
  average_normal_score?: number;
  average_trivialer_score?: number;
  highest_normal_score?: number;
  highest_trivialer_score?: number;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
}

export interface GeneralStats {
  username?: string;
  category: string;
  difficulty: number;
  questions_answered: number;
  questions_correct: number;
  date: string;
  trivialer_score: number
}

/**
 * Fetch user statistics
 * 
 * Flow:
 * 1. If user is authenticated (has token), get their stats automatically
 * 2. If not authenticated, fall back to nickname-based lookup
 * 3. Backend handles both cases seamlessly
 */
export const fetchUserStats = async (): Promise<UserStats> => {
  try {
    const token = await getToken();
    
    if (token) {
      // Authenticated user - backend will use token to get user's stats
      const response = await api.get('/api/scores/stats');
      return response.data;
    } else {
      // Legacy mode - use nickname parameter
      const nickname = await AsyncStorage.getItem('player_nickname');
      const params = nickname ? { nickname } : {};
      const response = await api.get('/api/scores/stats', { params });
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

/**
 * Fetch user's score history
 * 
 * Flow:
 * 1. If user is authenticated, get their score history automatically
 * 2. If not authenticated, fall back to nickname-based lookup
 */
export const fetchGeneralStats = async (): Promise<GeneralStats[]> => {
  try {
    const token = await getToken();
    
    if (token) {
      // Authenticated user - backend will use token to get user's scores
      const response = await api.get('/api/scores');
      return response.data.scores;
    } else {
      // Legacy mode - use nickname parameter
      const nickname = await AsyncStorage.getItem('player_nickname');
      const params = nickname ? { nickname } : {};
      const response = await api.get('/api/scores', { params });
      return response.data.scores;
    }
  } catch (error) {
    console.error('Error fetching general stats:', error);
    throw error;
  }
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
  // First handle numeric entities like &#241; (ñ) and &#225; (á)
  let decoded = text.replace(/&#(\d+);/g, (match, num) => {
    return String.fromCharCode(parseInt(num, 10));
  });
  
  // Then handle named entities
  return decoded
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
