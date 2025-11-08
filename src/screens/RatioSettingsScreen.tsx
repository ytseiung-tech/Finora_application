import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DataService } from '../services/DataService';
import { Passbook } from '../models/Passbook';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';
import { THEME_COLORS } from '../theme/Colors';
import { GlassButton } from '../components/GlassButton';

interface RatioSettingsScreenProps {
  navigation: any;
}

interface PassbookRatio {
  id: string;
  name: string;
  color: string;
  photoUri?: string;
  ratio: number;
}

export const RatioSettingsScreen: React.FC<RatioSettingsScreenProps> = ({ navigation }) => {
  const { config } = useApp();
  const t = translations[config.language];
  const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue;

  const [passbooks, setPassbooks] = useState<PassbookRatio[]>([]);
  const [loading, setLoading] = useState(true);

  const primarySoft = theme.primarySoft || 'rgba(183,154,210,0.14)';
  const cardAlt = theme.cardAlt || theme.card || 'rgba(255,255,255,0.96)';
  const successColor = theme.success || '#22C55E';
  const errorColor = theme.error || '#F97373';

  useFocusEffect(
    useCallback(() => {
      loadPassbooks();
    }, [])
  );

  const loadPassbooks = async () => {
    try {
      setLoading(true);
      const pbs: Passbook[] = await DataService.getPassbooks();

      if (!pbs || pbs.length === 0) {
        setPassbooks([]);
        return;
      }

      const explicitTotal = pbs.reduce(
        (sum, pb) => sum + (typeof pb.ratio === 'number' ? pb.ratio : 0),
        0
      );

      const useDefault = explicitTotal === 0;
      const equal = useDefault ? Math.floor(100 / pbs.length) : 0;
      const remainder = useDefault ? 100 - equal * pbs.length : 0;

      const ratios: PassbookRatio[] = pbs.map((pb, index) => {
        let ratio = 0;

        if (typeof pb.ratio === 'number') {
          ratio = pb.ratio;
        } else if (useDefault) {
          ratio = equal + (index === 0 ? remainder : 0);
        }

        return {
          id: pb.id,
          name: pb.name,
          color: pb.color,
          photoUri: pb.photoUri,
          ratio,
        };
      });

      setPassbooks(ratios);
    } catch (error) {
      console.error('Error loading passbooks:', error);
      Alert.alert(
        t.error,
        config.language === 'zh-TW' ? '載入存摺失敗' : 'Failed to load passbooks'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRatioChange = (id: string, value: string) => {
    const numValue = parseInt(value || '0', 10);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;

    setPassbooks(prev =>
      prev.map(pb => (pb.id === id ? { ...pb, ratio: numValue } : pb))
    );
  };

  const getTotalRatio = () =>
    passbooks.reduce((sum, pb) => sum + (pb.ratio || 0), 0);

  const handleSave = async () => {
    const totalRatio = getTotalRatio();

    if (totalRatio !== 100) {
      const message =
        config.language === 'zh-TW'
          ? `所有存摺的比例總和必須為 100%\n目前總和：${totalRatio}%`
          : `Total ratio must equal 100%\nCurrent total: ${totalRatio}%`;

      Alert.alert(t.ratioError, message, [{ text: t.ok }]);
      return;
    }

    try {
      for (const pb of passbooks) {
        await DataService.updatePassbook(pb.id, { ratio: pb.ratio });
      }

      Alert.alert(t.success, t.ratioSaved, [
        {
          text: t.ok,
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log('Error saving ratios:', error);
      Alert.alert(t.error, t.ratioSaveFailed);
    }
  };

  const handleAutoDistribute = () => {
    if (passbooks.length === 0) return;

    const equal = Math.floor(100 / passbooks.length);
    const remainder = 100 - equal * passbooks.length;

    setPassbooks(prev =>
      prev.map((pb, index) => ({
        ...pb,
        ratio: equal + (index === 0 ? remainder : 0),
      }))
    );
  };

  const renderPassbookRatio = (passbook: PassbookRatio) => (
    <View
      key={passbook.id}
      style={[
        styles.passbookItem,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.passbookLeft}>
        {passbook.photoUri ? (
          <Image
            source={{ uri: passbook.photoUri }}
            style={styles.passbookPhoto}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.colorIndicator,
              { backgroundColor: passbook.color },
            ]}
          />
        )}
        <Text style={[styles.passbookName, { color: theme.text }]}>
          {passbook.name}
        </Text>
      </View>

      <View
        style={[
          styles.ratioInput,
          { backgroundColor: cardAlt, borderColor: theme.border },
        ]}
      >
        <TextInput
          style={[styles.ratioInputText, { color: theme.text }]}
          value={
            Number.isFinite(passbook.ratio)
              ? passbook.ratio.toString()
              : '0'
          }
          onChangeText={value => handleRatioChange(passbook.id, value)}
          keyboardType="number-pad"
          maxLength={3}
          placeholderTextColor={theme.textSecondary}
        />
        <Text
          style={[styles.percentText, { color: theme.textSecondary }]}
        >
          %
        </Text>
      </View>
    </View>
  );

  const totalRatio = getTotalRatio();
  const isValid = totalRatio === 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: theme.text }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t.ratioSettingsTitle}
        </Text>

        <View style={styles.rightActionContainer}>
          <GlassButton
            title={config.language === 'zh-TW' ? '平均' : 'Equal'}
            onPress={handleAutoDistribute}
            variant="secondary"
            size="small"
          />
        </View>
      </View>

      <Text
        style={[styles.subtitle, { color: theme.textSecondary }]}
      >
        {config.language === 'zh-TW'
          ? '總和需為 100%'
          : 'Total must equal 100%'}
      </Text>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[styles.infoText, { color: theme.textSecondary }]}
          >
            {config.language === 'zh-TW'
              ? '設定新增交易時的自動分配比例'
              : 'Set auto-allocation ratio for new transactions'}
          </Text>
        </View>

        {/* Total */}
        <View
          style={[
            styles.totalCard,
            {
              backgroundColor: isValid
                ? 'rgba(34,197,94,0.04)'
                : 'rgba(239,68,68,0.04)',
              borderColor: isValid 
                ? 'rgba(34,197,94,0.15)' 
                : 'rgba(239,68,68,0.15)',
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.totalLabel,
                { color: theme.textSecondary },
              ]}
            >
              {t.totalRatio}
            </Text>
          </View>
          <Text
            style={[
              styles.totalValue,
              {
                color: isValid 
                  ? 'rgba(34,197,94,0.8)' 
                  : 'rgba(239,68,68,0.8)',
              },
            ]}
          >
            {totalRatio}%
          </Text>
        </View>

        {/* List */}
        {loading ? (
          <Text
            style={[
              styles.loadingText,
              { color: theme.textSecondary },
            ]}
          >
            {t.loading}
          </Text>
        ) : passbooks.length > 0 ? (
          <View style={styles.passbooksList}>
            {passbooks.map(renderPassbookRatio)}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { color: theme.textSecondary },
              ]}
            >
              {config.language === 'zh-TW'
                ? '找不到存摺'
                : 'No passbooks found'}
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { color: theme.textSecondary },
              ]}
            >
              {config.language === 'zh-TW'
                ? '請先在設定中建立存摺'
                : 'Create passbooks first in Settings'}
            </Text>
          </View>
        )}

        {/* Save */}
        <View style={styles.saveButtonContainer}>
          <GlassButton
            title={
              isValid
                ? t.save
                : config.language === 'zh-TW' 
                  ? `請調整至 100% (目前 ${totalRatio}%)`
                  : `Adjust to 100% (current ${totalRatio}%)`
            }
            onPress={handleSave}
            variant="primary"
            size="large"
            disabled={!isValid}
            style={{ width: '100%' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  rightActionContainer: {
    minWidth: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 11,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 24,
  },
  infoCard: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 0,
    marginBottom: 10,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 16,
  },
  totalCard: {
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 26,
    fontWeight: '700',
  },
  passbooksList: {
    marginTop: 0,
  },
  passbookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  passbookLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  passbookPhoto: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  passbookName: {
    fontSize: 15,
    fontWeight: '600',
  },
  ratioInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    minWidth: 70,
  },
  ratioInputText: {
    fontSize: 15,
    fontWeight: '600',
    width: 36,
    textAlign: 'right',
    paddingVertical: 2,
  },
  percentText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 2,
  },
  saveButtonContainer: {
    marginTop: 20,
    marginBottom: 8,
    alignItems: 'center',
    paddingHorizontal: 8,
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
    fontSize: 14,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 12,
  },
});
