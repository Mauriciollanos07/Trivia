/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Travel-themed color scheme
export const AppColors = {
  // Main backgrounds - Passport & Travel Document colors
  passportBlue: '#1e3a5f',      // Deep passport blue
  documentCream: '#f8f6f0',     // Aged document paper
  terminalBlack: '#0f1419',     // Airport terminal dark
  boardingGray: '#2a3441',      // Boarding gate gray
  
  // Text colors
  lightText: '#ffffff',         // Pure white for dark backgrounds
  darkText: '#0f1419',          // Very dark for light backgrounds
  mediumText: '#a8b5d1',        // Lighter muted blue for better contrast
  
  // Accent colors - Airport & Travel themed
  amberGlow: '#ff8c42',         // Airport lighting amber
  goldAccent: '#d4af37',        // Premium travel gold
  visaGreen: '#27ae60',         // Visa approved green
  alertRed: '#e74c3c',          // Emergency/danger red
  
  // Button colors
  primaryButton: '#ff8c42',     // Amber glow
  secondaryButton: '#8b9dc3',   // Muted blue
  successButton: '#27ae60',     // Visa green
  dangerButton: '#e74c3c',      // Alert red
  disabledButton: '#5a6c7d',    // Muted gray
  
  // UI elements
  cardBackground: '#2a3441',    // Boarding gate gray
  borderColor: '#d4af37',       // Gold accent borders
  inputBorder: '#8b9dc3',       // Muted blue borders
  inputBackground: '#1e3a5f',   // Passport blue inputs
}

const tintColorLight = '#3498db';
const tintColorDark = '#ecf0f1';

export const Colors = {
  light: {
    text: '#ecf0f1',
    background: '#2c3e50',
    tint: tintColorLight,
    icon: '#bdc3c7',
    tabIconDefault: '#7f8c8d',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ecf0f1',
    background: '#1a2530',
    tint: tintColorDark,
    icon: '#bdc3c7',
    tabIconDefault: '#7f8c8d',
    tabIconSelected: tintColorDark,
  },
};
