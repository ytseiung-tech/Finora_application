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
    <>
      <StatusBar 
        style={isDark ? "light" : "dark"} 
        backgroundColor="transparent"
        translucent 
      />
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <AppNavigator />
      </View>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
