import { Stack } from 'expo-router';
import { TriviaMilesProvider } from '../contexts/TriviaMilesContext';
import { AppColors } from '@/constants/Colors';

export default function Layout() {
  return (
    <TriviaMilesProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: AppColors.cardBackground,
            borderBottomWidth: 2,
            borderBottomColor: AppColors.amberGlow,
          },
          headerTintColor: AppColors.lightText,
          headerTitleStyle: {
            fontFamily: 'Courier New', // Monospace for terminal feel
            fontWeight: 'bold',
            fontSize: 18,
            letterSpacing: 1.5,
            color: AppColors.amberGlow,
          },
          headerBackTitleStyle: {
            fontFamily: 'Courier New',
            color: AppColors.lightText,
          },
          headerShadowVisible: false,
        }}
      />
    </TriviaMilesProvider>
  );
}
