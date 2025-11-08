import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AppProvider, useApp } from './src/context/AppContext';

function AppContent() {
  const { config } = useApp();
  const isDark = ['cinderSmoke', 'duskIndigo', 'charcoalFrost'].includes(config.theme);

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor="transparent" translucent />
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
