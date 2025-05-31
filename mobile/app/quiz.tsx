import { Stack, useLocalSearchParams } from 'expo-router';
import QuizScreen from '../src/screens/QuizScreen';

export default function Quiz() {
  const params = useLocalSearchParams();
  
  return (
    <>
      <Stack.Screen options={{ title: 'Quiz' }} />
      <QuizScreen 
        route={{ 
          params: { 
            category: params.category as string, 
            difficulty: Number(params.difficulty) 
          } 
        }} 
      />
    </>
  );
}
