import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppColors } from '@/constants/Colors';
import { TextStyles } from '@/constants/Typography';
import { getCurrentUser, logout } from '@/services/api';

const HomeScreen = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkNickname();
  }, []);

  const checkNickname = async () => {
    try {
      // First check if user is authenticated with JWT token
      const currentUser = await getCurrentUser();
      if (currentUser) {
        console.log('User authenticated with JWT:', currentUser.username);
        setNickname(currentUser.username);
        return;
      }

      // Fallback to legacy nickname system for existing users
      const savedNickname = await AsyncStorage.getItem('player_nickname');
      if (savedNickname) {
        console.log('Using legacy nickname:', savedNickname);
        setNickname(savedNickname);
        return;
      }

      // No authentication found, redirect to login
      router.replace('/login');
    } catch (error) {
      console.error('Error checking authentication:', error);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  const changeNickname = async () => {
    try {
      // Clear JWT token and legacy nickname
      await logout();
      await AsyncStorage.removeItem('player_nickname');
      console.log('Logged out, redirecting to registration');
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if logout fails
      router.replace('/login');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Terminal Header */}
      <View style={styles.terminalHeader}>
        <Text style={styles.terminalTitle}>THE TRIVIALER</Text>
        <Text style={styles.terminalSubtitle}>GLOBAL KNOWLEDGE TERMINAL</Text>
      </View>
      
      {/* Passport Welcome Card */}
      <View style={styles.passportCard}>
        <View style={styles.passportHeader}>
          <Text style={styles.passportTitle}>TRAVELER PASSPORT</Text>
          <View style={styles.visaStamp}>
            <Text style={styles.visaText}>ACTIVE</Text>
          </View>
        </View>
        
        <Text style={styles.travelerName}>WELCOME BACK</Text>
        <Text style={styles.travelerNickname}>{nickname?.toUpperCase()}</Text>
        
        <View style={styles.passportDivider} />
        
        <Text style={styles.readyText}>READY FOR DEPARTURE</Text>
      </View>
      
      {/* Terminal Menu */}
      <View style={styles.terminalMenu}>
        <TouchableOpacity 
          style={styles.terminalButton}
          onPress={() => router.push('./categories')}
        >
          <Text style={styles.terminalButtonText}>▶ BEGIN JOURNEY</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.terminalButton}
          onPress={() => router.push('./stats')}
        >
          <Text style={styles.terminalButtonText}>📊 TRAVEL LOG</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.terminalButton, styles.secondaryButton]}
          onPress={changeNickname}
        >
          <Text style={styles.terminalButtonText}>⚙ CHANGE IDENTITY</Text>
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
    backgroundColor: AppColors.terminalBlack,
  },
  
  // Terminal Header
  terminalHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  
  terminalTitle: {
    ...TextStyles.terminalHeader,
    color: AppColors.amberGlow,
    fontSize: 36,
    marginBottom: 8,
  },
  
  terminalSubtitle: {
    ...TextStyles.documentBody,
    color: AppColors.mediumText,
    fontSize: 14,
    letterSpacing: 2,
  },
  
  // Passport Card
  passportCard: {
    backgroundColor: AppColors.passportBlue,
    borderWidth: 3,
    borderColor: AppColors.goldAccent,
    padding: 24,
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  passportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  
  passportTitle: {
    ...TextStyles.passportStamp,
    color: AppColors.goldAccent,
    fontSize: 14,
  },
  
  visaStamp: {
    borderWidth: 2,
    borderColor: AppColors.visaGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    transform: [{ rotate: '-15deg' }],
  },
  
  visaText: {
    ...TextStyles.passportStamp,
    color: AppColors.visaGreen,
    fontSize: 10,
  },
  
  travelerName: {
    ...TextStyles.documentBody,
    color: AppColors.mediumText,
    fontSize: 14,
    marginBottom: 8,
  },
  
  travelerNickname: {
    ...TextStyles.terminalNumber,
    color: AppColors.lightText,
    fontSize: 24,
    marginBottom: 20,
  },
  
  passportDivider: {
    width: '80%',
    height: 1,
    backgroundColor: AppColors.goldAccent,
    marginBottom: 15,
  },
  
  readyText: {
    ...TextStyles.passportStamp,
    color: AppColors.visaGreen,
    fontSize: 12,
  },
  
  // Terminal Menu
  terminalMenu: {
    width: '100%',
    alignItems: 'center',
  },
  
  terminalButton: {
    backgroundColor: AppColors.cardBackground,
    borderWidth: 2,
    borderColor: AppColors.amberGlow,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 8,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  secondaryButton: {
    borderColor: AppColors.mediumText,
    backgroundColor: AppColors.passportBlue,
  },
  
  terminalButtonText: {
    ...TextStyles.buttonText,
    color: AppColors.lightText,
    fontSize: 16,
    letterSpacing: 1.5,
  },
});

export default HomeScreen;
