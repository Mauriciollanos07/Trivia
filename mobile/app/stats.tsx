import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Stats() {
  return (
    <>
      <Stack.Screen options={{ title: 'Statistics' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Coming soon...</Text>
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
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});