import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { THEME_COLORS } from '../theme/Colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  elevation?: number;
  variant?: 'light' | 'dark' | 'primary' | 'colored';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  borderRadius = 16,
  padding = 16,
  margin = 8,
  elevation = 4,
  variant = 'dark',
}) => {
  const { config } = useApp();
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  const isDark = ['charcoalViolet', 'forestShadow', 'inkBlack'].includes(config.theme);

  const getGradientColors = (): readonly [string, string, string] => {
    switch (variant) {
      case 'light':
        return isDark
          ? ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.04)'] as const
          : ['rgba(255, 255, 255, 0.95)', 'rgba(252, 252, 252, 0.9)', 'rgba(248, 248, 248, 0.85)'] as const;
      case 'dark':
        return isDark
          ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.03)'] as const
          : ['rgba(255, 255, 255, 0.95)', 'rgba(252, 252, 252, 0.9)', 'rgba(248, 248, 248, 0.85)'] as const;
      case 'primary':
        return isDark
          ? ['rgba(99, 102, 241, 0.12)', 'rgba(99, 102, 241, 0.10)', 'rgba(99, 102, 241, 0.08)'] as const
          : ['rgba(25, 162, 230, 0.25)', 'rgba(25, 162, 230, 0.18)', 'rgba(25, 162, 230, 0.12)'] as const;
      case 'colored':
        return isDark
          ? ['rgba(139, 92, 246, 0.12)', 'rgba(34, 197, 94, 0.10)', 'rgba(99, 102, 241, 0.08)'] as const
          : ['rgba(123, 104, 238, 0.3)', 'rgba(135, 169, 107, 0.25)', 'rgba(154, 129, 148, 0.2)'] as const;
      default:
        return isDark
          ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.03)'] as const
          : ['rgba(255, 255, 255, 0.95)', 'rgba(252, 252, 252, 0.9)', 'rgba(248, 248, 248, 0.85)'] as const;
    }
  };

  const getBorderColor = () => {
    if (variant === 'primary') {
      return isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(25, 162, 230, 0.3)';
    }
    return isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  };

  const getHighlightColors = (): readonly [string, string] => {
    return isDark
      ? ['rgba(255, 255, 255, 0.04)', 'transparent'] as const
      : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.3)'] as const;
  };

  const gradientColors = getGradientColors();
  const borderColor = getBorderColor();
  const highlightColors = getHighlightColors();

  // Shadow style based on elevation
  const shadowStyle = elevation > 0 ? {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: elevation / 2,
    },
    shadowOpacity: isDark ? 0.4 : 0.1,
    shadowRadius: elevation * (isDark ? 1.5 : 1),
    elevation: elevation,
  } : {};

  return (
    <View style={[styles.container, { margin }, shadowStyle, style]}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.gradient, { borderRadius, padding, borderColor }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Top highlight for glass reflection */}
        <LinearGradient
          colors={highlightColors}
          style={[styles.topHighlight, { borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        
        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  gradient: {
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 2,
  },
});
