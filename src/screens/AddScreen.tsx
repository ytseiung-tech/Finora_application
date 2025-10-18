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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DataService } from '../services/DataService';
import { Transaction, TransactionCategory } from '../models/Transaction';
import { Passbook } from '../models/Passbook';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';

interface AddScreenProps {
  navigation: any;
  route?: any;
}

export const AddScreen: React.FC<AddScreenProps> = ({ navigation, route }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme];
  const [isIncome, setIsIncome] = useState(route?.params?.isIncome ?? false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPassbook, setSelectedPassbook] = useState<string>('');
  const [passbooks, setPassbooks] = useState<Passbook[]>([]);
  const [autoAllocate, setAutoAllocate] = useState(false);

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
    { id: 'food', name: t.food, icon: '🍴', category: TransactionCategory.GROCERIES },
    { id: 'transport', name: t.transport, icon: '🚌', category: TransactionCategory.TRANSPORTATION },
    { id: 'entertainment', name: t.entertainment, icon: '🎬', category: TransactionCategory.ENTERTAINMENT },
    { id: 'shopping', name: t.shopping, icon: '🛍️', category: TransactionCategory.SHOPPING },
    { id: 'utilities', name: t.utilities, icon: '📄', category: TransactionCategory.UTILITIES },
    { id: 'other', name: t.other, icon: '❓', category: TransactionCategory.OTHER_INCOME },
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
            date: new Date(),
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
          ? `已將 $${totalAmount.toFixed(2)} 按比例分配至 ${allocations.length} 個存摺`
          : `$${totalAmount.toFixed(2)} has been allocated to ${allocations.length} passbook(s) by ratio`;
        Alert.alert(t.success, successMessage, [
          { text: t.ok, onPress: () => navigation.goBack() }
        ]);
        return;
      }

      // Single passbook transaction
      if (!selectedPassbook) {
        const errorMessage = config.language === 'zh-TW' ? '請選擇存摺' : 'Please select a passbook';
        Alert.alert(t.errorTitle, errorMessage);
        return;
      }

      const selectedBook = passbooks.find(p => p.id === selectedPassbook);
      
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: totalAmount,
        description: note || (config.language === 'zh-TW' ? '交易' : 'Transaction'),
        // category is now optional, not included
        passbookId: selectedBook?.id || '1',
        passbookName: selectedBook?.name || (config.language === 'zh-TW' ? '主要帳戶' : 'Main Account'),
        passbookColor: selectedBook?.color || '#19a2e6',
        date: new Date(),
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
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: theme.cardSecondary }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.closeIcon, { color: theme.text }]}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{t.addTransaction}</Text>
            <View style={styles.spacer} />
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
                !isIncome && { backgroundColor: theme.error }
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
                isIncome && { backgroundColor: theme.success }
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

          {/* Passbook Selector */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.selectPassbook}</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContainer}
          >
            {passbooks.filter(pb => pb.isActive).map((passbook) => (
              <TouchableOpacity
                key={passbook.id}
                style={[
                  styles.passbookChip,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  selectedPassbook === passbook.id && { borderColor: passbook.color, borderWidth: 2 },
                ]}
                onPress={() => setSelectedPassbook(passbook.id)}
              >
                <View 
                  style={[
                    styles.passbookColor, 
                    { backgroundColor: passbook.color }
                  ]} 
                />
                <Text style={[styles.passbookText, { color: theme.text }]}>{passbook.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Auto-allocate Toggle */}
          <View style={[styles.autoAllocateContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
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
              thumbColor="#ffffff"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text }]}>{t.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.completeButton, { backgroundColor: theme.primary }]}
              onPress={handleComplete}
            >
              <Text style={styles.completeButtonText}>{t.complete}</Text>
            </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.015,
    flex: 1,
    textAlign: 'center',
    paddingRight: 48,
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
    color: '#ffffff',
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
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  passbookChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#293338',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  passbookChipActive: {
    backgroundColor: '#19a2e6',
    borderColor: '#ffffff',
  },
  passbookColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  passbookText: {
    color: '#ffffff',
    fontSize: 14,
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
  autoAllocateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 72,
  },
  autoAllocateInfo: {
    flex: 1,
    marginRight: 16,
  },
  autoAllocateTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  autoAllocateSubtitle: {
    color: '#9dafb8',
    fontSize: 14,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#293338',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.015,
  },
  completeButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#19a2e6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.015,
  },
  bottomSpacer: {
    height: 20,
  },
});
