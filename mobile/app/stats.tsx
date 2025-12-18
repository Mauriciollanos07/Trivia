import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserStats, UserStats, fetchGeneralStats, GeneralStats } from '@/services/api';
import { AppColors } from '@/constants/Colors';
import { TextStyles } from '@/constants/Typography';

export default function Stats() {
  const [nickname, setNickname] = useState<string>('');

  // get color dynamically
  function getScoreStyle(score: number) {
    if (score >= 8) return styles.high;
    if (score >= 5) return styles.medium;
    return styles.low;
  }

  type StatsOption = 'summary' | 'games';
  const [ statsOption, setStatsOption ] = useState<StatsOption>('summary');
  const [ userStats, setUserStats ] = useState<UserStats | null>(null);
  const [ generalStats, setGeneralStats ] = useState<GeneralStats[] | null>(null);

 // load stats when the component mounts
 useEffect(() => {
   const loadNickname = async () => {
     try {
       const savedNickname = await AsyncStorage.getItem('player_nickname');
       setNickname(savedNickname || 'Guest');
     } catch (error) {
       console.error('Error loading nickname:', error);
     }
   };

   const loadStats = async () => {
     try {
       const stats = await fetchUserStats();
       console.log('User Stats:', stats);
       setUserStats(stats);
     } catch (error) {
       console.error('Error fetching user stats:', error);
     }
   };

   const loadGeneralStats = async () => {
     try {
       const scores= await fetchGeneralStats();
       console.log('Scores:', scores);
       setGeneralStats(scores);
     } catch (error) {
       console.error('Error fetching general stats:', error);
     }
   };
   
   loadNickname();
   loadGeneralStats();
   loadStats();
 }, []);

 const handleOptionChange = () => {
   setStatsOption(statsOption === 'summary' ? 'games' : 'summary');
 };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ title: 'Travel Log' }} />
      <ScrollView>
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>TRAVEL LOG</Text>
          <Text style={styles.travelerName}>{nickname?.toUpperCase()}</Text>
        </View>
      
      {userStats === null || generalStats === null ? (
        <View style={styles.emptyLogCard}>
          <Text style={styles.emptyLogText}>NO JOURNEYS RECORDED</Text>
          <Text style={styles.emptyLogSubtext}>Complete your first trivia journey to see travel statistics</Text>
        </View>
      ) : (
        <>
          <View style={styles.terminalTabs}>
            <TouchableOpacity 
              style={[styles.terminalTab, statsOption === 'summary' && styles.activeTab]}
              onPress={handleOptionChange}
              disabled={statsOption === 'summary'}
            >
              <Text style={[styles.tabText, statsOption === 'summary' && styles.activeTabText]}>PASSPORT</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.terminalTab, statsOption === 'games' && styles.activeTab]}
              onPress={handleOptionChange}
              disabled={statsOption === 'games'}
            >
              <Text style={[styles.tabText, statsOption === 'games' && styles.activeTabText]}>FLIGHTS</Text>
            </TouchableOpacity>
          </View>
          
          {statsOption === 'summary' ? (
            <View style={styles.passportPage}>
              <Text style={styles.passportSectionTitle}>TRAVELER STATISTICS</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{userStats.total_games}</Text>
                  <Text style={styles.statLabel}>JOURNEYS</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{userStats.total_questions}</Text>
                  <Text style={styles.statLabel}>CHALLENGES</Text>
                </View>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{userStats.correct_answers}</Text>
                  <Text style={styles.statLabel}>ACHIVED</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{(userStats.accuracy || 0).toFixed(1)}%</Text>
                  <Text style={styles.statLabel}>SUCCESS RATE</Text>
                </View>
              </View>
              
              <View style={styles.scoreSection}>
                <Text style={styles.scoreSectionTitle}>PERFORMANCE RECORDS</Text>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>AVG FLIGHT SCORE:</Text>
                  <Text style={[styles.scoreValue, getScoreStyle((userStats.average_normal_score || 0) / 10)]}>
                    {(userStats.average_normal_score || 0).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>AVG TRIVIALER SCORE:</Text>
                  <Text style={[styles.scoreValue, getScoreStyle((userStats.average_trivialer_score || 0) / 10)]}>
                    {(userStats.average_trivialer_score || 0).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>BEST FLIGHT:</Text>
                  <Text style={[styles.scoreValue, getScoreStyle((userStats.highest_normal_score || 0) / 10)]}>
                    {userStats.highest_normal_score || 0}
                  </Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>BEST TRIVIALER SCORE:</Text>
                  <Text style={[styles.scoreValue, getScoreStyle((userStats.highest_trivialer_score || 0) / 10)]}>
                    {userStats.highest_trivialer_score || 0}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.flightLog}>
              <Text style={styles.passportSectionTitle}>FLIGHT HISTORY</Text>
              {generalStats.length === 0 ? (
                <View style={styles.emptyLogCard}>
                  <Text style={styles.emptyLogText}>NO FLIGHTS RECORDED</Text>
                </View>
              ) : (
                generalStats.map((stat, index) => (
                  <View key={index} style={styles.flightCard}>
                    <View style={styles.flightHeader}>
                      <Text style={styles.flightDate}>{stat.date}</Text>
                      <View style={styles.flightStamp}>
                        <Text style={styles.stampText}>COMPLETED</Text>
                      </View>
                    </View>
                    <View style={styles.flightDetails}>
                      <Text style={styles.flightDetail}>DESTINATION: {stat.category?.toUpperCase()}</Text>
                      <Text style={styles.flightDetail}>CLASS: LEVEL {stat.difficulty}</Text>
                      <Text style={styles.flightDetail}>CHALLENGES: {stat.questions_answered}</Text>
                      <Text style={styles.flightDetail}>ACHIVED: {stat.questions_correct}</Text>
                      <Text style={styles.flightDetail}>TRIVIALER SCORE: {stat.trivialer_score}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </>
      )}
      </ScrollView>
    </View>
    
)}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: AppColors.terminalBlack,
  },
  
  // Header
  logHeader: {
    backgroundColor: AppColors.cardBackground,
    borderWidth: 2,
    borderColor: AppColors.amberGlow,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  
  logTitle: {
    ...TextStyles.terminalHeader,
    color: AppColors.amberGlow,
    fontSize: 28,
    marginBottom: 8,
  },
  
  travelerName: {
    ...TextStyles.terminalNumber,
    color: AppColors.goldAccent,
    fontSize: 16,
  },
  
  // Empty state
  emptyLogCard: {
    backgroundColor: AppColors.passportBlue,
    borderWidth: 2,
    borderColor: AppColors.goldAccent,
    padding: 30,
    margin: 20,
    alignItems: 'center',
  },
  
  emptyLogText: {
    ...TextStyles.terminalHeader,
    color: AppColors.goldAccent,
    fontSize: 18,
    marginBottom: 10,
  },
  
  emptyLogSubtext: {
    ...TextStyles.documentBody,
    color: AppColors.mediumText,
    fontSize: 14,
    textAlign: 'center',
  },
  
  // Terminal tabs
  terminalTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  
  terminalTab: {
    flex: 1,
    backgroundColor: AppColors.cardBackground,
    borderWidth: 2,
    borderColor: AppColors.mediumText,
    paddingVertical: 12,
    alignItems: 'center',
  },
  
  activeTab: {
    backgroundColor: AppColors.amberGlow,
    borderColor: AppColors.goldAccent,
  },
  
  tabText: {
    ...TextStyles.buttonText,
    color: AppColors.mediumText,
    fontSize: 14,
  },
  
  activeTabText: {
    color: AppColors.lightText,
  },
  
  // Passport page
  passportPage: {
    margin: 20,
  },
  
  passportSectionTitle: {
    ...TextStyles.passportStamp,
    color: AppColors.goldAccent,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  
  statCard: {
    flex: 1,
    backgroundColor: AppColors.passportBlue,
    borderWidth: 2,
    borderColor: AppColors.goldAccent,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  
  statNumber: {
    ...TextStyles.scoreDisplay,
    color: AppColors.amberGlow,
    fontSize: 32,
    marginBottom: 5,
  },
  
  statLabel: {
    ...TextStyles.passportStamp,
    color: AppColors.mediumText,
    fontSize: 12,
  },
  
  // Score section
  scoreSection: {
    backgroundColor: AppColors.passportBlue,
    borderWidth: 2,
    borderColor: AppColors.goldAccent,
    padding: 20,
    marginTop: 10,
  },
  
  scoreSectionTitle: {
    ...TextStyles.passportStamp,
    color: AppColors.goldAccent,
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  scoreLabel: {
    ...TextStyles.documentBody,
    color: AppColors.mediumText,
    fontSize: 14,
  },
  
  scoreValue: {
    ...TextStyles.terminalNumber,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Flight log
  flightLog: {
    margin: 20,
  },
  
  flightCard: {
    backgroundColor: AppColors.passportBlue,
    borderWidth: 2,
    borderColor: AppColors.goldAccent,
    padding: 20,
    marginBottom: 15,
  },
  
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  flightDate: {
    ...TextStyles.terminalNumber,
    color: AppColors.lightText,
    fontSize: 16,
  },
  
  flightStamp: {
    borderWidth: 2,
    borderColor: AppColors.visaGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    transform: [{ rotate: '15deg' }],
  },
  
  stampText: {
    ...TextStyles.passportStamp,
    color: AppColors.visaGreen,
    fontSize: 10,
  },
  
  flightDetails: {
    gap: 8,
  },
  
  flightDetail: {
    ...TextStyles.documentBody,
    color: AppColors.mediumText,
    fontSize: 14,
  },
  
  // Score colors
  high: { color: AppColors.visaGreen },
  medium: { color: AppColors.lightText },
  low: { color: AppColors.alertRed },
});
