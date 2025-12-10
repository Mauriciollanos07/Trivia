import { Stack, useLocalSearchParams } from 'expo-router';
import QuizScreen from '../screens/QuizScreen';

export default function Quiz() {
  const params = useLocalSearchParams();
  const category = params.category as string;
  const difficulty = Number(params.difficulty);
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Quiz',
        headerLeft: () => null,
        gestureEnabled: false
      }} />
      <QuizScreen 
        category={category}
        difficulty={difficulty}
      />
    </>
  );
}
