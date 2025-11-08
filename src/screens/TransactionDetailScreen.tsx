import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DataService } from '../services/DataService';
import { Transaction, TransactionCategory } from '../models/Transaction';
import { Passbook } from '../models/Passbook';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';
import { SPACING, RADIUS, FONT, SHADOW } from '../theme/DesignSystem';
import { formatCompactNumber } from '../utils/formatting';

export const TransactionDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [passbooks, setPassbooks] = useState<Passbook[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPassbookId, setEditedPassbookId] = useState('');
  const [editedDate, setEditedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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
        setEditedDate(new Date(foundTransaction.date));
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
        date: editedDate,
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
    if (Math.abs(amount) >= 100000) {
      return `$${formatCompactNumber(amount)}`;
    }
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
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIcon, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {config.language === 'zh-TW' ? '交易詳情' : 'Transaction Details'}
          </Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Save Button for Edit Mode */}
          {isEditing && (
            <View style={[styles.topActionBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.saveText}>{t.save}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Edit/Delete Buttons */}
          {!isEditing && (
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={[styles.editBtn, { backgroundColor: theme.primarySoft }]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={[styles.actionButtonText, { color: theme.primary }]}>
                  {config.language === 'zh-TW' ? '編輯' : 'Edit'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteBtn, { backgroundColor: theme.accent }]}
                onPress={handleDelete}
              >
                <Text style={styles.actionButtonText}>
                  {config.language === 'zh-TW' ? '刪除' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
              <Text style={[styles.amountText, { color: transaction.isIncome ? theme.success : '#FF5A7A' }]}>
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
              {isEditing ? (
                <View style={styles.dateTimeEditContainer}>
                  <TouchableOpacity
                    style={[styles.dateTimeEditButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={() => setShowDatePicker(!showDatePicker)}
                  >
                    <Text style={[styles.dateTimeEditText, { color: theme.text }]}>
                      {editedDate.toLocaleDateString(config.language === 'zh-TW' ? 'zh-TW' : 'en-US')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dateTimeEditButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={() => setShowTimePicker(!showTimePicker)}
                  >
                    <Text style={[styles.dateTimeEditText, { color: theme.text }]}>
                      {editedDate.toLocaleTimeString(config.language === 'zh-TW' ? 'zh-TW' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{formatDate(transaction.date)}</Text>
              )}
            </View>

            {showDatePicker && isEditing && (
              <DateTimePicker
                value={editedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (date) {
                    setEditedDate(date);
                  }
                }}
              />
            )}

            {showTimePicker && isEditing && (
              <DateTimePicker
                value={editedDate}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (date) {
                    setEditedDate(date);
                  }
                }}
              />
            )}

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
                        styles.passbookRow,
                        { backgroundColor: theme.card, borderColor: theme.border },
                        editedPassbookId === pb.id && { borderColor: theme.primary, borderWidth: 2 }
                      ]}
                      onPress={() => setEditedPassbookId(pb.id)}
                    >
                      {pb.photoUri ? (
                        <Image
                          source={{ uri: pb.photoUri }}
                          style={styles.passbookAvatar}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.passbookAvatar, { backgroundColor: pb.color }]} />
                      )}
                      <Text style={[styles.passbookOptionText, { color: theme.text }]}>{pb.name}</Text>
                      {editedPassbookId === pb.id && (
                        <Text style={[styles.checkIcon, { color: theme.primary }]}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.passbookInfo}>
                  {passbook?.photoUri ? (
                    <Image
                      source={{ uri: passbook.photoUri }}
                      style={styles.passbookPhotoSmall}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.passbookColor, { backgroundColor: passbook?.color || theme.textSecondary }]} />
                  )}
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  backIcon: {
    fontSize: 26,
    fontWeight: '400',
  },
  headerTitle: {
    ...FONT.titleL,
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  topActionBar: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    ...SHADOW.softCard,
  },
  saveButton: {
    width: '100%',
    height: 48,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  actionBar: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  editBtn: {
    flex: 1,
    height: 50,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    flex: 1,
    height: 50,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  loadingText: {
    ...FONT.body,
    textAlign: 'center',
    paddingVertical: 32,
  },
  amountSection: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...SHADOW.softCard,
  },
  amountLabel: {
    ...FONT.label,
    marginBottom: 8,
  },
  amountText: {
    fontSize: 40,
    fontWeight: '800',
  },
  amountInput: {
    fontSize: 40,
    fontWeight: '800',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    textAlign: 'center',
    minWidth: 200,
  },
  detailsSection: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...SHADOW.softCard,
  },
  detailRow: {
    paddingVertical: SPACING.md,
  },
  detailLabel: {
    ...FONT.label,
    marginBottom: 8,
  },
  detailValue: {
    ...FONT.bodyM,
    fontWeight: '500',
  },
  detailInput: {
    ...FONT.bodyM,
    fontWeight: '500',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  dateTimeEditContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dateTimeEditButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  dateTimeEditText: {
    ...FONT.label,
    fontWeight: '500',
  },
  passbookInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passbookColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  passbookPhotoSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  passbookAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  passbookSelector: {
    marginTop: 8,
    gap: 8,
  },
  passbookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    marginHorizontal: 0,
  },
  passbookOptionText: {
    ...FONT.bodyM,
    fontWeight: '500',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
    fontSize: 18,
  },
  bottomSpacer: {
    height: 24,
  },
});
