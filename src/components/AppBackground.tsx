import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { BACKGROUND_THEMES } from '../models/BackgroundTheme';

interface AppBackgroundProps {
  children: React.ReactNode;
}

export const AppBackground: React.FC<AppBackgroundProps> = ({ children }) => {
  const { config } = useApp();
  
  // 找到當前選擇的背景主題
  const currentTheme = BACKGROUND_THEMES.find(
    theme => theme.id === (config.backgroundThemeId || 'none')
  ) || BACKGROUND_THEMES[0];

  // 如果沒有背景圖片，直接返回子組件
  if (!currentTheme.imageSource) {
    return <>{children}</>;
  }

  // 有背景圖片時，使用 ImageBackground
  return (
    <ImageBackground
      source={currentTheme.imageSource}
      style={styles.background}
      resizeMode="cover"
    >
      {/* 濾鏡層 */}
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: currentTheme.overlayColor,
            opacity: currentTheme.overlayOpacity,
          },
        ]}
      />
      {/* 內容 */}
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
