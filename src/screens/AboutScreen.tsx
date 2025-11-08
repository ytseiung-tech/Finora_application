import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { THEME_COLORS } from '../theme/Colors';

interface AboutScreenProps {
  navigation: any;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const { config, t } = useApp();
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err => 
      console.error('Failed to open URL:', err)
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIcon, { color: theme.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {config.language === 'zh-TW' ? '關於' : 'About'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          contentContainerStyle={{ 
            paddingHorizontal: 12,   // 16 → 12 (左右更緊湊)
            paddingTop: 0, 
            paddingBottom: 8         // 12 → 8
          }}
          style={{ 
            flex: 1, 
            marginTop: -6            // -8 → -6 (視覺最穩)
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* App Info Card */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.appIconContainer}>
              <Image
                source={require('../../assets/icon.png')}
                style={styles.appIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.appName, { color: theme.text }]}>Finora</Text>
            <Text style={[styles.appVersion, { color: theme.textSecondary }]}>v1.0.0</Text>
            <Text style={[styles.appDescription, { color: theme.textSecondary }]}>
              {config.language === 'zh-TW' 
                ? '幫助您管理財務的應用程式\n簡單、優雅、高效'
                : 'An app to help you manage your finances\nSimple, Elegant, Efficient'}
            </Text>
          </View>

          {/* Contact Section */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {config.language === 'zh-TW' ? '聯絡我們' : 'Contact Us'}
          </Text>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {/* Website */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleLinkPress('https://www.serelix.xyz')}
            >
              <View style={styles.contactLeft}>
                <Image
                  source={require('../../assets/about icon/globe.png')}
                  style={[styles.contactIcon, { tintColor: theme.primary }]}
                  resizeMode="contain"
                />
                <Text style={[styles.contactLabel, { color: theme.text }]}>
                  {config.language === 'zh-TW' ? '官方網站' : 'Website'}
                </Text>
              </View>
              <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Email */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleLinkPress('mailto:serelixstudio@gmail.com')}
            >
              <View style={styles.contactLeft}>
                <Image
                  source={require('../../assets/about icon/mail.png')}
                  style={[styles.contactIcon, { tintColor: theme.primary }]}
                  resizeMode="contain"
                />
                <Text style={[styles.contactLabel, { color: theme.text }]}>
                  {config.language === 'zh-TW' ? '電子郵件' : 'Email'}
                </Text>
              </View>
              <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Discord */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleLinkPress('https://discord.gg/vKp93F6H2c')}
            >
              <View style={styles.contactLeft}>
                <Image
                  source={require('../../assets/about icon/discord.png')}
                  style={[styles.contactIcon, { tintColor: theme.primary }]}
                  resizeMode="contain"
                />
                <Text style={[styles.contactLabel, { color: theme.text }]}>Discord</Text>
              </View>
              <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Developer Info */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              {config.language === 'zh-TW' ? '開發團隊' : 'Developed by'}
            </Text>
            <Text style={[styles.developerName, { color: theme.text }]}>Serelix Studio Team</Text>
            <Text style={[styles.copyright, { color: theme.textSecondary }]}>
              © 2025 Serelix Studio
            </Text>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
  },
  appIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: -16,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  developerName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
});
