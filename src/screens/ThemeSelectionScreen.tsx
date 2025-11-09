import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';
import { ThemePreview } from '../components/ThemePreview';

interface ThemeSelectionScreenProps {
  navigation: any;
}

const THEME_LIST = [
  { key: 'mistBlue', icon: '🌫️', desc: 'Soft & Calm' },
  { key: 'lavenderSmoke', icon: '💜', desc: 'Gentle Purple' },
  { key: 'roseDust', icon: '🌹', desc: 'Warm & Tender' },
  { key: 'oliveGray', icon: '🫒', desc: 'Natural Neutral' },
  { key: 'sandBeige', icon: '🏖️', desc: 'Warm Sand' },
  { key: 'seafoamGreen', icon: '🌊', desc: 'Fresh Ocean' },
  { key: 'cloudGray', icon: '☁️', desc: 'Light & Airy' },
  { key: 'plumNight', icon: '🌆', desc: 'Deep Purple' },
  { key: 'mintFrost', icon: '🍃', desc: 'Cool Mint' },
  { key: 'coralClay', icon: '🪸', desc: 'Soft Coral' },
  { key: 'sageGreen', icon: '🌿', desc: 'Herbal Green' },
  { key: 'denimBlue', icon: '👖', desc: 'Classic Denim' },
  { key: 'mochaCream', icon: '☕', desc: 'Warm Coffee' },
  { key: 'tealOcean', icon: '💎', desc: 'Deep Teal' },
  { key: 'amberDawn', icon: '🌅', desc: 'Golden Hour' },
  { key: 'charcoalViolet', icon: '🖤', desc: 'Dark Violet' },
  { key: 'icePink', icon: '🧊', desc: 'Cool Pink' },
  { key: 'skyGray', icon: '🌤️', desc: 'Overcast Sky' },
  { key: 'forestShadow', icon: '🌲', desc: 'Forest Green' },
  { key: 'inkBlack', icon: '🖋️', desc: 'Pure Dark' },
] as const;

export const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({ navigation }) => {
  const { config, updateTheme } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  
  // 判斷是否為深色模式
  const isDarkMode = ['charcoalViolet', 'forestShadow', 'inkBlack'].includes(config.theme);

  const handleThemeSelect = async (themeKey: string) => {
    await updateTheme(themeKey as any);
  };

  const getThemeName = (themeKey: string) => {
    const key = themeKey as keyof typeof t;
    return t[key] || themeKey;
  };

  const getThemeColors = (themeKey: string) => {
    const themeColors = THEME_COLORS[themeKey as keyof typeof THEME_COLORS];
    return themeColors || THEME_COLORS.mistBlue;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 統一 Header 規格 */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background }}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIcon, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{t.selectTheme}</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      {/* 內容區域 */}
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridContainer}>
            {THEME_LIST.map((item, index) => {
              const themeColors = getThemeColors(item.key);
              const isSelected = config.theme === item.key;
              
              return (
                <Pressable
                  key={item.key}
                  style={({ pressed }) => [
                    styles.themeCard,
                    { 
                      backgroundColor: theme.card,
                      borderColor: isSelected ? theme.primary : theme.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                    isSelected && styles.themeCardSelected,
                  ]}
                  onPress={() => handleThemeSelect(item.key)}
                >
                  {/* 上方：圖標 + 名稱 (30%) */}
                  <View style={styles.themeHeader}>
                    <Text style={styles.themeIcon}>{item.icon}</Text>
                    <Text 
                      style={[styles.themeName, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {getThemeName(item.key)}
                    </Text>
                    {item.desc && (
                      <Text 
                        style={[styles.themeDesc, { color: theme.textSecondary }]}
                        numberOfLines={1}
                      >
                        {item.desc}
                      </Text>
                    )}
                  </View>

                  {/* 中間：預覽縮圖 (50%) */}
                  <View style={styles.previewContainer}>
                    <ThemePreview theme={themeColors} />
                  </View>

                  {/* 底部：三顆顏色點 (20%) */}
                  <View style={styles.paletteRow}>
                    <View style={[styles.colorDot, { backgroundColor: themeColors.background }]} />
                    <View style={[styles.colorDot, { backgroundColor: themeColors.primary }]} />
                    <View style={[styles.colorDot, { backgroundColor: themeColors.accent }]} />
                  </View>

                  {/* 選中標記 */}
                  {isSelected && (
                    <View style={[styles.selectedBadge, { backgroundColor: theme.primary }]}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Theme Proposal Button */}
          <TouchableOpacity
            style={[styles.customThemeCard, { backgroundColor: theme.card, borderColor: theme.primary }]}
            onPress={() => navigation.navigate('ThemeProposals')}
            activeOpacity={0.7}
          >
            <View style={styles.customThemeContent}>
              <Image 
                source={require('../../assets/customize/upload.png')} 
                style={[styles.customThemeIconImage, isDarkMode && { tintColor: '#FFFFFF' }]}
              />
              <View style={styles.customThemeText}>
                <Text style={[styles.customThemeTitle, { color: theme.text }]}>
                  {config.language === 'zh-TW' ? '主題提案' : 'Theme Proposal'}
                </Text>
                <Text style={[styles.customThemeSubtitle, { color: theme.textSecondary }]}>
                  {config.language === 'zh-TW' ? '提交您的主題設計' : 'Submit your theme design'}
                </Text>
              </View>
              <Text style={[styles.customThemeArrow, { color: theme.primary }]}>→</Text>
            </View>
          </TouchableOpacity>

          {/* 底部留白 */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // ===== 統一 Header 規格 =====
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  
  // ===== 滾動區域 =====
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  
  // ===== 卡片佈局 =====
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    // 統一陰影規格
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  themeCardSelected: {
    borderWidth: 2,
    // Inner shadow 效果
    shadowOpacity: 0.08,
  },
  
  // ===== 上方區域 (30%) =====
  themeHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  themeIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  themeName: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  themeDesc: {
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.7,
  },
  
  // ===== 中間預覽區域 (50%) =====
  previewContainer: {
    marginVertical: 8,
  },
  
  // ===== 底部顏色點 (20%) =====
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  
  // ===== 選中標記 =====
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  
  // ===== 自訂主題卡片 =====
  customThemeCard: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  customThemeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customThemeIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  customThemeIconImage: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  customThemeText: {
    flex: 1,
  },
  customThemeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  customThemeSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  customThemeArrow: {
    fontSize: 24,
    fontWeight: '600',
  },
  
  // ===== 底部留白 =====
  bottomSpacer: {
    height: 24,
  },
});
