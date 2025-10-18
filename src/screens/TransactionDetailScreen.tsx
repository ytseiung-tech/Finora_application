import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataService } from '../services/DataService';
import { Transaction, TransactionCategory } from '../models/Transaction';
import { Passbook } from '../models/Passbook';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';

interface TransactionDetailScreenProps {
  navigation: any;
  route: {
    params: {
      transactionId: string;
    };
  };
}

export const TransactionDetailScreen: React.FC<TransactionDetailScreenProps> = ({ navigation, route }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme];
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [passbooks, setPassbooks] = useState<Passbook[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPassbookId, setEditedPassbookId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [route.params.transactionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allTransactions, allPassbooks] = await Promise.all([
        DataService.getTransactions(),
        DataService.getPassbooks(),
      ]);
      
      const foundTransaction = allTransactions.find(t => t.id === route.params.transactionId);
      if (foundTransaction) {
        setTransaction(foundTransaction);
        setEditedAmount(foundTransaction.amount.toString());
        setEditedDescription(foundTransaction.description);
        setEditedPassbookId(foundTransaction.passbookId);
      }
      
      setPassbooks(allPassbooks);
    } catch (error) {
      console.error('Error loading transaction:', error);
      Alert.alert(t.error, config.language === 'zh-TW' ? '載入交易失敗' : 'Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!transaction) return;
    
    const amount = parseFloat(editedAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert(t.error, t.pleaseEnterValidAmount);
      return;
    }

    try {
      await DataService.updateTransaction(transaction.id, {
        amount,
        description: editedDescription,
        passbookId: editedPassbookId,
      });
      
      Alert.alert(t.success, config.language === 'zh-TW' ? '記帳已更新' : 'Record updated', [
        {
          text: t.ok,
          onPress: () => {
            setIsEditing(false);
            loadData();
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert(t.error, config.language === 'zh-TW' ? '更新交易失敗' : 'Failed to update transaction');
    }
  };

  const handleDelete = () => {
    if (!transaction) return;
    
    Alert.alert(
      t.confirmDelete,
      `${t.confirmDelete} "${transaction.description}"?`,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await DataService.deleteTransaction(transaction.id);
              Alert.alert(t.success, t.transactionDeleted, [
                {
                  text: t.ok,
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert(t.error, t.deleteFailed);
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString(config.language === 'zh-TW' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (loading || !transaction) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{t.loading}</Text>
        </SafeAreaView>
      </View>
    );
  }

  const passbook = passbooks.find(pb => pb.id === transaction.passbookId);

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
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {config.language === 'zh-TW' ? '交易詳情' : 'Transaction Details'}
          </Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: isEditing ? theme.primary : theme.cardSecondary }]}
            onPress={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            <Text style={[styles.editButtonText, { color: isEditing ? '#ffffff' : theme.text }]}>
              {isEditing ? t.save : (config.language === 'zh-TW' ? '編輯' : 'Edit')}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Amount Section */}
          <View style={[styles.amountSection, { backgroundColor: theme.card }]}>
            <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>
              {transaction.isIncome ? t.income : t.expense}
            </Text>
            {isEditing ? (
              <TextInput
                style={[styles.amountInput, { color: transaction.isIncome ? theme.success : theme.error, borderColor: theme.border }]}
                value={editedAmount}
                onChangeText={setEditedAmount}
                keyboardType="decimal-pad"
                placeholderTextColor={theme.textSecondary}
              />
            ) : (
              <Text style={[styles.amountText, { color: transaction.isIncome ? theme.success : theme.error }]}>
                {transaction.isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
              </Text>
            )}
          </View>

          {/* Details Section */}
          <View style={[styles.detailsSection, { backgroundColor: theme.card }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                {config.language === 'zh-TW' ? '說明' : 'Description'}
              </Text>
              {isEditing ? (
                <TextInput
                  style={[styles.detailInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  placeholder={t.noteExample}
                  placeholderTextColor={theme.textSecondary}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{transaction.description}</Text>
              )}
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                {config.language === 'zh-TW' ? '日期' : 'Date'}
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{formatDate(transaction.date)}</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                {config.language === 'zh-TW' ? '存摺' : 'Passbook'}
              </Text>
              {isEditing ? (
                <View style={styles.passbookSelector}>
                  {passbooks.map((pb) => (
                    <TouchableOpacity
                      key={pb.id}
                      style={[
                        styles.passbookOption,
                        { backgroundColor: theme.background, borderColor: theme.border },
                        editedPassbookId === pb.id && { borderColor: theme.primary, borderWidth: 2 }
                      ]}
                      onPress={() => setEditedPassbookId(pb.id)}
                    >
                      <View style={[styles.passbookColor, { backgroundColor: pb.color }]} />
                      <Text style={[styles.passbookOptionText, { color: theme.text }]}>{pb.name}</Text>
                      {editedPassbookId === pb.id && (
                        <Text style={[styles.checkmark, { color: theme.primary }]}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.passbookInfo}>
                  <View style={[styles.passbookColor, { backgroundColor: passbook?.color || theme.textSecondary }]} />
                  <Text style={[styles.detailValue, { color: theme.text }]}>{transaction.passbookName}</Text>
                </View>
              )}
            </View>

            {transaction.category && (
              <>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                    {config.language === 'zh-TW' ? '類別' : 'Category'}
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>{transaction.category}</Text>
                </View>
              </>
            )}
          </View>

          {/* Delete Button */}
          {!isEditing && (
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: theme.error }]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>{t.delete}</Text>
            </TouchableOpacity>
          )}

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
    paddingVertical: 12,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  backIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    paddingHorizontal: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  amountSection: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  amountText: {
    fontSize: 48,
    fontWeight: '700',
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
    minWidth: 200,
  },
  detailsSection: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailInput: {
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  passbookInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passbookColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  passbookSelector: {
    marginTop: 8,
    gap: 8,
  },
  passbookOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  passbookOptionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '700',
  },
  deleteButton: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 40,
  },
});
