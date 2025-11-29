import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { AppColors } from '@/constants/Colors';

export default function NicknameScreen() {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const { nicknameLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      Alert.alert('Error', 'Please enter a nickname');
      return;
    }

    if (nickname.length < 2 || nickname.length > 20) {
      Alert.alert('Error', 'Nickname must be between 2 and 20 characters');
      return;
    }

    setLoading(true);
    try {
      await nicknameLogin(nickname.trim());
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to set nickname');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Nickname</Text>
      <Text style={styles.subtitle}>Choose a nickname to track your trivia progress</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter nickname"
        placeholderTextColor={AppColors.lightText}
        value={nickname}
        onChangeText={setNickname}
        maxLength={20}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Setting up...' : 'Start Playing'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: AppColors.darkBlue,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.lightText,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.lightText,
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: AppColors.primaryButton,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: AppColors.lightText,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  button: {
    backgroundColor: AppColors.primaryButton,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: AppColors.lightText,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});