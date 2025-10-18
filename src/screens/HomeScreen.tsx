import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DataService } from '../services/DataService';
import { Transaction } from '../models/Transaction';
import { Passbook } from '../models/Passbook';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme];
  const styles = createStyles(theme);
  
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
        style={[styles.passbookCard, { borderLeftColor: passbook.color, borderLeftWidth: 4 }]}
        onPress={() => navigation.navigate('Check')}
      >
        <Text style={styles.passbookName}>{passbook.name}</Text>
        <Text style={styles.passbookBalance}>{formatCurrency(passbook.balance)}</Text>
        <View style={styles.passbookStats}>
          <Text style={styles.incomeText}>{t.income} {formatCurrency(income)}</Text>
          <Text style={styles.expenseText}>{t.expense} {formatCurrency(expense)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTransaction = (transaction: Transaction) => {
    const passbook = passbooks.find(pb => pb.id === transaction.passbookId);
    const iconColor = passbook?.color || '#9dafb8';
    
    return (
      <TouchableOpacity
        key={transaction.id}
        style={[styles.transactionItemWrapper, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate('TransactionDetail', { transactionId: transaction.id })}
        activeOpacity={0.7}
      >
        <View style={[styles.transactionItem, { backgroundColor: theme.card }]}>
          <View style={[styles.transactionIcon, { backgroundColor: iconColor }]}>
            <Text style={styles.transactionIconText}>
              {transaction.isIncome ? '↑' : '↓'}
            </Text>
          </View>
          
          <View style={styles.transactionInfo}>
            <Text 
              style={[styles.transactionDescription, { color: theme.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {transaction.description}
            </Text>
            <View style={styles.transactionMeta}>
              <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>{formatDate(transaction.date)}</Text>
              <Text style={[styles.transactionPassbook, { color: theme.textSecondary }]}> • {transaction.passbookName}</Text>
            </View>
          </View>
          
          <Text style={[
            styles.transactionAmount,
            { color: transaction.isIncome ? theme.success : theme.error }
          ]}>
            {transaction.isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.financialOverview}</Text>
          <View style={styles.spacer} />
        </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>{t.totalBalance}</Text>
            <Text style={styles.balance}>{formatCurrency(totalBalance)}</Text>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {passbooks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.myAccounts}</Text>
              <View style={styles.passbookGrid}>
                {passbooks.map(renderPassbookCard)}
              </View>
            </View>
          )}

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

const createStyles = (theme: typeof THEME_COLORS.dark) => StyleSheet.create({
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
    paddingVertical: 12,
  },
  headerTitle: {
    color: theme.text,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.015,
    flex: 1,
  },
  spacer: {
    width: 48,
  },
  balanceCard: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: theme.card,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
  },
  balanceLabel: {
    color: theme.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  balance: {
    color: theme.text,
    fontSize: 36,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.015,
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    fontWeight: '500',
  },
  passbookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  passbookCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.card,
    borderLeftWidth: 4,
  },
  passbookName: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  passbookBalance: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  passbookStats: {
    gap: 4,
  },
  incomeText: {
    color: theme.success,
    fontSize: 12,
  },
  expenseText: {
    color: theme.error,
    fontSize: 12,
  },
  transactionsList: {
    paddingHorizontal: 16,
  },
  transactionItemWrapper: {
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  transactionIconText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 8,
    overflow: 'hidden',
  },
  transactionDescription: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  transactionDate: {
    color: theme.textSecondary,
    fontSize: 13,
  },
  transactionPassbook: {
    color: theme.textSecondary,
    fontSize: 13,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: theme.textSecondary,
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  bottomSpacer: {
    height: 120,
  },
});
