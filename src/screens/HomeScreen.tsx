import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DataService } from '../services/DataService';
import { Transaction } from '../models/Transaction';
import { Passbook } from '../models/Passbook';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';
import { GlassCard } from '../components/GlassCard';
import { formatCompactNumber } from '../utils/formatting';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  
  // Detect dark theme
  const isDarkTheme = ['charcoalViolet', 'forestShadow', 'inkBlack'].includes(config.theme);
  
  const styles = createStyles(theme, isDarkTheme);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [passbooks, setPassbooks] = useState<Passbook[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);


  const loadData = useCallback(async () => {
    try {
      const txs = await DataService.getTransactions();
      const pbs = await DataService.getPassbooks();
      
      // Show only 10 recent transactions on home screen
      setTransactions(txs.slice(0, 10));
      setPassbooks(pbs);
      
      // Calculate total balance from all passbooks
      const balance = pbs.reduce((sum, pb) => sum + pb.balance, 0);
      setTotalBalance(balance);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const formatCurrency = (amount: number) => {
    // For large numbers (>= 100,000), use compact format
    if (Math.abs(amount) >= 100000) {
      return `NT$ ${formatCompactNumber(amount)}`;
    }
    return `NT$ ${amount.toLocaleString('zh-TW')}`;
  };

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const renderPassbookCard = (passbook: Passbook) => {
    const passbookTxs = transactions.filter(tx => tx.passbookId === passbook.id);
    const income = passbookTxs.filter(tx => tx.isIncome).reduce((sum, tx) => sum + tx.amount, 0);
    const expense = passbookTxs.filter(tx => !tx.isIncome).reduce((sum, tx) => sum + tx.amount, 0);
    
    return (
      <TouchableOpacity 
        key={passbook.id}
        onPress={() => navigation.navigate('Check')}
        activeOpacity={0.7}
        style={styles.passbookCardWrapper}
      >
        <View style={styles.passbookCard}>
          <Text style={styles.passbookName}>{passbook.name}</Text>
          <Text style={styles.passbookBalance}>{formatCurrency(passbook.balance)}</Text>
          <View style={styles.passbookStats}>
            <Text style={styles.incomeText}>↑ {formatCurrency(income)}</Text>
            <Text style={styles.expenseText}>↓ {formatCurrency(expense)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTransaction = (transaction: Transaction) => {
    const passbook = passbooks.find(pb => pb.id === transaction.passbookId);
    const iconColor = passbook?.color || '#9dafb8';
    const photoUri = passbook?.photoUri;
    
    return (
      <TouchableOpacity
        key={transaction.id}
        style={styles.transactionItem}
        onPress={() => navigation.navigate('TransactionDetail', { transactionId: transaction.id })}
        activeOpacity={0.7}
      >
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.transactionIconPhoto}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.transactionIcon, { backgroundColor: iconColor }]}>
            <Text style={styles.transactionIconText}>
              {transaction.isIncome ? '↑' : '↓'}
            </Text>
          </View>
        )}
        
        <View style={styles.transactionInfo}>
          <Text 
            style={styles.transactionDescription}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {transaction.description}
          </Text>
          <View style={styles.transactionMeta}>
            <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
            <Text style={styles.transactionPassbook}> • {transaction.passbookName}</Text>
          </View>
        </View>
        
        <Text style={[
          styles.transactionAmount,
          { color: transaction.isIncome ? theme.success : '#FB7185' }
        ]}>
          {transaction.isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.home}</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Total Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>{t.totalBalance}</Text>
            <Text style={styles.balance}>{formatCurrency(totalBalance)}</Text>
          </View>

          {/* My Accounts Grid */}
          {passbooks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.myAccounts}</Text>
              <View style={styles.passbookGrid}>
                {passbooks.map(renderPassbookCard)}
              </View>
            </View>
          )}

          {/* Recent Transactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.recentTransactions}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllTransactions')}>
                <Text style={styles.viewAllText}>{t.viewAll}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transactionsList}>
              {transactions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>{t.noTransactions}</Text>
                  <Text style={styles.emptySubtext}>{t.noTransactionsSubtext}</Text>
                </View>
              ) : (
                transactions.map(renderTransaction)
              )}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const createStyles = (theme: typeof THEME_COLORS.mistBlue, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },
  headerTitle: {
    color: theme.text,
    fontSize: 35,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  
  // Balance Card
  balanceCard: {
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : theme.card,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 20,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'transparent',
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.4 : 0.05,
    shadowRadius: isDark ? 12 : 6,
    shadowOffset: { width: 0, height: isDark ? 4 : 2 },
    elevation: isDark ? 8 : 2,
  },
  balanceLabel: {
    fontSize: 14,
    color: isDark ? 'rgba(255,255,255,0.6)' : theme.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  balance: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.text,
    letterSpacing: -1,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    paddingHorizontal: 16,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewAllText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Passbook Grid (2x2 大卡片)
  passbookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  passbookCardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  passbookCard: {
    backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : theme.card,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'transparent',
    shadowColor: '#000',
    shadowOpacity: isDark ? 0 : 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: isDark ? 0 : 2,
    minHeight: 110,
  },
  passbookName: {
    fontSize: 15,
    fontWeight: '700',
    color: isDark ? '#E5E7EB' : theme.text,
    marginBottom: 6,
  },
  passbookBalance: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  passbookStats: {
    gap: 4,
  },
  incomeText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.success,
  },
  expenseText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FB7185',
  },

  // Transactions List (深色用極淺灰，不用白)
  transactionsList: {
    paddingHorizontal: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : theme.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'transparent',
    shadowColor: '#000',
    shadowOpacity: isDark ? 0 : 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionIconPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  transactionIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 3,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: isDark ? '#9CA3AF' : theme.textSecondary,
  },
  transactionPassbook: {
    fontSize: 12,
    color: isDark ? '#9CA3AF' : theme.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.textSecondary,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  
  bottomSpacer: {
    height: 100,
  },
});
