import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { THEME_COLORS } from '../theme/Colors';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}) => {
  const { config } = useApp();
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  const isDark = ['cinderSmoke', 'duskIndigo', 'charcoalFrost'].includes(config.theme);
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getButtonColors = (): readonly [string, string, string] => {
    // 從主題色提取 RGB 值
    const primaryColor = theme.primary || '#19A2E6';
    
    switch (variant) {
      case 'primary':
        // 使用主題主色
        const r = parseInt(primaryColor.slice(1, 3), 16);
        const g = parseInt(primaryColor.slice(3, 5), 16);
        const b = parseInt(primaryColor.slice(5, 7), 16);
        return [
          `rgba(${r}, ${g}, ${b}, 0.85)`,
          `rgba(${r}, ${g}, ${b}, 0.75)`,
          `rgba(${r}, ${g}, ${b}, 0.65)`
        ] as const;
      case 'secondary':
        return isDark
          ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.04)'] as const
          : ['rgba(0, 0, 0, 0.04)', 'rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.02)'] as const;
      case 'outline':
        return isDark
          ? ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.06)'] as const
          : ['rgba(0, 0, 0, 0.02)', 'rgba(0, 0, 0, 0.015)', 'rgba(0, 0, 0, 0.01)'] as const;
      default:
        const dr = parseInt(primaryColor.slice(1, 3), 16);
        const dg = parseInt(primaryColor.slice(3, 5), 16);
        const db = parseInt(primaryColor.slice(5, 7), 16);
        return [
          `rgba(${dr}, ${dg}, ${db}, 0.85)`,
          `rgba(${dr}, ${dg}, ${db}, 0.75)`,
          `rgba(${dr}, ${dg}, ${db}, 0.65)`
        ] as const;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      return isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
    }
    if (variant === 'secondary') {
      return theme.border || (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)');
    }
    return isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
  };

  const getTextColor = () => {
    if (variant === 'primary') return '#ffffff';
    return theme.text;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32, fontSize: 18 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 };
    }
  };

  const sizeStyles = getSizeStyles();
  const buttonColors = getButtonColors();
  const borderColor = getBorderColor();
  const textColor = getTextColor();

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleValue }] },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={buttonColors}
          style={[
            styles.gradient,
            {
              borderRadius: 16,
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              opacity: disabled ? 0.5 : 1,
              borderColor: borderColor,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text
            style={[
              styles.text,
              {
                fontSize: sizeStyles.fontSize,
                color: textColor,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
