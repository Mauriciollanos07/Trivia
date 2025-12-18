import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/Colors';
import { TextStyles } from '@/constants/Typography';

export default function  Categories() {
    const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      > 
        <View style={styles.departureBoard}>
          <Text style={styles.boardTitle}>DEPARTURES</Text>
          <Text style={styles.boardSubtitle}>Choose Your Destination</Text>
        </View>
        {/* Departure board style destination buttons */}
        {[
          { category: 'general', label: 'GENERAL KNOWLEDGE', gate: 'A1' },
          { category: 'sports', label: 'SPORTS', gate: 'B2' },
          { category: 'history', label: 'HISTORY', gate: 'C3' },
          { category: 'science', label: 'SCIENCE', gate: 'D4' },
          { category: 'entertainment: film', label: 'FILMS', gate: 'E5' },
          { category: 'entertainment: television', label: 'TELEVISION', gate: 'F6' },
          { category: 'entertainment: video games', label: 'VIDEO GAMES', gate: 'G7' },
          { category: 'entertainment: music', label: 'MUSIC', gate: 'H8' },
          { category: 'entertainment: books', label: 'BOOKS', gate: 'I9' },
        ].map((destination, index) => (
          <View key={destination.category} style={styles.flightRow}>
            <TouchableOpacity
              style={styles.destinationButton}
              onPress={() => router.push({
                pathname: './quiz',
                params: { category: destination.category }
              })}
            >
              <View style={styles.flightInfo}>
                <Text style={styles.gateNumber}>{destination.gate}</Text>
                <Text style={styles.destinationText}>{destination.label}</Text>
                <Text style={styles.statusText}>BOARDING</Text>
              </View>
              <Text style={styles.arrowText}>→</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.terminalBlack,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  
  // Departure board header
  departureBoard: {
    backgroundColor: AppColors.cardBackground,
    borderWidth: 2,
    borderColor: AppColors.amberGlow,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  
  boardTitle: {
    ...TextStyles.terminalHeader,
    color: AppColors.amberGlow,
    fontSize: 28,
    marginBottom: 5,
  },
  
  boardSubtitle: {
    ...TextStyles.documentBody,
    color: AppColors.mediumText,
    fontSize: 14,
    letterSpacing: 1,
  },
  
  // Flight row styling
  flightRow: {
    width: '100%',
    marginVertical: 4,
  },
  
  destinationButton: {
    backgroundColor: AppColors.cardBackground,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.amberGlow,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  flightInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  gateNumber: {
    ...TextStyles.terminalNumber,
    color: AppColors.goldAccent,
    fontSize: 16,
    width: 40,
    textAlign: 'center',
  },
  
  destinationText: {
    ...TextStyles.buttonText,
    color: AppColors.lightText,
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  
  statusText: {
    ...TextStyles.passportStamp,
    color: AppColors.visaGreen,
    fontSize: 12,
    marginRight: 10,
  },
  
  arrowText: {
    ...TextStyles.terminalNumber,
    color: AppColors.amberGlow,
    fontSize: 20,
  },
});