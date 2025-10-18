import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { DataService } from '../services/DataService';
import { Passbook } from '../models/Passbook';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';

interface RatioSettingsScreenProps {
  navigation: any;
}

interface PassbookRatio {
  id: string;
  name: string;
  color: string;
  ratio: number;
}

export const RatioSettingsScreen: React.FC<RatioSettingsScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme];
  const [passbooks, setPassbooks] = useState<PassbookRatio[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadPassbooks();
    }, [])
  );

  const loadPassbooks = async () => {
    try {
      setLoading(true);
      const pbs = await DataService.getPassbooks();
      
      // Convert to ratio format, default to equal distribution if no ratio set
      const totalRatio = pbs.reduce((sum, pb) => sum + (pb.ratio || 0), 0);
      const defaultRatio = totalRatio === 0 ? Math.floor(100 / pbs.length) : 0;
      
      const ratios = pbs.map(pb => ({
        id: pb.id,
        name: pb.name,
        color: pb.color,
        ratio: pb.ratio || defaultRatio,
      }));
      
      setPassbooks(ratios);
    } catch (error) {
      console.error('Error loading passbooks:', error);
      Alert.alert(t.error, config.language === 'zh-TW' ? '載入存摺失敗' : 'Failed to load passbooks');
    } finally {
      setLoading(false);
    }
  };

  const handleRatioChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0 || numValue > 100) return;
    
    setPassbooks(prev => 
      prev.map(pb => pb.id === id ? { ...pb, ratio: numValue } : pb)
    );
  };

  const handleSave = async () => {
    const totalRatio = passbooks.reduce((sum, pb) => sum + pb.ratio, 0);
    
    if (totalRatio !== 100) {
      const message = config.language === 'zh-TW'
        ? `所有存摺的比例總和必須為 100%\n目前總和：${totalRatio}%`
        : `Total ratio must equal 100%\nCurrent total: ${totalRatio}%`;
      Alert.alert(
        t.ratioError,
        message,
        [{ text: t.ok }]
      );
      return;
    }

    try {
      // Update all passbooks with new ratios
      for (const pb of passbooks) {
        await DataService.updatePassbook(pb.id, {
          ratio: pb.ratio,
        });
      }
      
      Alert.alert(t.success, t.ratioSaved, [
        {
          text: t.ok,
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error saving ratios:', error);
      Alert.alert(t.error, t.ratioSaveFailed);
    }
  };

  const handleAutoDistribute = () => {
    const equalRatio = Math.floor(100 / passbooks.length);
    const remainder = 100 - (equalRatio * passbooks.length);
    
    setPassbooks(prev => 
      prev.map((pb, index) => ({
        ...pb,
        ratio: equalRatio + (index === 0 ? remainder : 0),
      }))
    );
  };

  const getTotalRatio = () => {
    return passbooks.reduce((sum, pb) => sum + pb.ratio, 0);
  };

  const renderPassbookRatio = (passbook: PassbookRatio) => (
    <View key={passbook.id} style={[styles.passbookItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.passbookLeft}>
        <View style={[styles.colorIndicator, { backgroundColor: passbook.color }]} />
        <Text style={[styles.passbookName, { color: theme.text }]}>{passbook.name}</Text>
      </View>
      
      <View style={[styles.ratioInput, { backgroundColor: theme.cardSecondary }]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={passbook.ratio.toString()}
          onChangeText={(value) => handleRatioChange(passbook.id, value)}
          keyboardType="number-pad"
          maxLength={3}
          placeholderTextColor={theme.textSecondary}
        />
        <Text style={[styles.percentText, { color: theme.textSecondary }]}>%</Text>
      </View>
    </View>
  );

  const totalRatio = getTotalRatio();
  const isValid = totalRatio === 100;

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
          <Text style={[styles.headerTitle, { color: theme.text }]}>{t.ratioSettingsTitle}</Text>
          <TouchableOpacity
            style={[styles.autoButton, { backgroundColor: theme.primary }]}
            onPress={handleAutoDistribute}
          >
            <Text style={styles.autoButtonText}>{config.language === 'zh-TW' ? '平均' : 'Equal'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>{t.autoDistribution}</Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              {t.setRatio}
            </Text>
          </View>

          <View style={[styles.totalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.totalLabel, { color: theme.text }]}>{t.totalRatio}</Text>
            <Text style={[
              styles.totalValue,
              { color: isValid ? theme.success : theme.error }
            ]}>
              {totalRatio}%
            </Text>
          </View>

          {loading ? (
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{t.loading}</Text>
          ) : passbooks.length > 0 ? (
            <View style={styles.passbooksList}>
              {passbooks.map(renderPassbookRatio)}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {config.language === 'zh-TW' ? '找不到存摺' : 'No passbooks found'}
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                {config.language === 'zh-TW' ? '請先在設定中建立存摺' : 'Create passbooks first in Settings'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.saveButton, 
              { backgroundColor: theme.primary },
              !isValid && [styles.saveButtonDisabled, { backgroundColor: theme.border, opacity: 0.5 }]
            ]}
            onPress={handleSave}
            disabled={!isValid}
          >
            <Text style={styles.saveButtonText}>
              {isValid 
                ? t.save 
                : `${t.adjustRatioTooltip} (${config.language === 'zh-TW' ? '目前' : 'current'} ${totalRatio}%)`
              }
            </Text>
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
  autoButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  autoButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  totalCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  totalLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  totalValid: {
    color: '#4cd964',
  },
  totalInvalid: {
    color: '#ff3b30',
  },
  passbooksList: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  passbookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  passbookLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  passbookName: {
    fontSize: 16,
    fontWeight: '600',
  },
  ratioInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    fontSize: 20,
    fontWeight: '700',
    width: 50,
    textAlign: 'right',
    paddingVertical: 8,
  },
  percentText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
  },
  saveButton: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  bottomSpacer: {
    height: 40,
  },
});
