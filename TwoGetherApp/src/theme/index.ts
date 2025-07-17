import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3', // Blue from logo
    secondary: '#8BC34A', // Green from logo
    tertiary: '#FF4081', // Pink accent for romantic touches
    error: '#F44336',
    background: '#F5F5F5', // Light gray background
    surface: '#FFFFFF',
    surfaceVariant: '#E3F2FD', // Light blue tint
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',
  },
  roundness: 12,
};

export const colors = {
  primary: '#2196F3', // Blue from logo
  secondary: '#8BC34A', // Green from logo
  tertiary: '#FF4081', // Pink for romantic elements
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceVariant: '#E3F2FD', // Light blue tint
  text: '#1C1B1F',
  textSecondary: '#49454F',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  border: '#E0E0E0',
  heart: '#FF1744', // For heart icons and love-related UI
  // Partner specific colors
  partnerOne: '#2196F3', // Blue partner
  partnerTwo: '#8BC34A', // Green partner
}; 