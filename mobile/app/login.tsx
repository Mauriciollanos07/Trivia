import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors } from '@/constants/Colors';
import { TextStyles } from '@/constants/Typography';
import { registerNickname, checkNicknameAvailability } from '@/services/api';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [colorScheme, setColorScheme] = useState<'blue' | 'magenta'>('blue');
  
  // Gradient colors based on designer concepts
  const gradientColors = {
    blue: ['#00969b', '#82b7bc'],
    magenta: ['#ee366d', '#f596a3']
  };

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      Alert.alert('Error', 'Please enter a nickname');
      return;
    }

    if (nickname.length < 3 || nickname.length > 20) {
      Alert.alert('Error', 'Nickname must be between 3 and 20 characters');
      return;
    }

    setLoading(true);
    try {
      // Check if nickname is available
      const isAvailable = await checkNicknameAvailability(nickname.trim());
      if (!isAvailable) {
        Alert.alert('Error', 'This nickname is already taken. Please choose another one.');
        setLoading(false);
        return;
      }

      // Register nickname and get JWT token
      console.log('Registering nickname with JWT system:', nickname.trim());
      const user = await registerNickname(nickname.trim());
      console.log('Registration successful, user:', user);
      
      // Navigate to home screen
      router.replace('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Failed to register nickname');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Terminal Access',
        headerBackVisible: true
      }} />
      <LinearGradient
        colors={gradientColors[colorScheme]}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Logo placeholder - replace with your actual logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>THE TRIVIALER</Text>
          <Text style={styles.logoSubtext}>GLOBAL KNOWLEDGE TERMINAL</Text>
        </View>
        
        {/* Terminal welcome message */}
        <View style={styles.terminalWelcome}>
          <Text style={styles.terminalText}>WELCOME TO TERMINAL</Text>
          <Text style={styles.terminalText}>INITIALIZING SYSTEM...</Text>
          <Text style={styles.terminalText}>READY FOR TRAVELER INPUT</Text>
        </View>
        
        {/* Color scheme toggle */}
        <View style={styles.colorToggle}>
          <TouchableOpacity
            style={[styles.colorButton, colorScheme === 'blue' && styles.activeColorButton]}
            onPress={() => setColorScheme('blue')}
          >
            <Text style={styles.colorButtonText}>BLUE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.colorButton, colorScheme === 'magenta' && styles.activeColorButton]}
            onPress={() => setColorScheme('magenta')}
          >
            <Text style={styles.colorButtonText}>MAGENTA</Text>
          </TouchableOpacity>
        </View>
        
        {/* Registration form */}
        <View style={styles.registrationCard}>
          <Text style={styles.cardTitle}>TRAVELER REGISTRATION</Text>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>ENTER CALL SIGN</Text>
            <TextInput
              style={styles.terminalInput}
              placeholder="YOUR_TRAVEL_NAME"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={nickname}
              onChangeText={setNickname}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.launchButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.launchButtonText}>
              {loading ? 'PROCESSING...' : 'LAUNCH JOURNEY'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Logo section
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  
  logoText: {
    fontFamily: 'Courier New',
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 3,
  },
  
  logoSubtext: {
    fontFamily: 'Courier New',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 2,
    marginTop: 8,
  },
  
  // Terminal welcome section
  terminalWelcome: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    width: '100%',
  },
  
  terminalText: {
    fontFamily: 'Courier New',
    fontSize: 14,
    color: '#00ff00', // Classic terminal green
    marginBottom: 5,
    letterSpacing: 1,
  },
  
  // Color scheme toggle
  colorToggle: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
    padding: 4,
  },
  
  colorButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  
  activeColorButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  
  colorButtonText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  
  // Registration card
  registrationCard: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    padding: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  cardTitle: {
    fontFamily: 'Courier New',
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  
  inputSection: {
    width: '100%',
    marginBottom: 30,
  },
  
  inputLabel: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    letterSpacing: 1,
  },
  
  terminalInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    color: 'white',
    fontFamily: 'Courier New',
    fontSize: 16,
    letterSpacing: 1,
  },
  
  launchButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  
  buttonDisabled: {
    opacity: 0.6,
  },
  
  launchButtonText: {
    fontFamily: 'Courier New',
    color: 'white',
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
});
