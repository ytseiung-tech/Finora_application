import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { FEEDBACK_CONFIG } from '../config/feedback.config';
import { THEME_COLORS } from '../theme/Colors';

interface FeedbackScreenProps {
  navigation: any;
}

export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const theme = THEME_COLORS[config.theme];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const maxLength = 1000;

  const sendToDiscord = async () => {
    try {
      const embed = {
        title: '📝 新的反饋',
        color: 0x19a2e6,
        fields: [
          {
            name: '� 姓名',
            value: name.trim() || '未提供',
            inline: true,
          },
          {
            name: '📧 Email',
            value: email.trim() || '未提供',
            inline: true,
          },
          {
            name: '📌 主題',
            value: subject.trim() || '無主題',
            inline: false,
          },
          {
            name: '�💬 訊息',
            value: message.trim(),
            inline: false,
          },
          {
            name: '📱 平台',
            value: 'React Native',
            inline: true,
          },
          {
            name: '🌐 語言',
            value: config.language === 'zh-TW' ? '繁體中文' : 'English',
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Finora App Feedback',
        },
      };

      const response = await fetch(FEEDBACK_CONFIG.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [embed],
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending to Discord:', error);
      return false;
    }
  };

  const saveFeedback = async () => {
    try {
      const feedback = {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        language: config.language,
      };

      // 從 AsyncStorage 讀取現有反饋
      const existingFeedbackJson = await AsyncStorage.getItem('finora_feedbacks');
      const existingFeedbacks = existingFeedbackJson ? JSON.parse(existingFeedbackJson) : [];

      // 新增反饋
      existingFeedbacks.push(feedback);

      // 儲存回 AsyncStorage
      await AsyncStorage.setItem('finora_feedbacks', JSON.stringify(existingFeedbacks));

      return true;
    } catch (error) {
      console.error('Error saving feedback:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    // 驗證
    if (!message.trim()) {
      Alert.alert(
        config.language === 'zh-TW' ? '錯誤' : 'Error',
        config.language === 'zh-TW' ? '請輸入訊息內容' : 'Please enter message'
      );
      return;
    }

    if (message.trim().length < 10) {
      Alert.alert(
        config.language === 'zh-TW' ? '錯誤' : 'Error',
        config.language === 'zh-TW' 
          ? '訊息內容至少需要 10 個字元' 
          : 'Message must be at least 10 characters'
      );
      return;
    }

    setSending(true);

    try {
      // 先儲存到本地（備份）
      await saveFeedback();

      // 嘗試發送到 Discord（限制連線使用）
      const discordSuccess = await sendToDiscord();

      setSending(false);

      if (discordSuccess) {
        Alert.alert(
          config.language === 'zh-TW' ? '成功' : 'Success',
          config.language === 'zh-TW' 
            ? '感謝您的反饋！我們已收到您的訊息。' 
            : 'Thank you for your feedback! We have received your message.',
          [
            {
              text: 'OK',
              onPress: () => {
                setMessage('');
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        // Discord 失敗但本地已儲存
        Alert.alert(
          config.language === 'zh-TW' ? '已儲存' : 'Saved',
          config.language === 'zh-TW' 
            ? '反饋已儲存到本地。網路連線可能不穩定，我們會在下次連線時嘗試同步。' 
            : 'Feedback saved locally. Network may be unstable, we will try to sync next time.',
          [
            {
              text: 'OK',
              onPress: () => {
                setMessage('');
                navigation.goBack();
              },
            },
          ]
        );
      }
    } catch (error) {
      setSending(false);
      Alert.alert(
        config.language === 'zh-TW' ? '錯誤' : 'Error',
        config.language === 'zh-TW' ? '發生未知錯誤' : 'An unknown error occurred'
      );
    }
  };

  const remainingChars = maxLength - message.length;
  const isZhTW = config.language === 'zh-TW';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.cardSecondary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIcon, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {isZhTW ? '意見反饋' : 'Feedback'}
          </Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Info Section */}
          <View style={[styles.infoCard, { backgroundColor: theme.primary + '26', borderColor: theme.primary + '4D' }]}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              {isZhTW ? '聯絡我們' : 'Contact Us'}
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              {isZhTW 
                ? '如有任何問題或建議，請透過以下方式聯絡我們：'
                : 'For any questions or suggestions, please contact us:'
              }
            </Text>
            <TouchableOpacity 
              style={[styles.emailButton, { backgroundColor: theme.primary + '4D' }]}
              onPress={() => {
                Linking.openURL(`mailto:${FEEDBACK_CONFIG.FEEDBACK_EMAIL}`).catch(err =>
                  console.error('Failed to open email:', err)
                );
              }}
            >
              <Text style={[styles.emailText, { color: theme.primary }]}>
                📧 {FEEDBACK_CONFIG.FEEDBACK_EMAIL}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.websiteButton, { backgroundColor: theme.success + '26' }]}
              onPress={() => {
                Linking.openURL(`https://${FEEDBACK_CONFIG.TEAM_WEBSITE}`).catch(err =>
                  console.error('Failed to open website:', err)
                );
              }}
            >
              <Text style={[styles.websiteText, { color: theme.success }]}>
                🌐 {FEEDBACK_CONFIG.TEAM_WEBSITE}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              👤 {isZhTW ? '姓名' : 'Name'} <Text style={[styles.optionalText, { color: theme.textSecondary }]}>({isZhTW ? '選填' : 'Optional'})</Text>
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              placeholder={isZhTW ? '請輸入您的姓名' : 'Enter your name'}
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              📧 Email <Text style={[styles.optionalText, { color: theme.textSecondary }]}>({isZhTW ? '選填' : 'Optional'})</Text>
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              placeholder={isZhTW ? '請輸入您的 Email' : 'Enter your email'}
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Subject Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              📌 {isZhTW ? '主題' : 'Subject'} <Text style={[styles.optionalText, { color: theme.textSecondary }]}>({isZhTW ? '選填' : 'Optional'})</Text>
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              placeholder={isZhTW ? '請輸入主題' : 'Enter subject'}
              placeholderTextColor={theme.textSecondary}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              💬 {isZhTW ? '訊息' : 'Message'} <Text style={[styles.requiredText, { color: theme.error }]}>*</Text>
            </Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              placeholder={isZhTW 
                ? '請告訴我們您的想法、建議或遇到的問題...' 
                : 'Tell us your thoughts, suggestions, or issues...'
              }
              placeholderTextColor={theme.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={10}
              maxLength={maxLength}
              textAlignVertical="top"
            />
            <Text style={[
              styles.charCount,
              { color: theme.textSecondary },
              remainingChars < 100 && styles.charCountWarning,
              remainingChars <= 0 && { color: theme.error },
            ]}>
              {remainingChars} {isZhTW ? '字元剩餘' : 'characters remaining'}
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: theme.primary },
              (!message.trim() || sending) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!message.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isZhTW ? '提交反饋' : 'Submit Feedback'}
              </Text>
            )}
          </TouchableOpacity>

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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  backIcon: {
    fontSize: 28,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionalText: {
    fontSize: 14,
    fontWeight: '400',
  },
  requiredText: {
    fontSize: 16,
    fontWeight: '700',
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    borderWidth: 1,
  },
  charCount: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  charCountWarning: {
    color: '#ffa500',
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#445560',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  emailButton: {
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
  },
  websiteButton: {
    marginTop: 8,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  websiteText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
