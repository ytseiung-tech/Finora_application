import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TriangleColorPicker from 'react-native-wheel-color-picker';
import { useApp } from '../context/AppContext';
import { THEME_COLORS } from '../theme/Colors';
import { translations } from '../config/app.config';
import { GlassButton } from '../components/GlassButton';
import { FEEDBACK_CONFIG, DISCORD_COLORS } from '../config/feedback.config';

interface ThemeProposalsScreenProps {
  navigation: any;
}
interface CustomColors {
  background: string;
  card: string;
  cardAlt: string;
  glass: string;
  text: string;
  textSecondary: string;
  primary: string;
  primarySoft: string;
  accent: string;
  border: string;
  bottomBar: string;
  success: string;
  error: string;
}

// Color Input Component - 獨立出來避免重新渲染問題
const ColorInput = React.memo(({ 
  label, 
  colorKey, 
  colors, 
  theme, 
  updateColor, 
  openColorPicker, 
  isValidHex 
}: { 
  label: string; 
  colorKey: keyof CustomColors;
  colors: CustomColors;
  theme: any;
  updateColor: (key: keyof CustomColors, value: string) => void;
  openColorPicker: (key: keyof CustomColors) => void;
  isValidHex: (hex: string) => boolean;
}) => (
  <View style={styles.colorInputContainer}>
    <Text style={[styles.colorLabel, { color: theme.text }]}>{label}</Text>
    <View style={styles.colorInputRow}>
      <TextInput
        style={[
          styles.colorInput,
          { 
            backgroundColor: theme.card, 
            borderColor: isValidHex(colors[colorKey]) ? theme.border : theme.error,
            color: theme.text 
          }
        ]}
        value={colors[colorKey]}
        onChangeText={(value) => updateColor(colorKey, value)}
        placeholder="#FFFFFF"
        placeholderTextColor={theme.textSecondary}
        maxLength={7}
        autoCapitalize="characters"
      />
      <TouchableOpacity 
        style={[styles.colorPickerButton, { backgroundColor: theme.primary }]}
        onPress={() => openColorPicker(colorKey)}
      >
        <Image 
          source={require('../../assets/color-palette.png')} 
          style={styles.colorPickerIcon}
        />
      </TouchableOpacity>
      <View style={[styles.colorPreview, { backgroundColor: isValidHex(colors[colorKey]) ? colors[colorKey] : '#999' }]} />
    </View>
  </View>
));

