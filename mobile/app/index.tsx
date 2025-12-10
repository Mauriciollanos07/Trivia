import { Stack } from 'expo-router';
import HomeScreen from '../screens/HomeScreen';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'The Trivialer' }} />
      <HomeScreen />
    </>
  );
}
