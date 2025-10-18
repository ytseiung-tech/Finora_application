import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BlurredBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'neutral';
}

export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({
  children,
  style,
  variant = 'primary',
}) => {
  const getGradientColors = (): readonly [string, string, string] => {
    switch (variant) {
      case 'primary':
        return [
          'rgba(123, 104, 238, 0.1)',
          'rgba(135, 169, 107, 0.1)',
          'rgba(154, 129, 148, 0.1)',
        ] as const;
      case 'secondary':
        return [
          'rgba(135, 169, 107, 0.1)',
          'rgba(230, 214, 144, 0.1)',
          'rgba(212, 165, 165, 0.1)',
        ] as const;
      case 'neutral':
        return [
          'rgba(184, 184, 184, 0.1)',
          'rgba(255, 255, 255, 0.05)',
          'rgba(184, 184, 184, 0.1)',
        ] as const;
      default:
        return [
          'rgba(123, 104, 238, 0.1)',
          'rgba(135, 169, 107, 0.1)',
          'rgba(154, 129, 148, 0.1)',
        ] as const;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});
