import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppColors } from '@/constants/Colors';
import { useTriviaMiles } from '../contexts/TriviaMilesContext';

interface Question {
  id: number;
  text: string;
  category: string;
  difficulty: number;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean, milesUsed: number) => void;
  disabled?: boolean;
  miles: number;
  milesUsed: number;
  setMilesUsed: (miles: number) => void;
}

const QuestionCard = ({ question, onAnswer, disabled = false, miles, milesUsed, setMilesUsed }: QuestionCardProps) => {
  const triviaMiles = useTriviaMiles();
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [eliminatedAnswers, setEliminatedAnswers] = useState<string[]>([]);
  const [allAnswers, setAllAnswers] = useState<string[]>([]);

  // Reset state when question changes
  useEffect(() => {
    setAnswered(false);
    setSelectedAnswer(null);
    setEliminatedAnswers([]);
    // Shuffle answers only once per question
    setAllAnswers([question.correct_answer, ...question.incorrect_answers]
      .sort(() => Math.random() - 0.5));
  }, [question.id]);
  
  const handleAnswer = (answer: string) => {
    if (answered || disabled) return;
    
    setSelectedAnswer(answer);
    setAnswered(true);
    
    const isCorrect = answer === question.correct_answer;
    
    // Delay to show the result before moving to next question
    setTimeout(() => {
      onAnswer(isCorrect, milesUsed);
      setAnswered(false);
      setSelectedAnswer(null);
    }, 1000);
  };
  
  const handleUseMile = () => {
    if (miles > 0 && !answered) {
      // Find one incorrect answer to eliminate
      const incorrectAnswers = question.incorrect_answers.filter(
        answer => !eliminatedAnswers.includes(answer)
      );
      if (incorrectAnswers.length > 0) {
        const randomIncorrect = incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];
        setEliminatedAnswers(prev => [...prev, randomIncorrect]);
        triviaMiles.useMile();
        setMilesUsed(milesUsed + 1);
      }
    }
  };
  
  const getButtonStyle = (answer: string) => {
    if (eliminatedAnswers.includes(answer)) {
      return [styles.answerButton, styles.eliminatedAnswer];
    }
    
    if (!answered || selectedAnswer !== answer) {
      return styles.answerButton;
    }
    
    return answer === question.correct_answer
      ? [styles.answerButton, styles.correctAnswer]
      : [styles.answerButton, styles.wrongAnswer];
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.category}>{question.category}</Text>
      <Text style={styles.difficulty}>
        Difficulty: {Array(question.difficulty).fill('★').join('')}
      </Text>
      
      <Text style={styles.questionText}>{question.text}</Text>
      
      {miles > 0 && eliminatedAnswers.length < question.incorrect_answers.length && !answered && (
        <TouchableOpacity style={styles.mileButton} onPress={handleUseMile}>
          <Text style={styles.mileButtonText}>Use Mile (Eliminate Wrong Answer)</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.answersContainer}>
        {allAnswers.map((answer, index) => {
          const isEliminated = eliminatedAnswers.includes(answer);
          return (
            <TouchableOpacity
              key={index}
              style={getButtonStyle(answer)}
              onPress={() => handleAnswer(answer)}
              disabled={answered || isEliminated}
            >
              <Text style={[styles.answerText, isEliminated && styles.eliminatedText]}>
                {isEliminated ? '❌ ' + answer : answer}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.darkerBlue,
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  category: {
    fontSize: 14,
    color: AppColors.mediumText,
    marginBottom: 5,
  },
  difficulty: {
    fontSize: 14,
    color: AppColors.mediumText,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 24,
    color: AppColors.lightText,
  },
  answersContainer: {
    marginTop: 10,
  },
  answerButton: {
    backgroundColor: AppColors.darkestBlue,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  correctAnswer: {
    backgroundColor: AppColors.successButton,
    borderColor: '#c3e6cb',
  },
  wrongAnswer: {
    backgroundColor: AppColors.dangerButton,
    borderColor: '#f5c6cb',
  },
  answerText: {
    fontSize: 16,
    color: AppColors.lightText,
  },
  mileButton: {
    backgroundColor: AppColors.primaryButton,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  mileButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  eliminatedAnswer: {
    backgroundColor: '#444',
    opacity: 0.5,
  },
  eliminatedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
});

export default QuestionCard;
