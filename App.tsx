import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AppProvider, useApp } from './src/context/AppContext';
import { THEME_COLORS, isDarkTheme } from './src/theme/Colors';

function AppContent() {
  const { config } = useApp();
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  const isDark = isDarkTheme(config.theme);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar 
        style={isDark ? "light" : "dark"} 
        backgroundColor={theme.background}
        translucent 
      />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
