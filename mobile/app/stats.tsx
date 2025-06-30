import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { fetchUserStats, UserStats, fetchGeneralStats, GeneralStats, changePassword, getCurrentUser } from '@/services/api';
import { AppColors } from '@/constants/Colors';

export default function Stats() {

  // get color dynamically
  function getScoreStyle(score: number) {
    if (score >= 8) return styles.high;
    if (score >= 5) return styles.medium;
    return styles.low;
}

 type StatsOption = 'user' | 'general';
 const [ statsOption, setStatsOption ] = useState<StatsOption>('user');
 const [ userStats, setUserStats ] = useState<UserStats | null>(null);
 const [ generalStats, setGeneralStats ] = useState<GeneralStats[] | null>(null);
 const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false);
 const [currentPassword, setCurrentPassword] = useState<string>('');
 const [newPassword, setNewPassword] = useState<string>('');
 const [confirmPassword, setConfirmPassword] = useState<string>('');
 const [isLoading, setIsLoading] = useState<boolean>(false);
 const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

 // Add this somewhere in your component to test
useEffect(() => {
  console.log('Testing Alert');
  Alert.alert('Test', 'This is a test alert');
}, []);

 // load stats when the component mounts
 useEffect(() => {
   const checkLoginStatus = async () => {
     try {
       const user = await getCurrentUser();
       setIsLoggedIn(!!user);
     } catch (error) {
       console.error('Error checking login status:', error);
       setIsLoggedIn(false);
     }
   };

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
   
   checkLoginStatus();
   loadGeneralStats();
   loadStats();
 }, []);

 const handleOptionChange = () => {
   setStatsOption(statsOption === 'user' ? 'general' : 'user');
 };

 const handleChangePassword = async () => {
  if (newPassword !== confirmPassword) {
    console.error('New passwords do not match');
    Alert.alert('Error', 'New passwords do not match');
    return;
  }
  
  if (newPassword.length < 8) {
    console.error('Password must be at least 8 characters long');
    Alert.alert('Error', 'Password must be at least 8 characters long');
    return;
  }
  
  setIsLoading(true);
  try {
    await changePassword({
      current_password: currentPassword,
      new_password: newPassword
    });
    
    setPasswordModalVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    console.log('Password changed successfully');
    Alert.alert('Success', 'Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    Alert.alert('Error', error instanceof Error ? error.message : 'Failed to change password');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ title: 'Statistics' }} />
      <Text style={styles.title}>Statistics</Text>
      
      {isLoggedIn && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setPasswordModalVisible(true)}
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {userStats === null || generalStats === null ? (
        <View style={styles.container}>
          <Text style={styles.subtitle}>Statistics not found: Make sure you are Logged In</Text>
        </View>
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={statsOption === 'user' ? styles.buttondisable : styles.button}
              onPress={handleOptionChange}
              disabled={statsOption === 'user'}
            >
              <Text style={styles.buttonText}>User Stats</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={statsOption === 'general' ? styles.buttondisable : styles.button}
              onPress={handleOptionChange}
              disabled={statsOption === 'general'}
            >
              <Text style={styles.buttonText}>All User Scores</Text>
            </TouchableOpacity>
          </View>
          
          {statsOption === 'user' ? (
            <View>
              <Text style={styles.title}>USER STATISTICS</Text>
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
              <Text style={styles.title}>ALL USER GAMES</Text>
              {generalStats.length === 0 ? (
                <View style={styles.container}>
                  <Text style={styles.subtitle}>No games played yet</Text>
                </View>
              ) : (
                generalStats.map((stat, index) => (
                  <View key={index} style={styles.container2}>
                    <Text style={styles.title2}>Game of {stat.date}</Text>
                    <Text style={styles.subtitle}>Category: {stat.category}</Text>
                    <Text style={styles.subtitle}>Difficulty: {stat.difficulty}</Text>
                    <Text style={styles.subtitle}>Questions Answered: {stat.questions_answered}</Text>
                    <Text style={styles.subtitle}>Questions Correct: {stat.questions_correct}</Text>
                    <Text style={styles.subtitle}>Date: {stat.date}</Text>
                  </View>
                ))
              )}
            </View>
          )}
        </>
      )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={passwordModalVisible}
          onRequestClose={() => setPasswordModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                placeholderTextColor="#7f8c8d"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#7f8c8d"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="#7f8c8d"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
      
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setPasswordModalVisible(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, isLoading ? styles.buttondisable : null]}
                onPress={handleChangePassword}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Changing...' : 'Change Password'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#34495e',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
});