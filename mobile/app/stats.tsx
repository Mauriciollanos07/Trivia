import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchUserStats, UserStats } from '@/services/api';

export default function Stats() {

 const [ userStats, setUserStats ] = useState<UserStats | null>(null);

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
   loadStats();
 }, []);

  if (userStats === null) { 
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
    <>
      <Stack.Screen options={{ title: 'Statistics' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Total Games: {userStats.total_games}</Text>
        <Text style={styles.subtitle}>Total Questions: {userStats.total_questions}</Text>
        <Text style={styles.subtitle}>Correct Answers: {userStats.correct_answers}</Text>
        <Text style={styles.subtitle}>Highest Score: {userStats.highest_score}</Text>
        <Text style={styles.subtitle}>Accuracy: {userStats.accuracy}</Text>
        <Text style={styles.subtitle}>Average Score: {userStats.average_score}</Text>
      </View>
    </>
  );
}
 
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
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});