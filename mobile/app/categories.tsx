import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/Colors';

export default function  Categories() {
    const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      > 
        <Text style={styles.title}>Select Category</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({
              pathname: './quiz',
              params: { category: 'general', difficulty: 1 }
            })}
          >
          <Text style={styles.buttonText}>General Knowledge</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({
              pathname: './quiz',
              params: { category: 'sports', difficulty: 1 }
            })}>
            <Text style={styles.buttonText}>Sports</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({
              pathname: './quiz',
              params: { category: 'history', difficulty: 1 }
            })}
          >
            <Text style={styles.buttonText}>History</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({
              pathname: './quiz',
              params: { category: 'science', difficulty: 1 }
            })}
          >
            <Text style={styles.buttonText}>Science</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({
              pathname: './quiz',
              params: { category: 'entertainment: film', difficulty: 1 }
            })}
          >
            <Text style={styles.buttonText}>Films</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({
              pathname: './quiz',
              params: { category: 'entertainment: television', difficulty: 1 }
            })}
          >
            <Text style={styles.buttonText}>Television</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({
              pathname: './quiz',
              params: { category: 'entertainment: video games', difficulty: 1 }
            })}
          >
            <Text style={styles.buttonText}>Video Games</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({
              pathname: './quiz',
              params: { category: 'entertainment: music', difficulty: 1 }
            })}
          >
            <Text style={styles.buttonText}>Music</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({
              pathname: './quiz',
              params: { category: 'entertainment: books', difficulty: 1 }
            })}
          >
            <Text style={styles.buttonText}>Books</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.darkBlue,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40, // Add some bottom padding for last button
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: AppColors.lightText,
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
    backgroundColor: AppColors.successButton,
    marginTop: 20,
  },
  buttonText: {
    color: AppColors.lightText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});