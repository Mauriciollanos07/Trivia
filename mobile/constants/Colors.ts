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
  logoBackGround: '#010141',   // Logo background blue
  
  // Text colors
  lightText: '#ffffff',         // Pure white for dark backgrounds
  darkText: '#0f1419',          // Very dark for light backgrounds
  mediumText: '#a8b5d1',        // Lighter muted blue for better contrast
  
  // Accent colors - Airport & Travel themed
  amberGlow: '#d4af37',         // Airport lighting amber
  goldAccent: '#d4af37',        // Premium travel gold
  visaGreen: '#27ae60',         // Visa approved green
  alertRed: '#e74c3c',          // Emergency/danger red
  
  // Button colors
  primaryButton: '#00969b',     // Light blue (start of gradient blue)
  secondaryButton: '#ee366d',   // Magenta (start of gradient magenta)
  successButton: '#27ae60',     // Visa green
  darkSuccessButton: '#1e7e34', // Darker green for success
  dangerButton: '#e74c3c',      // Alert red
  darkerDangerButton: '#c82333', // Darker red for danger
  disabledButton: '#5a6c7d',    // Muted gray
  
  // UI elements
  cardBackground: '#1e3a5f',    // Card background blue
  borderColor: '#d4af37',       // Gold accent borders
  inputBorder: '#8b9dc3',       // Muted blue borders
  inputBackground: '#1e3a5f',   // Passport blue inputs
  lightButtonBackground: '#e8e9eb', // Boarding gray buttons
  darkButtonBackground: '#0f1419',  // Terminal black buttons
  
  // Transparent variants for containers
  passportBlueTransparent: 'rgba(30, 58, 95, 0.4)',     // Semi-transparent passport blue
  cardBackgroundTransparent: 'rgba(30, 58, 95, 0.3)',    // Semi-transparent card background
  overlayTransparent: 'rgba(0, 0, 0, 0.2)',              // Subtle dark overlay
  magentaTransparent: 'rgba(238, 54, 109, 0.4)',         // Semi-transparent magenta
  lightMagentaTransparent: 'rgba(245, 150, 163, 0.4)',    // Lighter semi-transparent magenta
  lightBlueTransparent: 'rgba(0, 150, 155, 0.4)',       // Semi-transparent light blue
  logoBackgroundTransparent: 'rgba(1, 1, 65, 0.4)', // Semi-transparent logo blue
  whiteTransparent: 'rgba(255, 255, 255, 0.15)',        // Semi-transparent white
  whiteTransparent2: 'rgba(255, 255, 255, 0.4)',        // Slightly less transparent white
}

// Gradient color schemes
export const GradientColors: Record<'blue' | 'magenta' | 'darkBlue' | 'blueToLightBlue' | 'magentaToLightBlue', [string, string]> = {
  blue: ['#00969b', '#82b7bc'],
  magenta: ['#ee366d', '#f596a3'],
  darkBlue: ['#142575', '#0071bd'],
  blueToLightBlue: ['#0071bd', '#00969b'],
  magentaToLightBlue: ['#ee366d', '#00969b']
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
