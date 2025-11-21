import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppColors } from '@/constants/Colors';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Bounce users back home since auth is not required anymore
    const timer = setTimeout(() => router.replace('/'), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: 'Guest Mode' }} />
      <View style={styles.container}>
        <Text style={styles.title}>No login needed</Text>
        <Text style={styles.subtitle}>You can jump right into a quiz as a guest.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
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
    backgroundColor: AppColors.darkBlue,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: AppColors.lightText,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.mediumText,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: AppColors.primaryButton,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: AppColors.lightText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
