import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
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
  borderRadius = 28,
  padding = 16,
  margin = 8,
  elevation = 4,
  variant = 'dark',
}) => {
  const { config } = useApp();
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  const isDark = ['charcoalViolet', 'forestShadow', 'inkBlack'].includes(config.theme);

  // Get background color based on variant and theme
  const getBackgroundColor = () => {
    if (isDark) {
      // 深色主題：極低透明度
      switch (variant) {
        case 'primary':
          return 'rgba(99, 102, 241, 0.06)';
        case 'colored':
          return 'rgba(139, 92, 246, 0.06)';
        default:
          return 'rgba(15, 23, 42, 0.66)';  // 深藍灰，低透明
      }
    } else {
      // 淺色主題
      switch (variant) {
        case 'primary':
          return 'rgba(25, 162, 230, 0.12)';
        case 'light':
          return 'rgba(255, 255, 255, 0.92)';
        default:
          return 'rgba(255, 255, 255, 0.85)';
      }
    }
  };

  const getBorderColor = () => {
    if (isDark) {
      return variant === 'primary' 
        ? 'rgba(99, 102, 241, 0.18)' 
        : 'rgba(255, 255, 255, 0.08)';
    } else {
      return variant === 'primary'
        ? 'rgba(25, 162, 230, 0.25)'
        : 'rgba(0, 0, 0, 0.06)';
    }
  };

  const backgroundColor = getBackgroundColor();
  const borderColor = getBorderColor();

  // Shadow style - 只在 shadowWrapper
  const shadowStyle = elevation > 0 ? {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: elevation * 4.5,
    },
    shadowOpacity: isDark ? 0.35 : 0.12,
    shadowRadius: elevation * 10,
    elevation: elevation * 5.5,
  } : {};

  return (
    <View style={[styles.shadowWrapper, { borderRadius, margin }, shadowStyle, style]}>
      <View style={[styles.card, { borderRadius }]}>
        <View style={[
          styles.content,
          {
            paddingHorizontal: padding,
            paddingVertical: padding,
            backgroundColor,
            borderWidth: 1,
            borderColor,
          }
        ]}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 只有陰影，不能有白底，不能有灰底
  shadowWrapper: {
    backgroundColor: 'transparent',  // ★ 確保是透明
  },
  
  // 真正的卡片，裁切內容
  card: {
    overflow: 'hidden',              // ★ 切掉內容的邊緣
    backgroundColor: 'transparent',  // 不要用白
  },
  
  // 玻璃內層：只有非常淡的底
  content: {
    // backgroundColor 在組件中動態設置
  },
});
