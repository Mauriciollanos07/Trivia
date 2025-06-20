import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}