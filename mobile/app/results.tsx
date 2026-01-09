import { Stack, useLocalSearchParams, useRouter, useFocusEffect  } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import { useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors, GradientColors } from '@/constants/Colors';
import { TextStyles, Typography } from '@/constants/Typography';

export default function Results() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const normalScore = Number(params.normal_score);
  const trivialerScore = Number(params.trivialer_score);
  const total = Number(params.total);
  const category = params.category as string;
  const difficulty = params.difficulty ? Number(params.difficulty) : undefined;
  
  const percentage = total > 0 ? Math.round((normalScore / total) * 10) : 0;

  // Handle hardware back button on Android
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Prevent going back to quiz, go to home instead
        router.dismissAll();
        router.replace('/');
        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [router])
  );

  if (!category || isNaN(normalScore) || isNaN(trivialerScore) || isNaN(total)) {
    // If parameters are invalid, show an error message
    console.error('Invalid quiz parameters:', { category, difficulty, normalScore, trivialerScore, total });
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Invalid quiz parameters</Text>
        <Text style={styles.terminalLabel}>INVALID FLIGHT PARAMETERS</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Quiz Results',
        headerLeft: () => null,
        gestureEnabled: false
      }} />
      <LinearGradient
        colors={GradientColors.magentaToLightBlue}
        style={styles.gradientContainer}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>JOURNEY COMPLETE</Text>
        
        {/* Passport-style result card */}
        <View style={styles.passportCard}>
          <View style={styles.passportHeader}>
            <Text style={styles.passportTitle}>TRIVIALER PASSPORT</Text>
            <View style={styles.stampBorder}>
              <Text style={styles.stampText}>APPROVED</Text>
            </View>
          </View>
          
          <View style={styles.scoreSection}>
            <Text style={styles.terminalLabel}>TRIVIALER SCORE</Text>
            <Text style={styles.terminalScore}>{trivialerScore}</Text>
          </View>
          
          <View style={styles.scoreSection}>
            <Text style={styles.terminalLabel}>FLIGHT SCORE</Text>
            <Text style={styles.terminalScore}>{normalScore}/{total * 10}</Text>
          </View>
          
          <View style={styles.percentageSection}>
            <Text style={styles.percentageLabel}>SUCCESS RATE</Text>
            <Text style={styles.percentageValue}>{percentage}%</Text>
          </View>
          
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>DESTINATION:</Text>
              <Text style={styles.detailValue}>{category.toUpperCase()}</Text>
            </View>
            {difficulty && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>CLASS:</Text>
                <Text style={styles.detailValue}>LEVEL {difficulty}</Text>
              </View>
            )}
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.terminalButton}
          onPress={() => {
            router.dismissAll();
            router.replace('/');
          }}
        >
          <Text style={styles.terminalButtonText}>← RETURN TO TERMINAL</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.terminalButton, styles.departureButton]}
          onPress={() => {
            router.dismissAll();
            router.replace({
              pathname: '/quiz',
              params: difficulty ? { category, difficulty } : { category }
            });
          }}
        >
          <Text style={styles.terminalButtonText}>NEXT DEPARTURE →</Text>
        </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 100, // Extra padding for device nav bars
  },
  title: {
    ...TextStyles.terminalHeader,
    color: AppColors.amberGlow,
    marginBottom: 30,
    textAlign: 'center',
  },
  
  // Passport-style card
  passportCard: {
    backgroundColor: AppColors.cardBackgroundTransparent,
    borderWidth: 3,
    borderColor: AppColors.goldAccent,
    borderRadius: 2, // Sharp corners like passport
    padding: 24,
    width: '100%',
    marginBottom: 30,
  },
  
  passportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.goldAccent,
  },
  
  passportTitle: {
    ...TextStyles.passportStamp,
    color: AppColors.goldAccent,
    fontSize: 16,
  },
  
  stampBorder: {
    borderWidth: 2,
    borderColor: AppColors.visaGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    transform: [{ rotate: '15deg' }],
  },
  
  stampText: {
    ...TextStyles.passportStamp,
    color: AppColors.visaGreen,
    fontSize: 12,
  },
  
  // Terminal-style score sections
  scoreSection: {
    marginBottom: 15,
    alignItems: 'center',
  },
  
  terminalLabel: {
    ...TextStyles.terminalNumber,
    color: AppColors.mediumText,
    fontSize: 14,
    marginBottom: 5,
  },
  
  terminalScore: {
    ...TextStyles.scoreDisplay,
    color: AppColors.amberGlow,
    fontSize: 32,
  },
  
  percentageSection: {
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: AppColors.goldAccent,
  },
  
  percentageLabel: {
    ...TextStyles.terminalNumber,
    color: AppColors.mediumText,
    fontSize: 14,
    marginBottom: 8,
  },
  
  percentageValue: {
    ...TextStyles.scoreDisplay,
    color: AppColors.goldAccent,
    fontSize: 42,
  },
  
  detailsSection: {
    marginTop: 15,
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  
  detailLabel: {
    ...TextStyles.documentBody,
    color: AppColors.mediumText,
    fontSize: 14,
  },
  
  detailValue: {
    ...TextStyles.terminalNumber,
    color: AppColors.lightText,
    fontSize: 14,
  },
  
  // Airport terminal-style buttons
  terminalButton: {
    backgroundColor: AppColors.whiteTransparent,
    borderWidth: 2,
    borderColor: AppColors.whiteTransparent2,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 8,
    width: '90%',
    alignItems: 'center',
    // Rectangular, no border radius for terminal feel
  },
  
  departureButton: {
    backgroundColor: AppColors.amberGlow,
    borderColor: AppColors.whiteTransparent2,
  },
  
  terminalButtonText: {
    ...TextStyles.buttonText,
    color: AppColors.lightText,
    letterSpacing: 2,
  },
});
