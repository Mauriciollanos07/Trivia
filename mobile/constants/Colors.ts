/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// New darker color scheme
export const AppColors = {
  // Main backgrounds
  darkBlue: '#2c3e50',
  darkerBlue: '#34495e',
  darkestBlue: '#1a2530',
  
  // Text colors
  lightText: '#ecf0f1',
  mediumText: '#bdc3c7',
  
  // Button colors
  primaryButton: '#3498db',
  disabledButton: '#7f8c8d',
  successButton: '#4CAF50',
  dangerButton: '#f44336',
  
  // Other UI elements
  inputBorder: '#34495e',
  inputBackground: '#2c3e50',
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
