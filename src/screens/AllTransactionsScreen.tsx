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

interface AllTransactionsScreenProps {
  navigation: any;
}

export const AllTransactionsScreen: React.FC<AllTransactionsScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme];
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [passbooks, setPassbooks] = useState<Passbook[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [txs, pbs] = await Promise.all([
        DataService.getTransactions(),
        DataService.getPassbooks(),
      ]);
      
      // Sort by date, newest first
      const sortedTxs = txs.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setTransactions(sortedTxs);
      setPassbooks(pbs);
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
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${year}/${month}/${day}`;
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.cardSecondary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIcon, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{t.allTransactions}</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.transactionsList}>
            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  {config.language === 'zh-TW' ? '尚無交易記錄' : 'No transactions yet'}
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
                  {config.language === 'zh-TW' ? '點擊下方「新增」按鈕開始記帳' : 'Tap "Add" to start tracking'}
                </Text>
              </View>
            ) : (
              transactions.map(renderTransaction)
            )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  spacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
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
    fontSize: 13,
  },
  transactionPassbook: {
    fontSize: 13,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 0,
    minWidth: 80,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  bottomSpacer: {
    height: 100,
  },
});
