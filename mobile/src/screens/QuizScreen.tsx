import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchQuestions, submitScore } from '../services/api';
import QuestionCard from '../components/QuestionCard';

type RootStackParamList = {
  Quiz: { category: string; difficulty: number };
  Results: { score: number; total: number; category: string; difficulty: number };
};

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;

interface QuizScreenProps {
  route: QuizScreenRouteProp;
  navigation: QuizScreenNavigationProp;
}

interface Question {
  id: number;
  text: string;
  category: string;
  difficulty: number;
  correct_answer: string;
  incorrect_answers: string[];
}

const QuizScreen = ({ route, navigation }: QuizScreenProps) => {
  const { category, difficulty } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answersSelected, setAnswersSelected] = useState<{questionId: number, correct: boolean}[]>([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await fetchQuestions(category, difficulty, 10);
      setQuestions(data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnswersSelected([...answersSelected, {
      questionId: questions[currentQuestion].id,
      correct: isCorrect
    }]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    try {
      await submitScore({
        score,
        category,
        difficulty,
        questions_answered: questions.length,
        questions_correct: score
      });
      
      navigation.navigate('Results', {
        score,
        total: questions.length,
        category,
        difficulty
      });
    } catch (error) {
      console.error('Error submitting score:', error);
      // Still navigate to results even if score submission fails
      navigation.navigate('Results', {
        score,
        total: questions.length,
        category,
        difficulty
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        Question {currentQuestion + 1} of {questions.length}
      </Text>
      
      {questions.length > 0 && (
        <QuestionCard
          question={questions[currentQuestion]}
          onAnswer={handleAnswer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  progress: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default QuizScreen;
