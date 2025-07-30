import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    primaryContainer: '#eaddff',
    secondary: '#03dac4',
    secondaryContainer: '#e8f5e8',
    surface: '#ffffff',
    surfaceVariant: '#e7e0ec',
    background: '#f6f6f6',
    onBackground: '#1c1b1f',
    onSurface: '#1c1b1f',
    onSurfaceVariant: '#49454f',
    outline: '#79747e',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="auto" />
      <AppNavigator />
    </PaperProvider>
  );
}
