import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DataService } from '../services/DataService';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { formatCompactNumber } from '../utils/formatting';

interface PassbookSummary {
  id: string;
  name: string;
  income: number;
  expenses: number;
  balance: number;
  color: string;
  photoUri?: string;
}

interface CheckScreenProps {
  navigation: any;
}

export const CheckScreen: React.FC<CheckScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  const isDark = ['charcoalViolet', 'forestShadow', 'inkBlack'].includes(config.theme);
  
  // Helper function to format amounts
  const formatAmount = (amount: number) => {
    console.log('formatAmount called with:', amount);
    if (Math.abs(amount) >= 100000) {
      return `NT$ ${formatCompactNumber(amount)}`;
    }
    return `NT$ ${amount.toLocaleString()}`;
  };
  
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
          photoUri: passbook.photoUri,
        };
      });

      setPassbooks(summaries);
      console.log('CheckScreen passbooks loaded:', summaries);
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
    <View style={styles.passbookCardWrapper}>
      <GlassCard
        variant="dark"
        borderRadius={16}
        padding={16}
        margin={0}
      >
        <View style={styles.cardContent}>
          <View style={styles.passbookInfo}>
            <Text style={[styles.passbookName, { color: theme.text }]}>{passbook.name}</Text>
            <View style={styles.detailsRow}>
              <Text style={[styles.passbookDetails, { color: theme.textSecondary }]}>
                {t.incomeLabel}: {formatAmount(passbook.income)}
              </Text>
              <Text style={[styles.passbookDetails, { color: theme.textSecondary }]}>  </Text>
              <Text style={[styles.passbookDetails, { color: theme.textSecondary }]}>
                {t.expensesLabel}: {formatAmount(passbook.expenses)}
              </Text>
            </View>
            <Text style={[styles.passbookBalance, { color: theme.primary }]}>
              {t.balanceLabel}: {formatAmount(passbook.balance)}
            </Text>
          </View>
          {passbook.photoUri ? (
            <Image
              source={{ uri: passbook.photoUri }}
              style={styles.passbookCardPhoto}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.passbookColorCircle, { backgroundColor: passbook.color }]} />
          )}
        </View>
      </GlassCard>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text, textAlign: 'left', flex: 1 }]}>{t.passbook}</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.monthlySummary}</Text>

          <View style={styles.monthSelector}>
            <TouchableOpacity
              style={[styles.monthButton, { backgroundColor: theme.cardAlt }]}
              onPress={handlePreviousMonth}
            >
              <Text style={[styles.monthButtonText, { color: theme.text }]}>←</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.monthDisplay, { backgroundColor: theme.cardAlt }]}
              onPress={handleOpenDatePicker}
              activeOpacity={0.7}
            >
              <Text style={[styles.monthText, { color: theme.text }]}>
                {config.language === 'zh-TW'
                  ? monthsZh[selectedMonth]
                  : months[selectedMonth]}{' '}
                {selectedYear}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.monthButton, { backgroundColor: theme.cardAlt }]}
              onPress={handleNextMonth}
            >
              <Text style={[styles.monthButtonText, { color: theme.text }]}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Passbook Cards */}
          {loading ? (
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              {t.loading}
            </Text>
          ) : passbooks.length > 0 ? (
            passbooks.map((passbook) => (
              <View key={passbook.id}>
                {renderPassbookCard(passbook)}
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t.noDataForMonth}
            </Text>
          )}

          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            {t.displaysMonthlyInfo}
          </Text>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDate}
      >
          <View style={styles.modalOverlay}>
            <View style={[
              styles.modalContent, 
              { backgroundColor: isDark ? 'rgba(35,35,40,0.98)' : theme.card,
                borderWidth: isDark ? 1 : 0,
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'transparent' 
              }
            ]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {config.language === 'zh-TW' ? '選擇日期' : 'Select Date'}
              </Text>

              {/* Year Selector */}
              <View style={styles.pickerRow}>
                <TouchableOpacity 
                  style={[
                    styles.pickerButton, 
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : theme.cardAlt }
                  ]}
                  onPress={() => setTempYear(tempYear - 1)}
                >
                  <Text style={[styles.pickerButtonText, { color: theme.text }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.pickerValue, { color: theme.text }]}>{tempYear}</Text>
                <TouchableOpacity 
                  style={[
                    styles.pickerButton, 
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : theme.cardAlt }
                  ]}
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
                      { backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : theme.cardAlt },
                      tempMonth === index && { backgroundColor: theme.primary }
                    ]}
                    onPress={() => setTempMonth(index)}
                  >
                    <Text style={[
                      styles.monthGridText,
                      { color: theme.text },
                      tempMonth === index && { color: '#FFFFFF', fontWeight: '700' }
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.modalButton, 
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : theme.border }
                  ]}
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
                  <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.015,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.015,
    paddingTop: 4,
    paddingBottom: 8,
  },
  monthSelector: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    marginBottom: 4,
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
  passbookCardWrapper: {
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passbookCardPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 12,
  },
  passbookColorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  passbookInfo: {
    flex: 1,
    gap: 2,
  },
  passbookName: {
    fontSize: 15,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  passbookDetails: {
    fontSize: 12,
  },
  passbookBalance: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 16,
    paddingTop: 20,
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



