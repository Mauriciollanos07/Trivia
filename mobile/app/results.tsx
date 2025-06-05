import { Stack, useLocalSearchParams, useRouter  } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Results() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const score = Number(params.score);
  const total = Number(params.total);
  const category = params.category as string;
  const difficulty = Number(params.difficulty);
  
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  
  return (
    <>
      <Stack.Screen options={{ title: 'Quiz Results' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Complete!</Text>
        
        <View style={styles.resultCard}>
          <Text style={styles.scoreText}>
            Your Score: <Text style={styles.scoreValue}>{score}/{total}</Text>
          </Text>
          
          <Text style={styles.percentageText}>
            {percentage}%
          </Text>
          
          <Text style={styles.categoryText}>
            Category: {category}
          </Text>
          
          <Text style={styles.difficultyText}>
            Difficulty: {difficulty}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.newQuizButton]}
          onPress={() => router.push({
            pathname: './quiz',
            params: { category, difficulty }
          })}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </>
  );
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
    marginBottom: 30,
    color: '#333',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 10,
  },
  scoreValue: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  percentageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  difficultyText: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  newQuizButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});