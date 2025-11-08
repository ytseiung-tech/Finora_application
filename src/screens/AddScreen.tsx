import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DataService } from '../services/DataService';
import { Transaction, TransactionCategory } from '../models/Transaction';
import { Passbook } from '../models/Passbook';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';
import { GlassButton } from '../components/GlassButton';
import { GlassCard } from '../components/GlassCard';

interface AddScreenProps {
  navigation: any;
  route?: any;
}

export const AddScreen: React.FC<AddScreenProps> = ({ navigation, route }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  const isDark = ['charcoalViolet', 'forestShadow', 'inkBlack'].includes(config.theme);
  
  const [isIncome, setIsIncome] = useState(route?.params?.isIncome ?? false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPassbook, setSelectedPassbook] = useState<string>('');
  const [passbooks, setPassbooks] = useState<Passbook[]>([]);
  const [autoAllocate, setAutoAllocate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
      const passbooksData = await DataService.getPassbooks();
      setPassbooks(passbooksData);
      if (passbooksData.length > 0 && !selectedPassbook) {
        setSelectedPassbook(passbooksData[0].id);
      }
    } catch (error) {
      console.error('Error loading passbooks:', error);
    }
  };

  const categories = [
    { id: 'food', name: t.food, icon: '🍽️', category: TransactionCategory.GROCERIES },
    { id: 'transport', name: t.transport, icon: '🚗', category: TransactionCategory.TRANSPORTATION },
    { id: 'entertainment', name: t.entertainment, icon: '🎬', category: TransactionCategory.ENTERTAINMENT },
    { id: 'shopping', name: t.shopping, icon: '🛍️', category: TransactionCategory.SHOPPING },
    { id: 'utilities', name: t.utilities, icon: '💡', category: TransactionCategory.UTILITIES },
    { id: 'other', name: t.other, icon: '📌', category: TransactionCategory.OTHER_INCOME },
  ];

  const handleComplete = async () => {
    // Validate inputs
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert(t.errorTitle, t.pleaseEnterValidAmount);
      return;
    }

    try {
      const totalAmount = parseFloat(amount);

      // Auto-allocate by ratio
      if (autoAllocate && isIncome) {
        const activePassbooks = passbooks.filter(pb => pb.isActive);
        const passbooksWithRatios = activePassbooks.filter(pb => pb.ratio && pb.ratio > 0);
        
        if (passbooksWithRatios.length === 0) {
          Alert.alert(t.ratioNotSet, t.pleaseSetRatioFirst, [
            { text: t.cancel },
            { text: t.goToSettings, onPress: () => navigation.navigate('RatioSettings') }
          ]);
          return;
        }

        const totalRatio = passbooksWithRatios.reduce((sum, pb) => sum + (pb.ratio || 0), 0);
        if (Math.abs(totalRatio - 100) > 0.01) {
          Alert.alert(t.ratioError, `${t.ratioMustBe100}${totalRatio.toFixed(1)}%`, [
            { text: t.cancel },
            { text: t.goToSettings, onPress: () => navigation.navigate('RatioSettings') }
          ]);
          return;
        }

        // Calculate allocated amounts
        let remainingAmount = totalAmount;
        const allocations: Array<{ passbook: Passbook; amount: number }> = [];

        passbooksWithRatios.forEach((pb, index) => {
          let allocatedAmount: number;
          
          if (index === passbooksWithRatios.length - 1) {
            // Last passbook gets remaining amount to handle rounding
            allocatedAmount = remainingAmount;
          } else {
            allocatedAmount = Math.round((totalAmount * (pb.ratio || 0) / 100) * 100) / 100;
            remainingAmount -= allocatedAmount;
          }
          
          allocations.push({ passbook: pb, amount: allocatedAmount });
        });

        // Create transactions for each passbook
        for (const allocation of allocations) {
          const transaction: Transaction = {
            id: `${Date.now()}-${allocation.passbook.id}-${Math.random()}`,
            amount: allocation.amount,
            description: note || `${t.incomeAllocatedTo} ${allocation.passbook.name}`,
            passbookId: allocation.passbook.id,
            passbookName: allocation.passbook.name,
            passbookColor: allocation.passbook.color,
            date: selectedDate,
            isIncome: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await DataService.saveTransaction(transaction);
          
          // Update passbook balance
          const newBalance = allocation.passbook.balance + allocation.amount;
          await DataService.updatePassbook(allocation.passbook.id, { balance: newBalance });
        }

        const successMessage = config.language === 'zh-TW'
          ? `已分配 $${totalAmount.toFixed(2)} 按比例分配至 ${allocations.length} 個帳本`
          : `$${totalAmount.toFixed(2)} has been allocated to ${allocations.length} passbook(s) by ratio`;
        Alert.alert(t.success, successMessage, [
          { text: t.ok, onPress: () => navigation.goBack() }
        ]);
        return;
      }

      // Single passbook transaction
      if (!selectedPassbook) {
        const errorMessage = config.language === 'zh-TW' ? '請選擇帳本' : 'Please select a passbook';
        Alert.alert(t.errorTitle, errorMessage);
        return;
      }

      const selectedBook = passbooks.find(p => p.id === selectedPassbook);
      
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: totalAmount,
        description: note || (config.language === 'zh-TW' ? '交�?' : 'Transaction'),
        // category is now optional, not included
        passbookId: selectedBook?.id || '1',
        passbookName: selectedBook?.name || (config.language === 'zh-TW' ? '主�?帳戶' : 'Main Account'),
        passbookColor: selectedBook?.color || '#7B68EE',
        date: selectedDate,
        isIncome,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await DataService.saveTransaction(transaction);
      
      // Update passbook balance
      const newBalance = isIncome
        ? (selectedBook?.balance || 0) + totalAmount
        : (selectedBook?.balance || 0) - totalAmount;
      await DataService.updatePassbook(selectedBook?.id || '1', { balance: newBalance });

      Alert.alert(t.success, t.transactionAdded, [
        {
          text: t.ok,
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert(t.error, t.addFailed);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{t.addTransaction}</Text>
          </View>

          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}
          >
          {/* Income/Expense Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton, 
                { backgroundColor: theme.card, borderColor: theme.border },
                !isIncome && [{ backgroundColor: theme.error, borderColor: theme.error, borderWidth: 2 }]
              ]}
              onPress={() => setIsIncome(false)}
            >
              <Text style={[
                styles.toggleText, 
                { color: theme.text },
                !isIncome && styles.toggleTextActive
              ]}>
                {t.expense}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton, 
                { backgroundColor: theme.card, borderColor: theme.border },
                isIncome && [{ backgroundColor: theme.success, borderColor: theme.success, borderWidth: 2 }]
              ]}
              onPress={() => setIsIncome(true)}
            >
              <Text style={[
                styles.toggleText, 
                { color: theme.text },
                isIncome && styles.toggleTextActive
              ]}>
                {t.income}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              placeholder="NT$"
              placeholderTextColor={theme.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          {/* Note Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              placeholder={t.noteExample}
              placeholderTextColor={theme.textSecondary}
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Date & Time Picker */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {config.language === 'zh-TW' ? '交易時間' : 'Transaction Time'}
          </Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <Text style={[styles.dateTimeLabel, { color: theme.textSecondary }]}>
                {config.language === 'zh-TW' ? '日期' : 'Date'}
              </Text>
              <Text style={[styles.dateTimeValue, { color: theme.text }]}>
                {selectedDate.toLocaleDateString(config.language === 'zh-TW' ? 'zh-TW' : 'en-US')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateTimeButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => setShowTimePicker(!showTimePicker)}
            >
              <Text style={[styles.dateTimeLabel, { color: theme.textSecondary }]}>
                {config.language === 'zh-TW' ? '時間' : 'Time'}
              </Text>
              <Text style={[styles.dateTimeValue, { color: theme.text }]}>
                {selectedDate.toLocaleTimeString(config.language === 'zh-TW' ? 'zh-TW' : 'en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              textColor={isDark ? '#FFFFFF' : undefined}
              onChange={(event, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) {
                  setSelectedDate(date);
                }
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              textColor={isDark ? '#FFFFFF' : undefined}
              onChange={(event, date) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (date) {
                  setSelectedDate(date);
                }
              }}
            />
          )}

          {/* Passbook Selector */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.selectPassbook}</Text>
          <View style={styles.passbookContainer}>
            {passbooks.filter(pb => pb.isActive).map((passbook) => (
              <TouchableOpacity
                key={passbook.id}
                style={[
                  styles.passbookChip,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  selectedPassbook === passbook.id && { 
                    borderColor: isIncome ? theme.success : theme.error, 
                    borderWidth: 1.5 
                  },
                ]}
                onPress={() => setSelectedPassbook(passbook.id)}
              >
                {passbook.photoUri ? (
                  <Image
                    source={{ uri: passbook.photoUri }}
                    style={styles.passbookPhoto}
                    resizeMode="cover"
                  />
                ) : (
                  <View 
                    style={[
                      styles.passbookColor, 
                      { backgroundColor: passbook.color }
                    ]} 
                  />
                )}
                <Text style={[styles.passbookText, { color: theme.text }]}>{passbook.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Auto-allocate Toggle */}
          <View style={styles.autoAllocateWrapper}>
            <GlassCard
              variant="dark"
              borderRadius={16}
              padding={20}
              margin={0}
            >
              <View style={styles.autoAllocateContent}>
                <View style={styles.autoAllocateInfo}>
                  <Text style={[styles.autoAllocateTitle, { color: theme.text }]}>{t.autoAllocate}</Text>
                  <Text style={[styles.autoAllocateSubtitle, { color: theme.textSecondary }]}>
                    {passbooks.filter(pb => pb.isActive && pb.ratio && pb.ratio > 0).length > 0
                      ? passbooks
                          .filter(pb => pb.isActive && pb.ratio && pb.ratio > 0)
                          .map(pb => `${pb.ratio}% ${pb.name}`)
                          .join(', ')
                      : t.pleaseSetRatio}
                  </Text>
                </View>
                <Switch
                  value={autoAllocate}
                  onValueChange={setAutoAllocate}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor={isDark ? '#F9FAFB' : '#FFFFFF'}
                />
              </View>
            </GlassCard>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <GlassButton
              title={t.cancel}
              onPress={() => navigation.goBack()}
              variant="secondary"
              size="large"
              style={{ flex: 1 }}
            />
            <GlassButton
              title={t.complete}
              onPress={handleComplete}
              variant="primary"
              size="large"
              style={{ flex: 1 }}
            />
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.015,
    flex: 1,
    textAlign: 'left',
  },
  spacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 4,
    height: 40,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.015,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  categoriesScroll: {
    paddingHorizontal: 12,
  },
  categoriesContainer: {
    gap: 12,
    paddingVertical: 12,
  },
  passbookContainer: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 32,
    paddingHorizontal: 12,
    backgroundColor: '#293338',
    borderRadius: 12,
  },
  categoryChipActive: {
    backgroundColor: '#19a2e6',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  passbookChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#293338',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  passbookChipActive: {
    borderColor: '#FFFFFF',
  },
  passbookColor: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  passbookPhoto: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  passbookText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#293338',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  pickerPlaceholder: {
    color: '#9dafb8',
    fontSize: 16,
  },
  autoAllocateWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  autoAllocateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  autoAllocateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 72,
    borderRadius: 16,
    borderWidth: 1,
  },
  autoAllocateInfo: {
    flex: 1,
    marginRight: 16,
  },
  autoAllocateTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  autoAllocateSubtitle: {
    color: '#9dafb8',
    fontSize: 14,
    marginTop: 2,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dateTimeButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateTimeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bottomSpacer: {
    height: 20,
  },
});

