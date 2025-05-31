import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
  onAnswer: (isCorrect: boolean) => void;
}

const QuestionCard = ({ question, onAnswer }: QuestionCardProps) => {
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // Combine correct and incorrect answers and shuffle them
  const allAnswers = [question.correct_answer, ...question.incorrect_answers]
    .sort(() => Math.random() - 0.5);
  
  const handleAnswer = (answer: string) => {
    if (answered) return;
    
    setSelectedAnswer(answer);
    setAnswered(true);
    
    const isCorrect = answer === question.correct_answer;
    
    // Delay to show the result before moving to next question
    setTimeout(() => {
      onAnswer(isCorrect);
      setAnswered(false);
      setSelectedAnswer(null);
    }, 1000);
  };
  
  const getButtonStyle = (answer: string) => {
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
      
      <View style={styles.answersContainer}>
        {allAnswers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={getButtonStyle(answer)}
            onPress={() => handleAnswer(answer)}
            disabled={answered}
          >
            <Text style={styles.answerText}>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
    color: '#666',
    marginBottom: 5,
  },
  difficulty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 24,
  },
  answersContainer: {
    marginTop: 10,
  },
  answerButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  correctAnswer: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  wrongAnswer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  answerText: {
    fontSize: 16,
  },
});

export default QuestionCard;
