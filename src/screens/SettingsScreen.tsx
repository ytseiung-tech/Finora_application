import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DataService } from '../services/DataService';
import { useApp } from '../context/AppContext';
import { THEME_COLORS } from '../theme/Colors';
import { GlassCard } from '../components/GlassCard';
import { translations } from '../config/app.config';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { config, updateLanguage, updateTheme } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;
  
  const handleAdjustRatio = () => {
    navigation.navigate('RatioSettings');
  };

  const handleLanguageChange = () => {
    Alert.alert(
      t.language,
      t.selectLanguage,
      [
        {
          text: 'English',
          onPress: () => updateLanguage('en'),
        },
        {
          text: '繁體中文',
          onPress: () => updateLanguage('zh-TW'),
        },
        { text: t.cancel, style: 'cancel' },
      ]
    );
  };

  const handleThemeChange = () => {
    navigation.navigate('ThemeSelection');
  };

  const handleClearData = async () => {
    Alert.alert(
      t.clearDataTitle,
      t.clearDataMessage,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await DataService.clearAllData();
              Alert.alert(t.success, t.allDataCleared);
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert(t.error, t.deleteFailed);
            }
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      t.aboutFinora,
      t.aboutMessage,
      [
        {
          text: config.language === 'zh-TW' ? '訪問官網' : 'Visit Website',
          onPress: () => {
            Linking.openURL('https://www.serelix.xyz').catch(err => 
              console.error('Failed to open URL:', err)
            );
          },
        },
        { text: t.ok },
      ]
    );
  };

  const handleFeedback = () => {
    navigation.navigate('Feedback');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{t.settings}</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Main Settings Card */}
          <View style={styles.settingsCardWrapper}>
            <GlassCard
              variant="dark"
              borderRadius={20}
              padding={0}
              margin={0}
            >
              {/* Manage Passbooks */}
              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => navigation.navigate('PassbookManagement')}
              >
                <View style={styles.settingsItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                    <Image
                      source={require('../../assets/setting icon/passbook.png')}
                      style={[styles.iconImage, { tintColor: theme.primary }]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.settingsItemLabel, { color: theme.text }]}>{t.passbookManagement}</Text>
                </View>
                <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
              </TouchableOpacity>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Adjust Ratio */}
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={handleAdjustRatio}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                  <Image
                    source={require('../../assets/setting icon/ratio.png')}
                    style={[styles.iconImage, { tintColor: theme.primary }]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.settingsItemLabel, { color: theme.text }]}>{t.ratioSettings}</Text>
              </View>
              <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Language */}
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={handleLanguageChange}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                  <Image
                    source={require('../../assets/setting icon/language.png')}
                    style={[styles.iconImage, { tintColor: theme.primary }]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.settingsItemLabel, { color: theme.text }]}>{t.language}</Text>
              </View>
              <View style={styles.settingsItemRight}>
                <Text style={[styles.valueText, { color: theme.textSecondary }]}>
                  {config.language === 'en' ? 'English' : '繁體中文'}
                </Text>
                <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Theme */}
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={handleThemeChange}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                  <Image
                    source={require('../../assets/setting icon/theme.png')}
                    style={[styles.iconImage, { tintColor: theme.primary }]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.settingsItemLabel, { color: theme.text }]}>{t.theme}</Text>
              </View>
              <View style={styles.settingsItemRight}>
                <Text style={[styles.valueText, { color: theme.textSecondary }]}>
                  {t[config.theme] || config.theme}
                </Text>
                <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Clear Data */}
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={handleClearData}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.error + '26' }]}>
                  <Image
                    source={require('../../assets/setting icon/trash.png')}
                    style={[styles.iconImage, { tintColor: theme.error }]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.settingsItemLabelDanger, { color: theme.error }]}>{t.clearData}</Text>
              </View>
              <Text style={[styles.chevronDanger, { color: theme.error }]}>›</Text>
            </TouchableOpacity>
            </GlassCard>
          </View>

          {/* About & Feedback Card */}
          <View style={styles.settingsCardWrapper}>
            <GlassCard
              variant="dark"
              borderRadius={20}
              padding={0}
              margin={0}
            >
              {/* About */}
              <TouchableOpacity 
              style={styles.settingsItem}
              onPress={() => navigation.navigate('About')}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                  <Image
                    source={require('../../assets/setting icon/about.png')}
                    style={[styles.iconImage, { tintColor: theme.primary }]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.settingsItemLabel, { color: theme.text }]}>{t.about}</Text>
              </View>
              <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Feedback */}
            <TouchableOpacity 
              style={styles.settingsItem}
              onPress={handleFeedback}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary + '26' }]}>
                  <Image
                    source={require('../../assets/setting icon/feedback.png')}
                    style={[styles.iconImage, { tintColor: theme.primary }]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.settingsItemLabel, { color: theme.text }]}>{t.feedback}</Text>
              </View>
              <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
            </TouchableOpacity>
            </GlassCard>
          </View>

          {/* App Version */}
          <Text style={[styles.versionText, { color: theme.textSecondary }]}>Version 1.0.0</Text>

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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.015,
    textAlign: 'left',
  },
  scrollView: {
    flex: 1,
  },
  glassCard: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsCardWrapper: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  icon: {
    fontSize: 20,
  },
  iconDanger: {
    fontSize: 20,
  },
  settingsItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '400',
  },
  settingsItemLabelDanger: {
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 28,
    fontWeight: '300',
  },
  chevronDanger: {
    fontSize: 28,
    fontWeight: '300',
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  versionText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
  bottomSpacer: {
    height: 40,
  },
});
