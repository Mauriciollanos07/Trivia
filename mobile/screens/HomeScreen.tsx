import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { AppColors } from '@/constants/Colors';

const HomeScreen = () => {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trivia Challenge</Text>
      
      {user && (
        <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>
      )}
      
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
        
        {user ? (
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.loginButton]}
            onPress={() => router.push('./login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
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
  welcomeText: {
    fontSize: 18,
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
  loginButton: {
    backgroundColor: AppColors.successButton, // Keep green for login
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: AppColors.dangerButton, // Keep red for logout
    marginTop: 20,
  },
  buttonText: {
    color: AppColors.lightText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
