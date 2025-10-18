import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DataService } from '../services/DataService';
import { Passbook } from '../models/Passbook';

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
  { name: 'Sky Blue', value: '#19a2e6' },
  { name: 'Orange', value: '#E89A3C' },
  { name: 'Red', value: '#ff4757' },
  { name: 'Teal', value: '#3eaf7c' },
];

export const PassbookManagementScreen: React.FC<PassbookManagementScreenProps> = ({ navigation }) => {
  const [passbooks, setPassbooks] = useState<Passbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPassbook, setEditingPassbook] = useState<Passbook | null>(null);
  const [passbookName, setPassbookName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);
  const [customColor, setCustomColor] = useState('');
  const [useCustomColor, setUseCustomColor] = useState(false);

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
    
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!passbookName.trim()) {
      Alert.alert('Error', 'Please enter a passbook name');
      return;
    }

    // Determine final color
    let finalColor = selectedColor;
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

    try {
      if (editingPassbook) {
        // Update existing passbook
        await DataService.updatePassbook(editingPassbook.id, {
          name: passbookName.trim(),
          color: finalColor,
        });
        Alert.alert('Success', 'Passbook updated successfully');
      } else {
        // Create new passbook
        await DataService.createPassbook(passbookName.trim(), finalColor);
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

  const renderPassbookItem = (passbook: Passbook) => (
    <View key={passbook.id} style={styles.passbookItem}>
      <View style={styles.passbookLeft}>
        <View style={[styles.colorIndicator, { backgroundColor: passbook.color }]} />
        <View style={styles.passbookInfo}>
          <Text style={styles.passbookName}>{passbook.name}</Text>
          <Text style={styles.passbookBalance}>Balance: NT$ {passbook.balance.toLocaleString()}</Text>
        </View>
      </View>
      <View style={styles.passbookActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(passbook)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(passbook)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Passbooks</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddModal}
          >
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : passbooks.length > 0 ? (
            <View style={styles.passbooksList}>
              {passbooks.map(renderPassbookItem)}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No passbooks yet</Text>
              <Text style={styles.emptySubtext}>Tap + to create your first passbook</Text>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPassbook ? 'Edit Passbook' : 'New Passbook'}
              </Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Passbook Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Main Account, Savings"
                placeholderTextColor="#9dafb8"
                value={passbookName}
                onChangeText={setPassbookName}
              />
            </View>

            {/* Color Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Color</Text>
              <View style={styles.colorGrid}>
                {PRESET_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color.value}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color.value },
                      selectedColor === color.value && !useCustomColor && styles.colorOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedColor(color.value);
                      setUseCustomColor(false);
                    }}
                  >
                    {selectedColor === color.value && !useCustomColor && (
                      <Text style={styles.colorCheckmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Custom Color Section */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.customColorToggle}
                onPress={() => setUseCustomColor(!useCustomColor)}
              >
                <Text style={styles.inputLabel}>使用自訂顏色</Text>
                <View style={[
                  styles.toggleSwitch,
                  useCustomColor && styles.toggleSwitchActive
                ]}>
                  <View style={[
                    styles.toggleThumb,
                    useCustomColor && styles.toggleThumbActive
                  ]} />
                </View>
              </TouchableOpacity>

              {useCustomColor && (
                <View style={styles.customColorInputContainer}>
                  <TextInput
                    style={styles.colorInput}
                    placeholder="#FF5733"
                    placeholderTextColor="#9dafb8"
                    value={customColor}
                    onChangeText={setCustomColor}
                    autoCapitalize="characters"
                    maxLength={7}
                  />
                  <View
                    style={[
                      styles.colorPreview,
                      {
                        backgroundColor: customColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
                          ? customColor
                          : '#2d3840'
                      }
                    ]}
                  />
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSave}
              >
                <Text style={styles.modalSaveText}>
                  {editingPassbook ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111518',
  },
  safeArea: {
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
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '300',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.015,
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#19a2e6',
    borderRadius: 20,
  },
  addIcon: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    color: '#93b6c8',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  passbooksList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  passbookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#293338',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  passbookLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  passbookInfo: {
    flex: 1,
  },
  passbookName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  passbookBalance: {
    color: '#9dafb8',
    fontSize: 14,
  },
  passbookActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#19a2e6',
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff4757',
  },
  deleteButtonText: {
    color: '#ffffff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#93b6c8',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#9dafb8',
    fontSize: 14,
  },
  bottomSpacer: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a2a32',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  modalClose: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: '#93b6c8',
    fontSize: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#293338',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#ffffff',
    borderWidth: 3,
  },
  colorCheckmark: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  customColorToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#293338',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#4a9eff',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  customColorInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  colorInput: {
    flex: 1,
    backgroundColor: '#293338',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  colorPreview: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#93b6c8',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#293338',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#19a2e6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
