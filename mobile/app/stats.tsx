import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchUserStats, UserStats, fetchGeneralStats, GeneralStats } from '@/services/api';
import { AppColors } from '@/constants/Colors';

export default function Stats() {

  // get color dynamically
  function getScoreStyle(score: number) {
    if (score >= 8) return styles.high;
    if (score >= 5) return styles.medium;
    return styles.low;
  }

  type StatsOption = 'summary' | 'games';
  const [ statsOption, setStatsOption ] = useState<StatsOption>('summary');
  const [ userStats, setUserStats ] = useState<UserStats | null>(null);
  const [ generalStats, setGeneralStats ] = useState<GeneralStats[] | null>(null);

 // load stats when the component mounts
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
   setStatsOption(statsOption === 'summary' ? 'games' : 'summary');
 };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ title: 'Statistics' }} />
      <ScrollView>
        <Text style={styles.title}>Statistics</Text>
      
      {userStats === null || generalStats === null ? (
        <View style={styles.container}>
          <Text style={styles.subtitle}>Statistics will appear after you play a game.</Text>
        </View>
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={statsOption === 'summary' ? styles.buttondisable : styles.button}
              onPress={handleOptionChange}
              disabled={statsOption === 'summary'}
            >
              <Text style={styles.buttonText}>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={statsOption === 'games' ? styles.buttondisable : styles.button}
              onPress={handleOptionChange}
              disabled={statsOption === 'games'}
            >
              <Text style={styles.buttonText}>Recent Games</Text>
            </TouchableOpacity>
          </View>
          
          {statsOption === 'summary' ? (
            <View>
              <Text style={styles.title}>OVERALL STATS</Text>
              <View style={styles.container}>
                <Text style={styles.title2}>TOTAL GAMES: {userStats.total_games}</Text>
                <Text style={styles.title2}>TOTAL QUESTIONS: {userStats.total_questions}</Text>
                <Text style={styles.title2}>CORRECT ANSWERS: {userStats.correct_answers}</Text>
                <Text style={[styles.title2, getScoreStyle(userStats.average_score)]}>AVERAGE SCORE: {userStats.average_score.toFixed(2)}</Text>
                <Text style={[styles.title2, getScoreStyle(userStats.highest_score)]}>HIGHEST SCORE: {userStats.highest_score}</Text>
                <Text style={[styles.title2, getScoreStyle(userStats.accuracy/100)]}>ACCURACY: {userStats.accuracy.toFixed(2)}%</Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>RECENT GAMES</Text>
              {generalStats.length === 0 ? (
                <View style={styles.container}>
                  <Text style={styles.subtitle}>No games played yet</Text>
                </View>
              ) : (
                generalStats.map((stat, index) => (
                  <View key={index} style={styles.container2}>
                    <Text style={styles.title2}>Game on {stat.date}</Text>
                    <Text style={styles.subtitle}>Player: {stat.username || 'Guest'}</Text>
                    <Text style={styles.subtitle}>Category: {stat.category}</Text>
                    <Text style={styles.subtitle}>Difficulty: {stat.difficulty}</Text>
                    <Text style={styles.subtitle}>Questions Answered: {stat.questions_answered}</Text>
                    <Text style={styles.subtitle}>Questions Correct: {stat.questions_correct}</Text>
                  </View>
                ))
              )}
            </View>
          )}
        </>
      )}
      </ScrollView>
    </View>
    
)}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#2c3e50', // Darker blue background
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2c3e50', // Darker blue background
  },
  container2: {
    flex: 1,
    padding: 20,
    backgroundColor: '#34495e', // Darker grey-blue background
    borderBottomColor: '#1a2530',
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#2c3e50', // Darker blue background
  },
  title: {
    padding: 20,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ecf0f1', // Light grey text for contrast
  },
  title2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ecf0f1', // Light grey text for contrast
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 18,
    color: '#bdc3c7', // Lighter grey text
  },
  button: {
    backgroundColor: '#3498db', // Darker blue for buttons
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttondisable: {
    backgroundColor: '#7f8c8d', // Darker grey for disabled buttons
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  high: { color:  AppColors.successButton, },
  medium: { color: 'white' },
  low: { color:  AppColors.dangerButton },
});
