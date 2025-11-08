import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import ColorPicker from 'react-native-wheel-color-picker';
import { DataService } from '../services/DataService';
import { Passbook } from '../models/Passbook';
import { GlassButton } from '../components/GlassButton';
import { useApp } from '../context/AppContext';
import { THEME_COLORS } from '../theme/Colors';
import { SPACING, RADIUS, FONT, SHADOW } from '../theme/DesignSystem';
import { translations } from '../config/app.config';

interface PassbookManagementScreenProps {
  navigation: any;
}

const PRESET_COLORS = [
  { name: 'Blue', value: '#7B68EE' },
  { name: 'Green', value: '#87A96B' },
  { name: 'Purple', value: '#9A8194' },
  { name: 'Yellow', value: '#E6D690' },
  { name: 'Pink', value: '#D4A5A5' },
  { name: 'Gray', value: '#B8B8B8' },
  { name: 'Deep Blue', value: '#5A4FCF' },
  { name: 'Muted Green', value: '#6B7B5A' },
  { name: 'Lavender', value: '#B8A8D8' },
  { name: 'Orange', value: '#E89A3C' },
  { name: 'Rose', value: '#E8B4B8' },
  { name: 'Teal', value: '#5F9EA0' },
];

export const PassbookManagementScreen: React.FC<PassbookManagementScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  const [passbooks, setPassbooks] = useState<Passbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPassbook, setEditingPassbook] = useState<Passbook | null>(null);
  const [passbookName, setPassbookName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);
  const [customColor, setCustomColor] = useState('');
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [usePhoto, setUsePhoto] = useState(false);
  const colorInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadPassbooks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPassbooks();
    }, [])
  );

  const loadPassbooks = async () => {
    try {
      setLoading(true);
      const data = await DataService.getPassbooks();
      setPassbooks(data);
    } catch (error) {
      console.error('Error loading passbooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingPassbook(null);
    setPassbookName('');
    setSelectedColor(PRESET_COLORS[0].value);
    setCustomColor('');
    setUseCustomColor(false);
    setShowColorPicker(false);
    setPhotoUri(undefined);
    setUsePhoto(false);
    setModalVisible(true);
  };

  const openEditModal = (passbook: Passbook) => {
    setEditingPassbook(passbook);
    setPassbookName(passbook.name);
    setSelectedColor(passbook.color);
    
    // Check if color is custom (not in preset)
    const isPreset = PRESET_COLORS.some(c => c.value === passbook.color);
    if (!isPreset) {
      setCustomColor(passbook.color);
      setUseCustomColor(true);
    } else {
      setCustomColor('');
      setUseCustomColor(false);
    }
    
    setShowColorPicker(false);
    
    // Set photo if exists
    if (passbook.photoUri) {
      setPhotoUri(passbook.photoUri);
      setUsePhoto(true);
    } else {
      setPhotoUri(undefined);
      setUsePhoto(false);
    }
    
    setModalVisible(true);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        setUsePhoto(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('錯誤', '無法選擇圖片');
    }
  };

  const handleSave = async () => {
    if (!passbookName.trim()) {
      Alert.alert('Error', 'Please enter a passbook name');
      return;
    }

    // Determine final color
    let finalColor = selectedColor;
    if (!usePhoto) {
      if (useCustomColor) {
        if (!customColor.trim()) {
          Alert.alert('錯誤', '請輸入自訂顏色代碼');
          return;
        }
        // Validate hex color format
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexRegex.test(customColor.trim())) {
          Alert.alert('錯誤', '請輸入有效的顏色代碼（例如：#FF5733）');
          return;
        }
        finalColor = customColor.trim();
      }
    }

    try {
      if (editingPassbook) {
        // Update existing passbook
        await DataService.updatePassbook(editingPassbook.id, {
          name: passbookName.trim(),
          color: finalColor,
          photoUri: usePhoto ? photoUri : undefined,
        });
        Alert.alert('Success', 'Passbook updated successfully');
      } else {
        // Create new passbook
        await DataService.createPassbook(passbookName.trim(), finalColor, usePhoto ? photoUri : undefined);
        Alert.alert('Success', 'Passbook created successfully');
      }
      setModalVisible(false);
      loadPassbooks();
    } catch (error) {
      console.error('Error saving passbook:', error);
      Alert.alert('Error', 'Failed to save passbook');
    }
  };

  const handleDelete = (passbook: Passbook) => {
    Alert.alert(
      'Delete Passbook',
      `Are you sure you want to delete "${passbook.name}"? All associated transactions will also be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await DataService.deletePassbook(passbook.id);
              Alert.alert('Success', 'Passbook deleted successfully');
              loadPassbooks();
            } catch (error) {
              console.error('Error deleting passbook:', error);
              Alert.alert('Error', 'Failed to delete passbook');
            }
          },
        },
      ]
    );
  };

  const renderPassbookItem = (passbook: Passbook) => {
    const cardBase = {
      backgroundColor: theme.card,
      borderRadius: RADIUS.card,
      paddingHorizontal: SPACING.lg,
      marginBottom: SPACING.sm,
      borderWidth: 1.5,
      borderColor: theme.border,
      ...SHADOW.softCard,
    };

    return (
      <TouchableOpacity 
        key={passbook.id} 
        style={[cardBase, styles.passbookItem]}
        onLongPress={() => openEditModal(passbook)}
        activeOpacity={0.7}
      >
        <View style={styles.passbookLeft}>
          {passbook.photoUri ? (
            <Image
              source={{ uri: passbook.photoUri }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatar, { backgroundColor: passbook.color }]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {passbook.name}
            </Text>
          </View>
        </View>

        <View style={styles.passbookActions}>
          <TouchableOpacity 
            style={[styles.iconWrap, { borderColor: theme.primary }]}
            onPress={() => openEditModal(passbook)}
          >
            <Image 
              source={require('../../assets/passbookmanagement/edit-text.png')}
              style={[styles.iconImage, { tintColor: theme.primary }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconWrap, { borderColor: theme.primary }]}
            onPress={() => handleDelete(passbook)}
          >
            <Image 
              source={require('../../assets/passbookmanagement/trash.png')}
              style={[styles.iconImage, { tintColor: theme.primary }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* 只給 Header 吃 Safe Area Top */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={[styles.backIcon, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{t.passbookManagement}</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* 內容區完全不吃 top safe area，直接貼 header 底下 */}
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
        <FlatList
          data={loading ? [] : passbooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderPassbookItem(item)}
          ListEmptyComponent={
            loading ? (
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                {t.loading}
              </Text>
            ) : (
              <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                <Text style={[styles.emptyText, { color: theme.text }]}>
                  {config.language === 'zh-TW' ? '尚無帳本' : 'No passbooks yet'}
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                  {config.language === 'zh-TW' ? '點擊 + 建立您的第一個帳本' : 'Tap + to create your first passbook'}
                </Text>
              </View>
            )
          }
          ListHeaderComponent={<View />}
          ListHeaderComponentStyle={{ height: 0, margin: 0, padding: 0 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 80 }}
          style={{ flex: 1, marginTop: 0 }}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          bounces={false}
          alwaysBounceVertical={false}
        />

        {/* FAB Button */}
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: theme.primary }]} 
          onPress={openAddModal}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {editingPassbook 
                  ? (config.language === 'zh-TW' ? '編輯帳本' : 'Edit Passbook')
                  : (config.language === 'zh-TW' ? '新增帳本' : 'New Passbook')
                }
              </Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.closeIcon, { color: theme.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>
                  {config.language === 'zh-TW' ? '帳本名稱' : 'Passbook Name'}
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                  placeholder={config.language === 'zh-TW' ? '例如：主要帳戶、儲蓄' : 'e.g., Main Account, Savings'}
                  placeholderTextColor={theme.textSecondary}
                  value={passbookName}
                  onChangeText={setPassbookName}
                />
              </View>

              {/* Photo or Color Selection */}
              <View style={styles.inputContainer}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.inputLabel, { color: theme.text }]}>
                    {config.language === 'zh-TW' ? '使用照片' : 'Use Photo'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setUsePhoto(!usePhoto);
                      if (!usePhoto) {
                        setUseCustomColor(false);
                        setShowColorPicker(false);
                      }
                    }}
                  >
                    <View style={[
                      styles.toggleSwitch,
                      { backgroundColor: theme.border },
                      usePhoto && [styles.toggleSwitchActive, { backgroundColor: theme.primary }]
                    ]}>
                      <View style={[
                        styles.toggleThumb,
                        { backgroundColor: theme.background },
                        usePhoto && styles.toggleThumbActive
                      ]} />
                    </View>
                  </TouchableOpacity>
                </View>

                {usePhoto && (
                  <View style={styles.photoContainer}>
                    {photoUri ? (
                      <View style={styles.photoPreviewContainer}>
                        <Image
                          source={{ uri: photoUri }}
                          style={[styles.photoPreview, { borderColor: theme.primary }]}
                          resizeMode="cover"
                        />
                        <GlassButton
                          title={config.language === 'zh-TW' ? '更換' : 'Change'}
                          onPress={pickImage}
                          variant="outline"
                          size="small"
                          style={{ marginTop: 12 }}
                        />
                      </View>
                    ) : (
                      <GlassButton
                        title={config.language === 'zh-TW' ? '選擇照片' : 'Select Photo'}
                        onPress={pickImage}
                        variant="primary"
                        size="medium"
                      />
                    )}
                  </View>
                )}
              </View>

              {/* Color Picker - Only show if not using photo */}
              {!usePhoto && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: theme.text }]}>
                      {config.language === 'zh-TW' ? '顏色' : 'Color'}
                    </Text>
                    <View style={styles.colorGrid}>
                      {PRESET_COLORS.map((color) => (
                        <TouchableOpacity
                          key={color.value}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color.value, borderColor: theme.border },
                            selectedColor === color.value && !useCustomColor && [styles.colorOptionSelected, { borderColor: theme.primary }],
                          ]}
                          onPress={() => {
                            setSelectedColor(color.value);
                          setUseCustomColor(false);
                          setShowColorPicker(false);
                        }}
                      >
                        {selectedColor === color.value && !useCustomColor && (
                          <Text style={[styles.colorCheckmark, { color: theme.background }]}>✓</Text>
                        )}
                      </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Custom Color Section */}
                  <View style={styles.inputContainer}>
                    <View style={styles.rowBetween}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>
                        {config.language === 'zh-TW' ? '使用自訂顏色' : 'Use Custom Color'}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setUseCustomColor(!useCustomColor);
                          if (!useCustomColor) {
                            setShowColorPicker(false);
                          }
                        }}
                      >
                        <View style={[
                          styles.toggleSwitch,
                          { backgroundColor: theme.border },
                          useCustomColor && [styles.toggleSwitchActive, { backgroundColor: theme.primary }]
                        ]}>
                          <View style={[
                            styles.toggleThumb,
                            { backgroundColor: theme.background },
                            useCustomColor && styles.toggleThumbActive
                          ]} />
                        </View>
                      </TouchableOpacity>
                    </View>

                    {useCustomColor && (
                      <View style={styles.customColorContainer}>
                        <View style={styles.hexRow}>
                          <TextInput
                            ref={colorInputRef}
                            style={[styles.hexInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                            placeholder="#FF5733"
                            placeholderTextColor={theme.textSecondary}
                            value={customColor}
                            onChangeText={setCustomColor}
                            onFocus={() => {
                              setTimeout(() => {
                                scrollViewRef.current?.scrollToEnd({ animated: true });
                              }, 100);
                            }}
                            autoCapitalize="characters"
                            maxLength={7}
                          />
                          <View
                            style={[
                              styles.hexPreview,
                              {
                                backgroundColor: customColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
                                  ? customColor
                                  : theme.cardAlt,
                                borderColor: theme.border
                              }
                            ]}
                          />
                        </View>

                        {/* Color Picker Toggle */}
                        <TouchableOpacity
                          style={[styles.pickerToggleBtn, { backgroundColor: theme.cardAlt }]}
                          onPress={() => setShowColorPicker(!showColorPicker)}
                        >
                          <Text style={[styles.pickerToggleText, { color: theme.text }]}>
                            {showColorPicker 
                              ? (config.language === 'zh-TW' ? "隱藏調色盤" : "Hide Picker")
                              : (config.language === 'zh-TW' ? "顯示調色盤" : "Show Picker")
                            }
                          </Text>
                        </TouchableOpacity>

                        {/* Color Picker Wheel */}
                        {showColorPicker && (
                          <View style={[styles.colorPickerContainer, { backgroundColor: theme.cardAlt }]}>
                            <ColorPicker
                              color={customColor || '#FF5733'}
                              onColorChange={(color) => setCustomColor(color)}
                              onColorChangeComplete={(color) => setCustomColor(color)}
                              thumbSize={30}
                              sliderSize={30}
                              noSnap={true}
                              row={false}
                              swatches={false}
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </>
              )}

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <GlassButton
                  title={config.language === 'zh-TW' ? '取消' : 'Cancel'}
                  onPress={() => setModalVisible(false)}
                  variant="secondary"
                  size="medium"
                  style={{ flex: 1 }}
                />
                <GlassButton
                  title={editingPassbook 
                    ? (config.language === 'zh-TW' ? '更新' : 'Update')
                    : (config.language === 'zh-TW' ? '建立' : 'Create')
                  }
                  onPress={handleSave}
                  variant="primary"
                  size="medium"
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    marginRight: SPACING.sm,
  },
  backIcon: {
    fontSize: 26,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  passbookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    marginTop: SPACING.sm,
  },
  passbookLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 10,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  balance: {
    ...FONT.label,
    marginTop: 3,
  },
  passbookActions: {
    flexDirection: 'row',
    columnGap: SPACING.sm,
    marginLeft: 'auto',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  iconImage: {
    width: 16,
    height: 16,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: 32,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  fabIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  loadingText: {
    ...FONT.body,
    textAlign: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    ...FONT.bodyM,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    ...FONT.label,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    marginHorizontal: 18,
    maxHeight: '86%',
    width: '100%',
    maxWidth: 360,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    ...FONT.titleL,
  },
  modalClose: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 26,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    ...FONT.bodyM,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: RADIUS.card,
    height: 48,
    paddingHorizontal: SPACING.lg,
    fontSize: 16,
    borderWidth: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderWidth: 3,
  },
  colorCheckmark: {
    fontSize: 24,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  customColorContainer: {
    marginTop: 8,
  },
  hexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  hexInput: {
    flex: 1,
    borderRadius: RADIUS.card,
    height: 48,
    paddingHorizontal: SPACING.lg,
    fontSize: 16,
    fontFamily: 'monospace',
    borderWidth: 1,
    marginHorizontal: 0,
    marginBottom: 0,
  },
  hexPreview: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
  },
  pickerToggleBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pickerToggleText: {
    ...FONT.label,
  },
  colorPickerContainer: {
    height: 280,
    marginTop: 10,
    borderRadius: 16,
    padding: 10,
  },
  photoContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  photoPreviewContainer: {
    alignItems: 'center',
    width: 120,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});
