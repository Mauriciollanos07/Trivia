import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/Colors';

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isActive: boolean;
  setSecondsAtEnd: (seconds: number) => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, isActive, setSecondsAtEnd }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      setSecondsAtEnd(0);
      onTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
      setSecondsAtEnd(timeLeft);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isActive, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerStyle = () => {
    if (timeLeft <= 30) return [styles.timer, styles.critical];
    if (timeLeft <= 60) return [styles.timer, styles.warning];
    return styles.timer;
  };

  return (
    <Text style={getTimerStyle()}>
      ⏱️ {formatTime(timeLeft)}
    </Text>
  );
};

const styles = StyleSheet.create({
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.successButton,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  warning: {
    color: '#FFA500',
  },
  critical: {
    color: AppColors.dangerButton,
  },
});

export default Timer;