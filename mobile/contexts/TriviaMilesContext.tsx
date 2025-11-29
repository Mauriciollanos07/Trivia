import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TriviaMilesContextType {
  miles: number;
  useMile: () => void;
  addMile: () => void;
  resetMiles: () => void;
}

const TriviaMilesContext = createContext<TriviaMilesContextType | undefined>(undefined);

const STORAGE_KEY = 'trivia_miles';
const INITIAL_MILES = 10;

export const TriviaMilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [miles, setMiles] = useState(INITIAL_MILES);

  useEffect(() => {
    loadMiles();
  }, []);

  const loadMiles = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setMiles(parseInt(stored, 10));
      }
    } catch (error) {
      console.error('Error loading miles:', error);
    }
  };

  const saveMiles = async (newMiles: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMiles.toString());
    } catch (error) {
      console.error('Error saving miles:', error);
    }
  };

  const useMile = () => {
    if (miles > 0) {
      const newMiles = miles - 1;
      setMiles(newMiles);
      saveMiles(newMiles);
    }
  };

  const addMile = () => {
    const newMiles = miles + 1;
    setMiles(newMiles);
    saveMiles(newMiles);
  };

  const resetMiles = () => {
    setMiles(INITIAL_MILES);
    saveMiles(INITIAL_MILES);
  };

  return (
    <TriviaMilesContext.Provider value={{ miles, useMile, addMile, resetMiles }}>
      {children}
    </TriviaMilesContext.Provider>
  );
};

export const useTriviaMiles = () => {
  const context = useContext(TriviaMilesContext);
  if (!context) {
    throw new Error('useTriviaMiles must be used within a TriviaMilesProvider');
  }
  return context;
};