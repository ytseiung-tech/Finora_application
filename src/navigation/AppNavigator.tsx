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

// Theme
import { THEME_COLORS } from '../theme/Colors';
import { TYPOGRAPHY } from '../theme/Typography';
import { SPACING } from '../theme/Spacing';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Icons
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const { config } = useApp();
  const theme = THEME_COLORS[config.theme];
  
  // Get icon from config
  const iconConfig = tabIcons[name as keyof typeof tabIcons];
  const iconLocalSource = iconConfig?.localSource;
  const iconUrl = iconConfig?.url;
  const iconEmoji = iconConfig?.emoji || '?';

  if (iconLocalSource) {
    return (
      <View style={styles.tabIconContainer}>
        <Image
          source={iconLocalSource}
          style={{
            width: 24,
            height: 24,
            tintColor: focused ? theme.primary : theme.textSecondary,
          }}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (iconUrl) {
    return (
      <View style={styles.tabIconContainer}>
        <Image
          source={{ uri: iconUrl }}
          style={{
            width: 24,
            height: 24,
            tintColor: focused ? theme.primary : theme.textSecondary,
          }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.tabIconContainer}>
      <Text style={{
        color: focused ? theme.primary : theme.textSecondary,
        fontSize: 24,
      }}>
        {iconEmoji}
      </Text>
    </View>
  );
};

// Tab Navigator (wrapped in component to use useApp hook)
const TabNavigatorContent = () => {
  const { t, config } = useApp();
  const theme = THEME_COLORS[config.theme];
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: theme.cardSecondary, borderTopColor: theme.border }],
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
        <Stack.Screen name="AllTransactions" component={AllTransactionsScreen} />
        <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    opacity: 1,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    minHeight: 40,
  },
  tabIconFocused: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
});
