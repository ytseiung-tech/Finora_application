import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DataService } from '../services/DataService';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';

interface PassbookSummary {
  id: string;
  name: string;
  income: number;
  expenses: number;
  balance: number;
  color: string;
}

interface CheckScreenProps {
  navigation: any;
}

export const CheckScreen: React.FC<CheckScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme];
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [passbooks, setPassbooks] = useState<PassbookSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempMonth, setTempMonth] = useState(new Date().getMonth());
  const [tempYear, setTempYear] = useState(new Date().getFullYear());

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsZh = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedMonth, selectedYear])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [passbooksData, transactionsData] = await Promise.all([
        DataService.getPassbooks(),
        DataService.getTransactions(),
      ]);

      const summaries: PassbookSummary[] = passbooksData.map(passbook => {
        const passbookTransactions = transactionsData.filter(t => {
          const transactionDate = new Date(t.date);
          return (
            t.passbookId === passbook.id &&
            transactionDate.getMonth() === selectedMonth &&
            transactionDate.getFullYear() === selectedYear
          );
        });

        const income = passbookTransactions
          .filter(t => t.isIncome)
          .reduce((sum, t) => sum + t.amount, 0);

        const expenses = passbookTransactions
          .filter(t => !t.isIncome)
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          id: passbook.id,
          name: passbook.name,
          income,
          expenses,
          balance: passbook.balance,
          color: passbook.color,
        };
      });

      setPassbooks(summaries);
    } catch (error) {
      console.error('Error loading passbook data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleOpenDatePicker = () => {
    setTempMonth(selectedMonth);
    setTempYear(selectedYear);
    setShowDatePicker(true);
  };

  const handleConfirmDate = () => {
    setSelectedMonth(tempMonth);
    setSelectedYear(tempYear);
    setShowDatePicker(false);
  };

  const handleCancelDate = () => {
    setShowDatePicker(false);
  };

  const renderPassbookCard = (passbook: PassbookSummary) => (
    <View 
      key={passbook.id} 
      style={[
        styles.passbookCard, 
        { 
          backgroundColor: theme.card,
          borderColor: passbook.color,
          borderWidth: 2,
        }
      ]}
    >
      <View style={styles.passbookInfo}>
        <Text style={[styles.passbookName, { color: theme.text }]}>{passbook.name}</Text>
        <Text style={[styles.passbookDetails, { color: theme.textSecondary }]}>
          {t.incomeLabel}: NT$ {passbook.income.toLocaleString()}
        </Text>
        <Text style={[styles.passbookDetails, { color: theme.textSecondary }]}>
          {t.expensesLabel}: NT$ {passbook.expenses.toLocaleString()}
        </Text>
        <Text style={[styles.passbookBalance, { color: theme.primary }]}>
          {t.balanceLabel}: NT$ {passbook.balance.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text, textAlign: 'center', flex: 1 }]}>{t.passbook}</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.monthlySummary}</Text>

          <View style={styles.monthSelector}>
            <TouchableOpacity 
              style={[styles.monthButton, { backgroundColor: theme.cardSecondary }]}
              onPress={handlePreviousMonth}
            >
              <Text style={[styles.monthButtonText, { color: theme.text }]}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.monthDisplay, { backgroundColor: theme.cardSecondary }]}
              onPress={handleOpenDatePicker}
              activeOpacity={0.7}
            >
              <Text style={[styles.monthText, { color: theme.text }]}>
                {config.language === 'zh-TW' ? monthsZh[selectedMonth] : months[selectedMonth]} {selectedYear}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.monthButton, { backgroundColor: theme.cardSecondary }]}
              onPress={handleNextMonth}
            >
              <Text style={[styles.monthButtonText, { color: theme.text }]}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.passbooksList}>
            {loading ? (
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{t.loading}</Text>
            ) : passbooks.length > 0 ? (
              passbooks.map(renderPassbookCard)
            ) : (
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{t.noDataForMonth}</Text>
            )}
          </View>

          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            {t.displaysMonthlyInfo}
          </Text>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelDate}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {config.language === 'zh-TW' ? '選擇日期' : 'Select Date'}
              </Text>

              {/* Year Selector */}
              <View style={styles.pickerRow}>
                <TouchableOpacity 
                  style={[styles.pickerButton, { backgroundColor: theme.cardSecondary }]}
                  onPress={() => setTempYear(tempYear - 1)}
                >
                  <Text style={[styles.pickerButtonText, { color: theme.text }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.pickerValue, { color: theme.text }]}>{tempYear}</Text>
                <TouchableOpacity 
                  style={[styles.pickerButton, { backgroundColor: theme.cardSecondary }]}
                  onPress={() => setTempYear(tempYear + 1)}
                >
                  <Text style={[styles.pickerButtonText, { color: theme.text }]}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Month Grid */}
              <View style={styles.monthGrid}>
                {(config.language === 'zh-TW' ? monthsZh : months).map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.monthGridItem,
                      { backgroundColor: theme.cardSecondary },
                      tempMonth === index && { backgroundColor: theme.primary }
                    ]}
                    onPress={() => setTempMonth(index)}
                  >
                    <Text style={[
                      styles.monthGridText,
                      { color: theme.text },
                      tempMonth === index && { color: '#ffffff', fontWeight: '700' }
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.border }]}
                  onPress={handleCancelDate}
                >
                  <Text style={[styles.modalButtonText, { color: theme.text }]}>
                    {config.language === 'zh-TW' ? '取消' : 'Cancel'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.primary }]}
                  onPress={handleConfirmDate}
                >
                  <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>
                    {config.language === 'zh-TW' ? '確定' : 'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
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
  menuButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.015,
  },
  spacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.015,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  monthSelector: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  monthButton: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  monthDisplay: {
    flex: 1,
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 14,
    fontWeight: '500',
  },
  passbooksList: {
    paddingHorizontal: 16,
  },
  passbookCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  passbookInfo: {
    flex: 2,
    gap: 4,
  },
  passbookName: {
    fontSize: 16,
    fontWeight: '700',
  },
  passbookDetails: {
    fontSize: 13,
    marginTop: 2,
  },
  passbookBalance: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  passbookImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    opacity: 0.3,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  bottomSpacer: {
    height: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pickerButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  pickerValue: {
    fontSize: 32,
    fontWeight: '700',
    marginHorizontal: 40,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  monthGridItem: {
    width: '22%',
    margin: '1.5%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  monthGridText: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalActions: {
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
    fontSize: 16,
    fontWeight: '600',
  },
});
