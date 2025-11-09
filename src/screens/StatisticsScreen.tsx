import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DataService } from '../services/DataService';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';
import { GlassCard } from '../components/GlassCard';
import { formatCompactNumber } from '../utils/formatting';

interface StatisticsScreenProps {
  navigation: any;
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  maxValue: number;
}

interface DailyData {
  date: string;
  amount: number;
}

interface AccountData {
  id: string;
  name: string;
  totalAmount: number;
  percentage: number;
  color: string;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  
  // Helper function to format amounts with compact notation
  const formatAmount = (amount: number) => {
    if (Math.abs(amount) >= 100000) {
      return `NT$ ${formatCompactNumber(amount)}`;
    }
    return `NT$ ${amount.toLocaleString()}`;
  };
  
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [dailyIncomeData, setDailyIncomeData] = useState<DailyData[]>([]);
  const [dailyExpenseData, setDailyExpenseData] = useState<DailyData[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(29); // 陣列第30個元素，也就是今天
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedAccount]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedAccount])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [passbooksData, transactionsData] = await Promise.all([
        DataService.getPassbooks(),
        DataService.getTransactions(),
      ]);

      // Filter transactions by selected account
      const filteredTransactions = selectedAccount === 'all' 
        ? transactionsData 
        : transactionsData.filter(t => t.passbookId === selectedAccount);

      // Calculate total income and expenses
      const income = filteredTransactions
        .filter(t => t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = filteredTransactions
        .filter(t => !t.isIncome)
        .reduce((sum, t) => sum + t.amount, 0);

      setTotalIncome(income);
      setTotalExpenses(expenses);

      // Calculate monthly data (last 6 months)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const monthlyStats: MonthlyData[] = [];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = date.getMonth();
        const year = date.getFullYear();
        
        const monthTransactions = filteredTransactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === month && tDate.getFullYear() === year;
        });

        const monthIncome = monthTransactions
          .filter(t => t.isIncome)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const monthExpenses = monthTransactions
          .filter(t => !t.isIncome)
          .reduce((sum, t) => sum + t.amount, 0);

        monthlyStats.push({
          month: monthNames[month],
          income: monthIncome,
          expenses: monthExpenses,
          maxValue: Math.max(monthIncome, monthExpenses),
        });
      }

      const maxInMonths = Math.max(...monthlyStats.map(m => m.maxValue), 1);
      const normalizedMonthly = monthlyStats.map(m => ({
        ...m,
        incomePercent: (m.income / maxInMonths) * 100,
        expensesPercent: (m.expenses / maxInMonths) * 100,
      }));

      setMonthlyData(normalizedMonthly as any);

      // Calculate daily data (last 30 days)
      const dailyIncomeStats: { [key: string]: number } = {};
      const dailyExpenseStats: { [key: string]: number } = {};
      const today = new Date();
      
      // Initialize all days with 0
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        dailyIncomeStats[dateStr] = 0;
        dailyExpenseStats[dateStr] = 0;
      }

      // Fill in actual transaction data
      filteredTransactions.forEach(t => {
        const tDate = new Date(t.date);
        const daysDiff = Math.floor((today.getTime() - tDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 0 && daysDiff < 30) {
          const dateStr = `${tDate.getMonth() + 1}/${tDate.getDate()}`;
          if (t.isIncome) {
            dailyIncomeStats[dateStr] = (dailyIncomeStats[dateStr] || 0) + t.amount;
          } else {
            dailyExpenseStats[dateStr] = (dailyExpenseStats[dateStr] || 0) + t.amount;
          }
        }
      });

      // Convert to array format
      const dailyIncome: DailyData[] = Object.keys(dailyIncomeStats).map(date => ({
        date,
        amount: dailyIncomeStats[date],
      }));

      const dailyExpense: DailyData[] = Object.keys(dailyExpenseStats).map(date => ({
        date,
        amount: dailyExpenseStats[date],
      }));

      setDailyIncomeData(dailyIncome);
      setDailyExpenseData(dailyExpense);

      // Calculate account data
      const accountStats: AccountData[] = passbooksData.map(passbook => {
        const passbookTransactions = transactionsData.filter(t => t.passbookId === passbook.id);
        const total = passbookTransactions.reduce((sum, t) => 
          sum + (t.isIncome ? t.amount : -t.amount), 0
        );
        
        return {
          id: passbook.id,
          name: passbook.name,
          totalAmount: Math.abs(total),
          percentage: 0,
          color: passbook.color,
        };
      });

      const maxAmount = Math.max(...accountStats.map(a => a.totalAmount), 1);
      accountStats.forEach(a => {
        a.percentage = (a.totalAmount / maxAmount) * 100;
      });

      // Add "All Accounts" option at the beginning
      const accountOptions = [
        { id: 'all', name: t.allAccounts, totalAmount: 0, percentage: 0, color: '#7B68EE' },
        ...accountStats
      ];

      setAccounts(accountOptions);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{t.statistics}</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Account Filter */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContainer}
          >
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.filterChip,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  selectedAccount === account.id && [styles.filterChipActive, { backgroundColor: theme.primary }],
                ]}
                onPress={() => setSelectedAccount(account.id)}
              >
                <Text style={[styles.filterText, { color: theme.text }]}>{account.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Monthly Income vs Expenses Chart */}
          <View style={styles.chartCardWrapper}>
            <GlassCard
              variant="dark"
              borderRadius={20}
              padding={20}
              margin={0}
            >
              <Text style={[styles.chartTitle, { color: theme.text }]}>{t.monthlyIncomeVsExpenses}</Text>
              <Text style={[styles.chartValue, { color: theme.text }]}>{formatAmount(totalIncome - totalExpenses)}</Text>
              <View style={styles.chartSubtitle}>
                <Text style={[styles.chartLabel, { color: theme.textSecondary }]}>{t.netBalance}</Text>
                <Text style={[styles.chartPercentage, { color: theme.success }]}>
                  {totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0}%
                </Text>
              </View>
              {loading ? (
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{t.loading}</Text>
              ) : (
                <View style={styles.barChart}>
                  {monthlyData.map((data, index) => (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barGroup}>
                        <View 
                          style={[
                            styles.bar,
                            { backgroundColor: theme.success },
                            { height: `${(data as any).incomePercent || 0}%` }
                          ]} 
                        />
                        <View 
                          style={[
                            styles.bar,
                            { backgroundColor: theme.error },
                            { height: `${(data as any).expensesPercent || 0}%` }
                          ]} 
                        />
                      </View>
                      <Text style={[styles.barLabel, { color: theme.textSecondary }]}>{data.month}</Text>
                    </View>
                  ))}
                </View>
              )}
            </GlassCard>
          </View>

          {/* Daily Transaction Trend - Single Day View */}
          <View style={styles.chartCardWrapper}>
            <GlassCard
              variant="dark"
              borderRadius={20}
              padding={20}
              margin={0}
            >
              <Text style={[styles.chartTitle, { color: theme.text }]}>
                {t.dailyAnalysis}
              </Text>
            {loading ? (
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{t.loading}</Text>
            ) : dailyIncomeData.length > 0 ? (
              <View>
                {/* Date Navigation */}
                <View style={styles.dateNavigation}>
                  <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: theme.cardAlt }]}
                    onPress={() => setSelectedDateIndex(Math.max(0, selectedDateIndex - 1))}
                    disabled={selectedDateIndex === 0}
                  >
                    <Text style={[styles.navButtonText, { 
                      color: selectedDateIndex === 0 ? theme.textSecondary : theme.text 
                    }]}>←</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.dateInfo}>
                    <Text style={[styles.selectedDate, { color: theme.text }]}>
                      {dailyIncomeData[selectedDateIndex]?.date || ''}
                    </Text>
                    <Text style={[styles.dateHint, { color: theme.textSecondary }]}>
                      {selectedDateIndex === 29 
                        ? t.today
                        : selectedDateIndex === 28
                        ? t.yesterday
                        : `${29 - selectedDateIndex} ${t.daysAgo}`
                      }
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: theme.cardAlt }]}
                    onPress={() => setSelectedDateIndex(Math.min(29, selectedDateIndex + 1))}
                    disabled={selectedDateIndex === 29}
                  >
                    <Text style={[styles.navButtonText, { 
                      color: selectedDateIndex === 29 ? theme.textSecondary : theme.text 
                    }]}>→</Text>
                  </TouchableOpacity>
                </View>

                {/* Daily Summary */}
                <View style={styles.dailySummary}>
                  <View style={styles.summaryItem}>
                    <View style={styles.legendContainer}>
                      <View style={[styles.legendDot, { backgroundColor: theme.success }]} />
                      <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                        {t.incomeLabel}
                      </Text>
                    </View>
                    <Text style={[styles.summaryAmount, { color: theme.success }]}>
                      NT$ {dailyIncomeData[selectedDateIndex]?.amount.toLocaleString() || '0'}
                    </Text>
                  </View>
                  
                  <View style={styles.summaryDivider} />
                  
                  <View style={styles.summaryItem}>
                    <View style={styles.legendContainer}>
                      <View style={[styles.legendDot, { backgroundColor: theme.error }]} />
                      <Text style={[styles.legendText, { color: theme.textSecondary }]}>
                        {t.expensesLabel}
                      </Text>
                    </View>
                    <Text style={[styles.summaryAmount, { color: theme.error }]}>
                      NT$ {dailyExpenseData[selectedDateIndex]?.amount.toLocaleString() || '0'}
                    </Text>
                  </View>
                </View>

                {/* Net Balance */}
                <View style={[styles.netBalanceCard, { 
                  backgroundColor: theme.cardAlt,
                  borderColor: theme.border 
                }]}>
                  <Text style={[styles.netBalanceLabel, { color: theme.textSecondary }]}>
                    {t.dailyNet}
                  </Text>
                  <Text style={[styles.netBalanceAmount, {
                    color: (dailyIncomeData[selectedDateIndex]?.amount || 0) - (dailyExpenseData[selectedDateIndex]?.amount || 0) >= 0 
                      ? theme.success 
                      : theme.error 
                  }]}>
                    {((dailyIncomeData[selectedDateIndex]?.amount || 0) - (dailyExpenseData[selectedDateIndex]?.amount || 0)) >= 0 ? '+' : ''}
                    NT$ {((dailyIncomeData[selectedDateIndex]?.amount || 0) - (dailyExpenseData[selectedDateIndex]?.amount || 0)).toLocaleString()}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                {t.noData}
              </Text>
            )}
            </GlassCard>
          </View>

          {/* Annual Totals by Account */}
          {selectedAccount === 'all' && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.totalsByAccount}</Text>
              <Text style={[styles.sectionValue, { color: theme.text }]}>{formatAmount(totalIncome)}</Text>
              <View style={styles.chartSubtitle}>
                <Text style={[styles.chartLabel, { color: theme.textSecondary }]}>{t.totalIncome}</Text>
                <Text style={[styles.chartPercentage, { color: theme.success }]}>
                  {accounts.filter(a => a.id !== 'all').length} {t.accounts}
                </Text>
              </View>
              {loading ? (
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{t.loading}</Text>
              ) : (
                <View style={styles.horizontalChart}>
                  {accounts.filter(a => a.id !== 'all').map((data, index) => (
                    <View key={index} style={styles.horizontalBarRow}>
                      <Text style={[styles.horizontalBarLabel, { color: theme.textSecondary }]}>{data.name}</Text>
                      <View style={styles.horizontalBarContainer}>
                        <View 
                          style={[
                            styles.horizontalBar, 
                            { width: `${data.percentage}%`, backgroundColor: data.color }
                          ]} 
                        />
                      </View>
                      <Text style={[styles.horizontalBarValue, { color: theme.text }]}>
                        NT$ {data.totalAmount.toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Key Metrics */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.keyMetrics}</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCardWrapper}>
              <GlassCard
                variant="dark"
                borderRadius={16}
                padding={16}
                margin={0}
              >
                <Text style={[styles.metricLabel, { color: theme.text }]}>{t.totalIncome}</Text>
                <Text style={[styles.metricValue, { color: theme.text }]}>{formatAmount(totalIncome)}</Text>
              </GlassCard>
            </View>
            <View style={styles.metricCardWrapper}>
              <GlassCard
                variant="dark"
                borderRadius={16}
                padding={16}
                margin={0}
              >
                <Text style={[styles.metricLabel, { color: theme.text }]}>{t.totalExpense}</Text>
                <Text style={[styles.metricValue, { color: theme.text }]}>{formatAmount(totalExpenses)}</Text>
              </GlassCard>
            </View>
            <View style={styles.metricCardWrapper}>
              <GlassCard
                variant="dark"
                borderRadius={16}
                padding={16}
                margin={0}
              >
                <Text style={[styles.metricLabel, { color: theme.text }]}>{t.netBalance}</Text>
                <Text style={[
                  styles.metricValue,
                  { color: (totalIncome - totalExpenses) >= 0 ? theme.success : theme.error }
                ]}>
                  {formatAmount(totalIncome - totalExpenses)}
                </Text>
              </GlassCard>
            </View>
          </View>

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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.015,
    flex: 1,
    textAlign: 'left',
  },
  settingsButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  filterScroll: {
    paddingHorizontal: 12,
  },
  filterContainer: {
    gap: 12,
    paddingVertical: 12,
  },
  filterChip: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartCard: {
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  chartCardWrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  chartValue: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 8,
  },
  chartSubtitle: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  chartLabel: {
    fontSize: 16,
  },
  chartPercentage: {
    fontSize: 16,
    fontWeight: '500',
  },
  chartSubtitleSmall: {
    fontSize: 14,
    marginTop: 4,
  },
  lineChartScroll: {
    marginTop: 16,
  },
  lineChartWrapper: {
    paddingRight: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '500',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  dateInfo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateHint: {
    fontSize: 13,
  },
  dailySummary: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  netBalanceCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  netBalanceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  netBalanceAmount: {
    fontSize: 28,
    fontWeight: '700',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 180,
    marginTop: 24,
    paddingHorizontal: 12,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barGroup: {
    flexDirection: 'row',
    gap: 4,
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bar: {
    width: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.015,
    marginTop: 8,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionValue: {
    fontSize: 32,
    fontWeight: '700',
    paddingHorizontal: 16,
  },
  horizontalChart: {
    marginTop: 24,
    gap: 24,
    paddingVertical: 12,
  },
  horizontalBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  horizontalBarLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.015,
    width: 100,
  },
  horizontalBarContainer: {
    flex: 1,
    height: 24,
  },
  horizontalBar: {
    height: '100%',
    borderRadius: 4,
  },
  horizontalBarValue: {
    fontSize: 13,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'right',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    gap: 8,
  },
  metricCardWrapper: {
    flex: 1,
    minWidth: 140,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 100,
  },
});

