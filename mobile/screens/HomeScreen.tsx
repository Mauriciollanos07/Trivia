import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppColors, GradientColors } from '@/constants/Colors';
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
    <LinearGradient
      colors={GradientColors.blueToLightBlue}
      style={styles.gradientContainer}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.container}>
      {/* Terminal Header */}
      <View style={styles.terminalHeader}>
        <Image 
          source={require('@/assets/images/white-logo.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
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
      </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Terminal Header
  terminalHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  
  logoImage: {
    width: 200,
    height: 80,
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
    backgroundColor: AppColors.passportBlueTransparent,
    borderWidth: 3,
    borderColor: AppColors.whiteTransparent2,
    padding: 24,
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
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
    backgroundColor: AppColors.whiteTransparent,
    borderWidth: 2,
    borderColor: AppColors.whiteTransparent2,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 8,
    width: '90%',
    alignItems: 'center',
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
