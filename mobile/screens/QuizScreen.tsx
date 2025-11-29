import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  fetchOpenTriviaQuestions, 
  convertOpenTriviaQuestions, 
  submitScore,
  OpenTriviaDifficulty,
  OpenTriviaType
} from '../services/api';
import QuestionCard from '../components/QuestionCard';
import { AppColors } from '@/constants/Colors';
import { useTriviaMiles } from '../contexts/TriviaMilesContext';

interface QuizScreenProps {
  category: string;
  difficulty: number;
}

interface Question {
  id: number;
  text: string;
  category: string;
  difficulty: number;
  correct_answer: string;
  incorrect_answers: string[];
}

const QuizScreen: React.FC<QuizScreenProps> = ({ category, difficulty }) => {
  const router = useRouter();
  const { miles, addMile, resetMiles } = useTriviaMiles();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answersSelected, setAnswersSelected] = useState<{questionId: number, correct: boolean}[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [milesUsed, setMilesUsed] = useState<number>(0);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    console.log('Loading questions for category:', category, 'difficulty:', difficulty);
    try {
      setLoading(true);
      
      // Map difficulty from number to OpenTriviaDifficulty enum
      let openTriviaDifficulty;
      switch(difficulty) {
        case 1: openTriviaDifficulty = OpenTriviaDifficulty.EASY; break;
        case 2: openTriviaDifficulty = OpenTriviaDifficulty.MEDIUM; break;
        case 3: openTriviaDifficulty = OpenTriviaDifficulty.HARD; break;
        default: openTriviaDifficulty = undefined;
      }
      
      // Map category string to Open Trivia DB category ID
      // This is a simplified mapping - you may need to adjust based on your categories
      let categoryId;
      switch(category) {
        case 'general': categoryId = 9; break; // General Knowledge
        case 'science': categoryId = 17; break; // Science & Nature
        case 'history': categoryId = 23; break; // History
        case 'sports': categoryId = 21; break; // Sports
        case 'entertainment: film': categoryId = 11; break; // Entertainment: Film
        case 'entertainment: television': categoryId = 14; break; // Entertainment: Television
        case 'entertainment: video games': categoryId = 15; break; // Entertainment: Video Games
        case 'entertainment: music': categoryId = 12; break; // Entertainment: Music
        case 'entertainment: books': categoryId = 10; break; // Entertainment: Books
        default: categoryId = undefined;
      }
      
      // Fetch questions from Open Trivia DB
      const response = await fetchOpenTriviaQuestions(
        10, // amount
        categoryId,
        openTriviaDifficulty,
        OpenTriviaType.MULTIPLE // Use multiple choice questions
      );
      
      // Convert to our app's question format
      const data = convertOpenTriviaQuestions(response);
      setQuestions(data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    // Calculate the next score synchronously to avoid stale state
    const nextScore = isCorrect ? score + 10 : score;

    // Add mile if answer is correct
    if (isCorrect) {
      addMile();
    }

    // temporarily reset miles if they reached 0 (should remove for production)
    if (miles === 0) {
      resetMiles();
    }

    setScore(nextScore);
    setAnswersSelected(prev => [...prev, {
      questionId: questions[currentQuestion].id,
      correct: isCorrect
    }]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsFinishing(true);
      console.log('Final score before submission:', nextScore);
      finishQuiz(nextScore, milesUsed);
    }
  };

  const finishQuiz = async (answersCorrect: number, milesUsed: number) => {
    // Calculate points deduction from miles used
    const pointsDeduction = milesUsed * 2; // Each mile used deducts 2 points
    const finalScore = Math.max(0, answersCorrect - pointsDeduction); // Ensure score doesn't go below 0
    try {
      await submitScore({
        normal_score: answersCorrect,
        trivialer_score: finalScore,
        category,
        difficulty,
        questions_answered: questions.length,
        questions_correct: answersCorrect / 10 // Convert back to number of correct answers
      });
      
      router.push({
        pathname: '/results',
        params: {
          normal_score: answersCorrect,
          trivialer_score: finalScore,
          total: questions.length,
          category,
          difficulty
        }
      });
    } catch (error) {
      console.error('Error submitting score:', error);
      // Still navigate to results even if score submission fails
      router.replace({
        pathname: '/results',
        params: {
          normal_score: answersCorrect,
          trivialer_score: finalScore,
          total: questions.length,
          category,
          difficulty
        }
      });
    }
  };
  if (!category || isNaN(difficulty)) {
    return <Text>Invalid quiz parameters. Please go back and select a category.</Text>;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primaryButton} />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        <Text style={styles.miles}>Miles: {miles}</Text>
      </View>
    
      {isFinishing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primaryButton} />
          <Text style={styles.loadingText}>Submitting your score...</Text>
        </View>
      ) : (
        questions.length > 0 && (
          <QuestionCard
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
            disabled={isFinishing}
            miles={miles}
            milesUsed={milesUsed}
            setMilesUsed={setMilesUsed}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.darkBlue,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.darkBlue,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: AppColors.lightText,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progress: {
    fontSize: 16,
    color: AppColors.lightText,
  },
  miles: {
    fontSize: 16,
    color: AppColors.primaryButton,
    fontWeight: 'bold',
  },
});

export default QuizScreen;
