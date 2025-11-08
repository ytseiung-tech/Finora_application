import React from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BlurredBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'neutral' | 'dark';
  animated?: boolean;
}

export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({
  children,
  style,
  variant = 'primary',
  animated = false,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [animated, fadeAnim]);

  const getGradientColors = (): readonly [string, string, string, string] => {
    switch (variant) {
      case 'primary':
        return [
          'rgba(25, 162, 230, 0.08)',
          'rgba(123, 104, 238, 0.06)',
          'rgba(135, 169, 107, 0.06)',
          'rgba(154, 129, 148, 0.08)',
        ] as const;
      case 'secondary':
        return [
          'rgba(135, 169, 107, 0.08)',
          'rgba(230, 214, 144, 0.06)',
          'rgba(212, 165, 165, 0.06)',
          'rgba(184, 184, 184, 0.08)',
        ] as const;
      case 'neutral':
        return [
          'rgba(184, 184, 184, 0.05)',
          'rgba(255, 255, 255, 0.03)',
          'rgba(200, 200, 200, 0.04)',
          'rgba(184, 184, 184, 0.05)',
        ] as const;
      case 'dark':
        return [
          'rgba(17, 21, 24, 0.98)',
          'rgba(26, 42, 50, 0.95)',
          'rgba(41, 51, 56, 0.92)',
          'rgba(17, 21, 24, 0.98)',
        ] as const;
      default:
        return [
          'rgba(25, 162, 230, 0.08)',
          'rgba(123, 104, 238, 0.06)',
          'rgba(135, 169, 107, 0.06)',
          'rgba(154, 129, 148, 0.08)',
        ] as const;
    }
  };

  const content = (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.33, 0.66, 1]}
      >
        {/* Glass overlay for depth */}
        <View style={styles.glassOverlay} />
        {children}
      </LinearGradient>
    </View>
  );

  if (animated) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {content}
      </Animated.View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
});
