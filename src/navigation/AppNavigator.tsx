import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Context
import { useApp } from '../context/AppContext';
import { tabIcons } from '../config/app.config';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { AddScreen } from '../screens/AddScreen';
import { CheckScreen } from '../screens/CheckScreen';
import { StatisticsScreen } from '../screens/StatisticsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PassbookManagementScreen } from '../screens/PassbookManagementScreen';
import { RatioSettingsScreen } from '../screens/RatioSettingsScreen';
import { FeedbackScreen } from '../screens/FeedbackScreen';
import { AllTransactionsScreen } from '../screens/AllTransactionsScreen';
import { TransactionDetailScreen } from '../screens/TransactionDetailScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { ThemeSelectionScreen } from '../screens/ThemeSelectionScreen';
import { ThemeProposalsScreen } from '../screens/ThemeProposalsScreen';

// Theme
import { THEME_COLORS } from '../theme/Colors';
import { TYPOGRAPHY } from '../theme/Typography';
import { SPACING } from '../theme/Spacing';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Icons - Using local PNG icons only (no emoji)
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const { config } = useApp();
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  const isDark = ['charcoalViolet', 'forestShadow', 'inkBlack'].includes(config.theme);
  
  // Get icon from config
  const iconConfig = tabIcons[name as keyof typeof tabIcons];
  const iconLocalSource = iconConfig?.localSource;

  // Dynamic gradient colors based on theme
  const gradientColors = isDark
    ? ['rgba(25, 162, 230, 0.2)', 'rgba(25, 162, 230, 0.12)', 'transparent'] as const
    : ['rgba(25, 162, 230, 0.15)', 'rgba(25, 162, 230, 0.08)', 'transparent'] as const;

  return (
    <View style={[
      styles.tabIconContainer,
      focused && styles.tabIconFocused
    ]}>
      {focused && (
        <LinearGradient
          colors={gradientColors}
          style={styles.tabIconBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      <Image
        source={iconLocalSource}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? theme.primary : theme.textSecondary,
          zIndex: 2,
        }}
        resizeMode="contain"
      />
      {focused && (
        <View style={[styles.tabIndicator, { backgroundColor: theme.primary }]} />
      )}
    </View>
  );
};

// Tab Navigator (wrapped in component to use useApp hook)
const TabNavigatorContent = () => {
  const { t, config } = useApp();
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  const isDark = ['charcoalViolet', 'forestShadow', 'inkBlack'].includes(config.theme);
  
  // Dynamic colors based on theme - 深色主�?使用?�色?�景
  const tabBarBackgroundColor = isDark 
    ? 'rgba(20, 20, 25, 0.98)' 
    : 'rgba(255, 255, 255, 0.95)';
  
  const tabBarBorderColor = isDark
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(0, 0, 0, 0.06)';
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar, 
          { 
            backgroundColor: tabBarBackgroundColor,
            borderTopColor: tabBarBorderColor,
            borderTopWidth: 1,
          }
        ],
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Check"
        component={CheckScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="check" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="add" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="statistics" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Wrapper for TabNavigator
const TabNavigator = () => <TabNavigatorContent />;

// Main App Navigator
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="PassbookManagement" component={PassbookManagementScreen} />
        <Stack.Screen name="RatioSettings" component={RatioSettingsScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="ThemeSelection" component={ThemeSelectionScreen} />
        <Stack.Screen name="ThemeProposals" component={ThemeProposalsScreen} />
        <Stack.Screen name="AllTransactions" component={AllTransactionsScreen} />
        <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingBottom: 20,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    minWidth: 48,
    minHeight: 48,
    position: 'relative',
    overflow: 'hidden',
  },
  tabIconBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    zIndex: 1,
  },
  tabIconFocused: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 24,
    height: 3,
    borderRadius: 2,
    zIndex: 3,
  },
});

