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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { FEEDBACK_CONFIG } from '../config/feedback.config';
import { THEME_COLORS } from '../theme/Colors';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';

interface FeedbackScreenProps {
  navigation: any;
}

export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const maxLength = 1000;

  const sendToDiscord = async () => {
    try {
      const embed = {
        title: 'New suggestion received',
        color: 0x19a2e6,
        fields: [
          {
            name: 'Name',
            value: name.trim(),
            inline: true,
          },
          {
            name: 'Email',
            value: email.trim(),
            inline: true,
          },
          {
            name: 'Subject',
            value: subject.trim(),
            inline: false,
          },
          {
            name: 'Message',
            value: message.trim(),
            inline: false,
          },
          {
            name: 'Platform',
            value: 'React Native',
            inline: true,
          },
          {
            name: 'Language',
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
    // 驗證所有欄位必填
    if (!name.trim()) {
      Alert.alert(
        config.language === 'zh-TW' ? '錯誤' : 'Error',
        config.language === 'zh-TW' ? '請輸入姓名' : 'Please enter your name'
      );
      return;
    }

    if (!email.trim()) {
      Alert.alert(
        config.language === 'zh-TW' ? '錯誤' : 'Error',
        config.language === 'zh-TW' ? '請輸入電子郵件' : 'Please enter your email'
      );
      return;
    }

    // 驗證 Email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert(
        config.language === 'zh-TW' ? '錯誤' : 'Error',
        config.language === 'zh-TW' ? '電子郵件格式不正確' : 'Invalid email format'
      );
      return;
    }

    if (!subject.trim()) {
      Alert.alert(
        config.language === 'zh-TW' ? '錯誤' : 'Error',
        config.language === 'zh-TW' ? '請輸入主題' : 'Please enter subject'
      );
      return;
    }

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
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.navigate('Home');
                }
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
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.navigate('Home');
                }
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
            style={styles.backButton}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Home');
              }
            }}
          >
            <Text style={[styles.backIcon, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {isZhTW ? '意見反饋' : 'Feedback'}
          </Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Image
                source={require('../../assets/feedback icon/user.png')}
                style={[styles.labelIcon, { tintColor: theme.text }]}
                resizeMode="contain"
              />
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {isZhTW ? '姓名' : 'Name'} <Text style={{ color: theme.error }}>*</Text>
              </Text>
            </View>
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
            <View style={styles.labelRow}>
              <Image
                source={require('../../assets/feedback icon/email.png')}
                style={[styles.labelIcon, { tintColor: theme.text }]}
                resizeMode="contain"
              />
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {isZhTW ? '電子郵件' : 'Email'} <Text style={{ color: theme.error }}>*</Text>
              </Text>
            </View>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
              placeholder={isZhTW ? '請輸入您的電子郵件' : 'Enter your email'}
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Subject Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Image
                source={require('../../assets/feedback icon/office-push-pin.png')}
                style={[styles.labelIcon, { tintColor: theme.text }]}
                resizeMode="contain"
              />
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {isZhTW ? '主題' : 'Subject'} <Text style={{ color: theme.error }}>*</Text>
              </Text>
            </View>
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
            <View style={styles.labelRow}>
              <Image
                source={require('../../assets/feedback icon/chat.png')}
                style={[styles.labelIcon, { tintColor: theme.text }]}
                resizeMode="contain"
              />
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {isZhTW ? '訊息' : 'Message'} <Text style={[styles.requiredText, { color: theme.error }]}>*</Text>
              </Text>
            </View>
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
          <View style={styles.submitButtonWrapper}>
            <GlassButton
              title={sending 
                ? (isZhTW ? '發送中...' : 'Sending...') 
                : (isZhTW ? '提交反饋' : 'Submit Feedback')
              }
              onPress={handleSubmit}
              variant="primary"
              size="large"
              disabled={!message.trim() || sending}
            />
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
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 28,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    textAlign: 'left',
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
    alignItems: 'center',
  },
  infoIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
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
  submitButtonWrapper: {
    marginHorizontal: 16,
    marginBottom: 20,
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
    flexDirection: 'row',
    justifyContent: 'center',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  websiteText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
