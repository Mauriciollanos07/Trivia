import { Stack } from 'expo-router';
import { TriviaMilesProvider } from '../contexts/TriviaMilesContext';

export default function Layout() {
  return (
    <TriviaMilesProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </TriviaMilesProvider>
  );
}
