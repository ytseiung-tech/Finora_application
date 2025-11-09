import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  // Clean solid background for selected icon - no glass effect
  const focusedBackgroundColor = isDark ? '#2D2D35' : '#E9E9F2';
  
  // Neutral icon colors
  const inactiveIconColor = isDark ? '#C9CAD1' : '#8A8A99';

  return (
    <View style={[
      styles.tabIconContainer,
      focused && [styles.tabIconFocused, { backgroundColor: focusedBackgroundColor }]
    ]}>
      <Image
        source={iconLocalSource}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? theme.primary : inactiveIconColor,
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
  const insets = useSafeAreaInsets();
  
  // Clean, solid colors - no transparency
  const tabBarBackgroundColor = isDark 
    ? '#121216'  // 深色主題：純深灰，OLED 乾淨黑
    : '#F8F8FA';  // 淺色主題：略灰白，亮但不刺
  
  // Neutral icon colors
  const inactiveIconColor = isDark ? '#C9CAD1' : '#8A8A99';
  
  // Shadow settings for depth
  const shadowOpacity = isDark ? 0.6 : 0.04;
  const shadowRadius = isDark ? 20 : 12;
  const shadowOffset = isDark ? -6 : -4;
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar, 
          { 
            backgroundColor: tabBarBackgroundColor,
            borderTopWidth: 0,
            paddingBottom: insets.bottom || (Platform.OS === 'ios' ? 10 : 8),
            height: 70 + (insets.bottom || (Platform.OS === 'ios' ? 10 : 8)),
            shadowColor: '#000',
            shadowOpacity: shadowOpacity,
            shadowRadius: shadowRadius,
            shadowOffset: { width: 0, height: shadowOffset },
            elevation: isDark ? 12 : 8,
          }
        ],
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: inactiveIconColor,
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
    position: 'absolute',
    // Shadow 樣式在 screenOptions 中動態設置
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
  },
  tabIconFocused: {
    // backgroundColor is set dynamically in component
    // No shadow, no border - clean solid background
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
