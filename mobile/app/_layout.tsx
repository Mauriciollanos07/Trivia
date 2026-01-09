import { Stack } from 'expo-router';
import { TriviaMilesProvider } from '../contexts/TriviaMilesContext';
import { AppColors } from '@/constants/Colors';

export default function Layout() {
  return (
    <TriviaMilesProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: AppColors.mediumText,
            borderBottomWidth: 2,
            borderBottomColor: AppColors.logoBackGround,
          },
          headerTintColor: AppColors.logoBackGround,
          headerTitleStyle: {
            fontFamily: 'Courier New', // Monospace for terminal feel
            fontWeight: 'bold',
            fontSize: 18,
            letterSpacing: 1.5,
            color: AppColors.logoBackGround
          },
          headerBackTitleStyle: {
            fontFamily: 'Courier New',
            color: AppColors.logoBackGround,
          },
          headerShadowVisible: false,
        }}
      />
    </TriviaMilesProvider>
  );
}
