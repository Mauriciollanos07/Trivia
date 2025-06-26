import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchUserStats, UserStats, fetchGeneralStats, GeneralStats } from '@/services/api';

export default function Stats() {

 type StatsOption = 'user' | 'general';
 const [ statsOption, setStatsOption ] = useState<StatsOption>('user');
 const [ userStats, setUserStats ] = useState<UserStats | null>(null);
 const [ generalStats, setGeneralStats ] = useState<GeneralStats[] | null>(null);

 // load srats when the component mounts
 useEffect(() => {
   const loadStats = async () => {
     try {
       const stats = await fetchUserStats();
       console.log('User Stats:', stats);
       setUserStats(stats);
     } catch (error) {
       console.error('Error fetching user stats:', error);
     }
   };

   const loadGeneralStats = async () => {
     try {
       const scores= await fetchGeneralStats();
       console.log('Scores:', scores);
       setGeneralStats(scores);
     } catch (error) {
       console.error('Error fetching general stats:', error);
     }
   };
   loadGeneralStats();
   loadStats();
 }, []);

 const handleOptionChange = () => {
   setStatsOption(statsOption === 'user' ? 'general' : 'user');
 };

  if (userStats === null || generalStats === null) { 
    return (
    <>
      <Stack.Screen options={{ title: 'Statistics' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Statistics not found: Make sure you are Loged In</Text>
      </View>
    </>
  );
 }else{
  return (
    <View>
      <Stack.Screen options={{ title: 'Statistics' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Statistics</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleOptionChange}
          >
            <Text style={styles.buttonText}>User Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleOptionChange}
          >
            <Text style={styles.buttonText}>All Scores</Text>
          </TouchableOpacity>
      </View>
        {statsOption === 'user' ? (
          <View style={styles.container}>
            <Text style={styles.title}>User Statistics</Text>
            <Text style={styles.subtitle}>Total Games: {userStats.total_games}</Text>
            <Text style={styles.subtitle}>Average Score: {userStats.average_score}</Text>
            <Text style={styles.subtitle}>Highest Score: {userStats.highest_score}</Text>
            <Text style={styles.subtitle}>Total Questions: {userStats.total_questions}</Text>
            <Text style={styles.subtitle}>Correct Answers: {userStats.correct_answers}</Text>
            <Text style={styles.subtitle}>Acuracy: {userStats.accuracy}</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.title}>General Statistics</Text>
            {generalStats!.map((stat, index) => (
              <View key={index} style={styles.container}>
                <Text style={styles.title2}>Game of {stat.date}</Text>
                <Text style={styles.subtitle}>Category: {stat.category}</Text>
                <Text style={styles.subtitle}>Difficulty: {stat.difficulty}</Text>
                <Text style={styles.subtitle}>Questions Answered: {stat.questions_answered}</Text>
                <Text style={styles.subtitle}>Questions Correct: {stat.questions_correct}</Text>
                <Text style={styles.subtitle}>Date: {stat.date}</Text>
              </View>
            ))}
          </View>
        )}
    </View>
)}
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  title2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  }
});