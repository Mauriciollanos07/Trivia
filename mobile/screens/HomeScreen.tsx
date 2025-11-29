import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppColors } from '@/constants/Colors';

const HomeScreen = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkNickname();
  }, []);

  const checkNickname = async () => {
    try {
      const savedNickname = await AsyncStorage.getItem('player_nickname');
      if (!savedNickname) {
        router.replace('/login');
        return;
      }
      setNickname(savedNickname);
    } catch (error) {
      console.error('Error checking nickname:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeNickname = async () => {
    await AsyncStorage.removeItem('player_nickname');
    router.replace('/login');
  };

  if (loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Trivialer</Text>
      <Text style={styles.subtitle}>Welcome, {nickname}!</Text>
      
      <View style={styles.buttonContainer}>
        <Text style={styles.sectionTitle}>Quiz Categories</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('./categories')}
        >
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('./stats')}
        >
          <Text style={styles.buttonText}>View Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.changeButton]}
          onPress={changeNickname}
        >
          <Text style={styles.buttonText}>Change Nickname</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: AppColors.darkBlue,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: AppColors.lightText,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.mediumText,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: AppColors.mediumText,
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: AppColors.primaryButton,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: AppColors.lightText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeButton: {
    backgroundColor: AppColors.mediumText,
  },
});

export default HomeScreen;