export const ThemeProposalsScreen: React.FC<ThemeProposalsScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  
  const [themeName, setThemeName] = useState('');
  const [themeEmoji, setThemeEmoji] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentEditingColor, setCurrentEditingColor] = useState<keyof CustomColors | null>(null);
  const [tempColor, setTempColor] = useState('#FFFFFF');
  const [colors, setColors] = useState<CustomColors>({
    background: '#FFFFFF',
    card: '#FFFFFF',
    cardAlt: '#FFFFFF',
    glass: '#FFFFFF',
    text: '#FFFFFF',
    textSecondary: '#FFFFFF',
    primary: '#FFFFFF',
    primarySoft: '#FFFFFF',
    accent: '#FFFFFF',
    border: '#FFFFFF',
    bottomBar: '#FFFFFF',
    success: '#FFFFFF',
    error: '#FFFFFF',
  });

  const isValidHex = (hex: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  const updateColor = (key: keyof CustomColors, value: string) => {
    setColors({ ...colors, [key]: value });
  };

  const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const resetColors = () => {
    setColors({
      background: getRandomColor(),
      card: getRandomColor(),
      cardAlt: getRandomColor(),
      glass: getRandomColor(),
      text: getRandomColor(),
      textSecondary: getRandomColor(),
      primary: getRandomColor(),
      primarySoft: getRandomColor(),
      accent: getRandomColor(),
      border: getRandomColor(),
      bottomBar: getRandomColor(),
      success: getRandomColor(),
      error: getRandomColor(),
    });
  };

  const openColorPicker = (colorKey: keyof CustomColors) => {
    setCurrentEditingColor(colorKey);
    setTempColor(colors[colorKey]);
    setShowColorPicker(true);
  };

  const closeColorPicker = () => {
    setShowColorPicker(false);
    setCurrentEditingColor(null);
  };

  const confirmColorChange = () => {
    if (currentEditingColor) {
      updateColor(currentEditingColor, tempColor);
    }
    closeColorPicker();
  };

  const submitTheme = async () => {
    if (!themeName.trim()) {
      Alert.alert(t.error, t.themeNameRequired);
      return;
    }

    if (!themeEmoji.trim()) {
      Alert.alert(t.error, config.language === 'zh-TW' ? '請輸入主題圖示' : 'Please enter theme emoji');
      return;
    }

    const invalidColors = Object.entries(colors).filter(([_, value]) => !isValidHex(value));
    if (invalidColors.length > 0) {
      Alert.alert(t.error, t.ensureValidColors);
      return;
    }

    setSubmitting(true);

    try {
      const embed = {
        title: `${themeEmoji.trim()} ?��?主�??�稿`,
        color: DISCORD_COLORS.THEME_SUBMISSION,
        fields: [
          {
            name: 'Theme name',
            value: themeName.trim(),
            inline: false,
          },
          {
            name: 'Theme emoji',
            value: themeEmoji.trim(),
            inline: false,
          },
          {
            name: 'Background',
            value: colors.background,
            inline: true,
          },
          {
            name: 'Card',
            value: colors.card,
            inline: true,
          },
          {
            name: 'Card Alt',
            value: colors.cardAlt,
            inline: true,
          },
          {
            name: 'Main color',
            value: colors.primary,
            inline: true,
          },
          {
            name: 'Emphazes color',
            value: colors.accent,
            inline: true,
          },
          {
            name: 'Text color',
            value: colors.text,
            inline: true,
          },
          {
            name: 'Border color',
            value: colors.border,
            inline: true,
          },
          {
            name: 'Platform',
            value: 'React Native',
            inline: true,
          },
          {
            name: 'Language',
            value: config.language === 'zh-TW' ? '繁�?中�?' : 'English',
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Finora Custom Theme',
        },
      };

      const response = await fetch(FEEDBACK_CONFIG.THEME_SUBMISSION_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [embed],
        }),
      });

      setSubmitting(false);

      if (response.ok) {
        Alert.alert(t.success, t.themeSubmitted);
        // 清空表單
        setThemeName('');
        setThemeEmoji('');
        setColors({
          background: '#FFFFFF',
          card: '#FFFFFF',
          cardAlt: '#FFFFFF',
          glass: '#FFFFFF',
          text: '#FFFFFF',
          textSecondary: '#FFFFFF',
          primary: '#FFFFFF',
          primarySoft: '#FFFFFF',
          accent: '#FFFFFF',
          border: '#FFFFFF',
          bottomBar: '#FFFFFF',
          success: '#FFFFFF',
          error: '#FFFFFF',
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      setSubmitting(false);
      Alert.alert(t.error, t.themeSubmitFailed);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIcon, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Image 
              source={require('../../assets/customize/upload.png')} 
              style={[styles.headerIcon, { tintColor: theme.text }]}
            />
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {config.language === 'zh-TW' ? '主題提案' : 'Theme Proposal'}
            </Text>
          </View>
          <View style={styles.backButton} />
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Preview */}
          <View style={[styles.previewContainer, { backgroundColor: colors.background }]}>
            <Text style={[styles.previewLabel, { color: colors.text }]}>{t.preview}</Text>
            <View style={{ width: '100%' }}>
              <Text style={[styles.previewTitle, { color: colors.text }]}>Preview Card</Text>
              <Text style={[styles.previewSubtitle, { color: colors.textSecondary }]}>This is how your theme looks</Text>
            </View>
            <TouchableOpacity style={[styles.previewButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.previewButtonText}>Button</Text>
            </TouchableOpacity>
          </View>

          {/* Theme Name */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t.themeName} <Text style={{ color: theme.error }}>*</Text>
            </Text>
            <TextInput
              style={[styles.nameInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              placeholder={config.language === 'zh-TW' ? '輸入主�??�稱...' : 'Enter theme name...'}
              placeholderTextColor={theme.textSecondary}
              value={themeName}
              onChangeText={setThemeName}
            />
          </View>

          {/* Theme Emoji */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t.themeEmoji} <Text style={{ color: theme.error }}>*</Text>
            </Text>
            <TextInput
              style={[styles.nameInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              placeholder={config.language === 'zh-TW' ? '輸入主�??�示...' : 'Enter theme emoji...'}
              placeholderTextColor={theme.textSecondary}
              value={themeEmoji}
              onChangeText={setThemeEmoji}
              maxLength={2}
            />
          </View>

          {/* Color Inputs */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t.colorPalette}
            </Text>
            <ColorInput label={t.background} colorKey="background" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.cardColor} colorKey="card" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.cardAltColor} colorKey="cardAlt" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.glassColor} colorKey="glass" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.textColor} colorKey="text" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.textSecondaryColor} colorKey="textSecondary" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.primaryColor} colorKey="primary" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.primarySoftColor} colorKey="primarySoft" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.accentColor} colorKey="accent" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.borderColor} colorKey="border" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.bottomBarColor} colorKey="bottomBar" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.successColor} colorKey="success" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
            <ColorInput label={t.errorColor} colorKey="error" colors={colors} theme={theme} updateColor={updateColor} openColorPicker={openColorPicker} isValidHex={isValidHex} />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <GlassButton
              title={submitting ? t.submitting : t.submitForReview}
              onPress={submitTheme}
              variant="primary"
              disabled={submitting}
            />
            <View style={{ height: 12 }} />
            <GlassButton
              title={config.language === 'zh-TW' ? '隨機顏色' : 'Random Colors'}
              onPress={resetColors}
              variant="secondary"
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={closeColorPicker}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {config.language === 'zh-TW' ? '選擇顏色' : 'Choose Color'}
            </Text>
            
            <View style={styles.colorPickerContainer}>
              <TriangleColorPicker
                color={tempColor}
                onColorChange={(color: string) => setTempColor(color)}
              />
            </View>

            <View style={styles.colorInputSection}>
              <Text style={[styles.colorInputLabel, { color: theme.text }]}>
                {config.language === 'zh-TW' ? '色碼' : 'Color Code'}
              </Text>
              <TextInput
                style={[
                  styles.modalColorInput,
                  { 
                    backgroundColor: theme.background, 
                    borderColor: isValidHex(tempColor) ? theme.border : theme.error,
                    color: theme.text 
                  }
                ]}
                value={tempColor}
                onChangeText={setTempColor}
                placeholder="#FFFFFF"
                placeholderTextColor={theme.textSecondary}
                maxLength={7}
                autoCapitalize="characters"
              />
              <View style={[styles.colorPreviewLarge, { backgroundColor: isValidHex(tempColor) ? tempColor : '#999' }]} />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.border }]}
                onPress={closeColorPicker}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  {config.language === 'zh-TW' ? '取消' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={confirmColorChange}
              >
                <Text style={styles.modalButtonText}>
                  {config.language === 'zh-TW' ? '確認' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 28,
    fontWeight: '300',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  previewContainer: {
    marginVertical: 16,
    padding: 24,
    borderRadius: 20,
    minHeight: 200,
    alignItems: 'flex-start',
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  previewSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  previewButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  previewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  colorInputContainer: {
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  colorInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'monospace',
  },
  colorPickerButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorPickerIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  colorPreview: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonSection: {
    gap: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  colorPickerContainer: {
    height: 300,
    marginBottom: 20,
  },
  colorInputSection: {
    marginBottom: 20,
  },
  colorInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalColorInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontFamily: 'monospace',
    marginBottom: 12,
    textAlign: 'center',
  },
  colorPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  colorPreviewLabel: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  colorPreviewLarge: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


