import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <View style={{ flex: 1 }}>
        <AppNavigator />
        <StatusBar style="light" backgroundColor="transparent" translucent />
      </View>
    </AppProvider>
  );
}
