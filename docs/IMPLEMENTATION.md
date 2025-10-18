# Finora App - 技術實作文檔

## 📋 目錄

1. [架構概覽](#架構概覽)
2. [核心服務](#核心服務)
3. [UI 組件](#ui-組件)
4. [數據模型](#數據模型)
5. [工具函數](#工具函數)
6. [主題系統](#主題系統)
7. [導航系統](#導航系統)

---

## 架構概覽

### 技術棧
- **框架**: React Native + Expo
- **語言**: TypeScript
- **導航**: React Navigation
- **狀態管理**: React Context API
- **本地存儲**: AsyncStorage
- **圖表**: 自定義組件（移除 react-native-chart-kit）

### 項目結構
```
Finora_app/
├── src/
│   ├── components/      # 可重用組件
│   ├── config/          # 配置文件
│   ├── context/         # Context Providers
│   ├── models/          # 數據模型
│   ├── navigation/      # 導航配置
│   ├── screens/         # 頁面組件
│   ├── services/        # 業務邏輯服務
│   ├── theme/           # 主題配置
│   └── utils/           # 工具函數
├── assets/              # 靜態資源
│   ├── icons/          # 本地圖標
│   └── background1/    # 背景圖片（已廢棄）
└── docs/               # 文檔
```

---

## 核心服務

### DataService
**位置**: `src/services/DataService.ts`

#### 主要方法

##### 存摺管理
```typescript
// 獲取所有存摺
static async getPassbooks(): Promise<Passbook[]>

// 創建新存摺
static async createPassbook(passbook: Omit<Passbook, 'id'>): Promise<void>

// 更新存摺
static async updatePassbook(id: string, updates: Partial<Passbook>): Promise<void>

// 刪除存摺
static async deletePassbook(id: string): Promise<void>
```

##### 記帳管理
```typescript
// 獲取所有記帳記錄
static async getTransactions(): Promise<Transaction[]>

// 新增記帳
static async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<void>

// 更新記帳（v2.5.0+ 支援切換存摺）
static async updateTransaction(
  transactionId: string, 
  updates: {
    amount?: number;
    description?: string;
    passbookId?: string;  // v2.5.0+
  }
): Promise<void>

// 刪除記帳
static async deleteTransaction(id: string): Promise<void>
```

##### 比例設定
```typescript
// 獲取比例設定
static async getRatioSettings(): Promise<RatioSetting[]>

// 保存比例設定
static async saveRatioSettings(settings: RatioSetting[]): Promise<void>
```

##### 數據清除
```typescript
// 清除所有數據
static async clearAllData(): Promise<void>
```

#### 存摺切換邏輯（v2.5.0+）

**實作細節**:
```typescript
static async updateTransaction(transactionId: string, updates: {
  amount?: number;
  description?: string;
  passbookId?: string;
}): Promise<void> {
  // 1. 檢查是否切換存摺
  const passbookChanged = updates.passbookId && 
                          updates.passbookId !== oldTransaction.passbookId;
  
  if (passbookChanged) {
    // 2. 從舊存摺還原餘額
    if (oldTransaction.isIncome) {
      oldPassbook.balance -= oldTransaction.amount;
    } else {
      oldPassbook.balance += oldTransaction.amount;
    }
    
    // 3. 在新存摺應用金額
    const newAmount = updates.amount ?? oldTransaction.amount;
    if (oldTransaction.isIncome) {
      newPassbook.balance += newAmount;
    } else {
      newPassbook.balance -= newAmount;
    }
    
    // 4. 保存存摺變更
    await AsyncStorage.setItem(STORAGE_KEYS.PASSBOOKS, JSON.stringify(passbooks));
  }
  
  // 5. 更新記帳記錄
  transactions[index] = {
    ...oldTransaction,
    ...updates,
    updatedAt: new Date(),
  };
  
  await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}
```

---

## UI 組件

### 玻璃態組件

#### GlassCard
**位置**: `src/components/GlassCard.tsx`

**功能**: 半透明卡片容器

**Props**:
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
```

**使用範例**:
```typescript
<GlassCard style={{ padding: 20 }}>
  <Text>內容</Text>
</GlassCard>
```

#### GlassButton
**位置**: `src/components/GlassButton.tsx`

**功能**: 玻璃態按鈕

**Props**:
```typescript
interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}
```

---

### 背景組件（已廢棄）

#### AppBackground
**狀態**: ❌ 已移除（v2.5.0）

**原因**: 用戶反饋背景主題功能不必要

**移除內容**:
- `src/components/AppBackground.tsx`
- `src/models/BackgroundTheme.ts`
- `src/screens/BackgroundThemeSelectionScreen.tsx`

---

## 數據模型

### Passbook
**位置**: `src/models/Passbook.ts`

```typescript
export interface Passbook {
  id: string;                // UUID
  name: string;              // 存摺名稱
  balance: number;           // 餘額
  color: string;             // 顏色（Hex）
  icon?: string;             // 圖標（選填）
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction
**位置**: `src/models/Transaction.ts`

```typescript
export interface Transaction {
  id: string;                // UUID
  amount: number;            // 金額
  description: string;       // 描述/備註
  isIncome: boolean;         // 收入/支出
  passbookId: string;        // 所屬存摺 ID
  passbookName: string;      // 存摺名稱（冗餘，便於顯示）
  date: Date;                // 記帳日期
  createdAt: Date;
  updatedAt: Date;
}
```

### RatioSetting
**位置**: `src/models/RatioSetting.ts`

```typescript
export interface RatioSetting {
  passbookId: string;        // 存摺 ID
  ratio: number;             // 比例（0-100）
}
```

---

## 工具函數

### 格式化工具
**位置**: `src/utils/formatting.ts`

#### formatAmount
**功能**: 大金額 k/M 格式化（v2.5.0+）

**簽名**:
```typescript
export const formatAmount = (
  amount: number, 
  threshold: number = 100000
): string
```

**邏輯**:
```typescript
if (absAmount >= 1000000) {
  // ≥ 1M: 顯示 M
  return `${sign}${(absAmount / 1000000).toFixed(2)}M`;
} else if (absAmount >= threshold) {
  // ≥ 100k: 顯示 k
  return `${sign}${(absAmount / 1000).toFixed(1)}k`;
} else {
  // < 100k: 正常顯示
  return `${sign}${absAmount.toLocaleString('zh-TW')}`;
}
```

**範例**:
```typescript
formatAmount(99999)      // "99,999"
formatAmount(100000)     // "100k"
formatAmount(1234567)    // "1.23M"
```

#### formatCurrencyCompact
**功能**: 帶 NT$ 前綴的格式化

**簽名**:
```typescript
export const formatCurrencyCompact = (
  amount: number, 
  threshold: number = 100000
): string
```

**範例**:
```typescript
formatCurrencyCompact(100000)  // "NT$ 100k"
```

---

## 主題系統

### Colors
**位置**: `src/theme/Colors.ts`

#### Morandi 色彩
```typescript
export const COLORS = {
  // 主色調
  primaryBlue: '#7B68EE',
  sageGreen: '#87A96B',
  dustyPurple: '#9A8194',
  warmYellow: '#E6D690',
  blushPink: '#D4A5A5',
  
  // 玻璃態效果
  glassWhite: 'rgba(255, 255, 255, 0.25)',
  glassWhiteLight: 'rgba(255, 255, 255, 0.1)',
  glassWhiteHeavy: 'rgba(255, 255, 255, 0.4)',
  
  // 狀態顏色
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};
```

#### 主題配置

##### 淺色主題（v2.5.2+）
```typescript
light: {
  background: '#fffbec',        // 溫暖米白
  backgroundSecondary: '#ffffff',
  backgroundTertiary: '#fff8e1',
  text: '#1a1a1a',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  card: '#ffffff',
  cardSecondary: '#fffef7',     // 極淺米白
  success: '#10b981',
  error: '#ff4757',
  warning: '#ff9500',
  info: '#19a2e6',
  primary: '#19a2e6',
}
```

##### 深色主題
```typescript
dark: {
  background: '#111518',
  backgroundSecondary: '#1a2a32',
  backgroundTertiary: '#293338',
  text: '#ffffff',
  textSecondary: '#9dafb8',
  textTertiary: '#6b7b84',
  border: '#293338',
  borderLight: '#3d4b52',
  card: '#1a2a32',
  cardSecondary: '#293338',
  success: '#10b981',
  error: '#ff4757',
  warning: '#ff9500',
  info: '#19a2e6',
  primary: '#19a2e6',
}
```

### Spacing
**位置**: `src/theme/Spacing.ts`

```typescript
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### Typography
**位置**: `src/theme/Typography.ts`

```typescript
export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '700' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
  small: { fontSize: 12, fontWeight: '400' },
};
```

---

## 導航系統

### AppNavigator
**位置**: `src/navigation/AppNavigator.tsx`

#### 底部導航
```typescript
<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Check" component={CheckScreen} />
  <Tab.Screen name="Add" component={AddScreen} />
  <Tab.Screen name="Statistics" component={StatisticsScreen} />
  <Tab.Screen name="Settings" component={SettingsScreen} />
</Tab.Navigator>
```

#### Stack 導航
```typescript
<Stack.Navigator>
  <Stack.Screen name="MainTabs" component={TabNavigator} />
  <Stack.Screen name="PassbookManagement" component={PassbookManagementScreen} />
  <Stack.Screen name="RatioSettings" component={RatioSettingsScreen} />
  <Stack.Screen name="AllTransactions" component={AllTransactionsScreen} />
  <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
  <Stack.Screen name="Feedback" component={FeedbackScreen} />
</Stack.Navigator>
```

---

## 配置系統

### App Config
**位置**: `src/config/app.config.ts`

#### 配置介面
```typescript
export interface AppConfig {
  language: 'en' | 'zh-TW';
  theme: 'light' | 'dark';
}
```

#### 翻譯系統
```typescript
export const translations = {
  en: {
    home: 'Home',
    add: 'Add',
    // ...
  },
  'zh-TW': {
    home: '首頁',
    add: '新增',
    // ...
  },
};
```

### Feedback Config
**位置**: `src/config/feedback.config.ts`

```typescript
export const FEEDBACK_CONFIG = {
  DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/...',
  FEEDBACK_EMAIL: 'serelixstudio@gmail.com',
  TEAM_WEBSITE: 'www.serelix.xyz',  // v2.5.2+
  PREFER_DISCORD: true,
};
```

---

## 頁面組件

### HomeScreen
**功能**: 財務總覽、最近記帳

**關鍵邏輯**:
```typescript
// 計算總餘額
const totalBalance = passbooks.reduce((sum, pb) => sum + pb.balance, 0);

// 獲取最近記帳（最多 5 筆）
const recentTransactions = allTransactions
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 5);
```

### StatisticsScreen
**功能**: 統計分析、單日視圖（v2.5.1+）

**單日分析實作**:
```typescript
// 狀態
const [selectedDateIndex, setSelectedDateIndex] = useState(29); // 今天

// 導航邏輯
const goToPreviousDay = () => {
  setSelectedDateIndex(Math.max(0, selectedDateIndex - 1));
};

const goToNextDay = () => {
  setSelectedDateIndex(Math.min(29, selectedDateIndex + 1));
};

// 日期標籤
const getDateLabel = (index: number) => {
  if (index === 29) return isZhTW ? '今天' : 'Today';
  if (index === 28) return isZhTW ? '昨天' : 'Yesterday';
  return `${29 - index} ${isZhTW ? '天前' : 'days ago'}`;
};

// 顯示數據
const dailyIncome = dailyIncomeData[selectedDateIndex]?.amount || 0;
const dailyExpense = dailyExpenseData[selectedDateIndex]?.amount || 0;
const dailyNet = dailyIncome - dailyExpense;
```

**圖表移除歷史**:
- v2.5.1 之前: 使用 `react-native-chart-kit` 的 `LineChart`
- v2.5.1 之後: 自定義單日視圖組件

### TransactionDetailScreen
**功能**: 記帳詳情、編輯、刪除

**存摺切換實作**（v2.5.0+）:
```typescript
// 狀態
const [isEditing, setIsEditing] = useState(false);
const [editedPassbookId, setEditedPassbookId] = useState(transaction.passbookId);

// 保存邏輯
const handleSave = async () => {
  await DataService.updateTransaction(transaction.id, {
    amount: editedAmount,
    description: editedDescription,
    passbookId: editedPassbookId,  // v2.5.0+
  });
};

// UI: 存摺選擇器
{isEditing ? (
  <View style={styles.passbookSelector}>
    {passbooks.map((pb) => (
      <TouchableOpacity
        key={pb.id}
        style={[
          styles.passbookOption,
          editedPassbookId === pb.id && { borderColor: primary, borderWidth: 2 }
        ]}
        onPress={() => setEditedPassbookId(pb.id)}
      >
        <Text>{pb.name}</Text>
        {editedPassbookId === pb.id && <Text>✓</Text>}
      </TouchableOpacity>
    ))}
  </View>
) : (
  <Text>{transaction.passbookName}</Text>
)}
```

### FeedbackScreen
**功能**: 意見反饋、聯絡信息

**Discord 整合**:
```typescript
const sendToDiscord = async () => {
  const embed = {
    title: '📝 新的反饋',
    color: 0x19a2e6,
    fields: [
      { name: '👤 姓名', value: name || '未提供' },
      { name: '📧 Email', value: email || '未提供' },
      { name: '💬 訊息', value: message },
    ],
    timestamp: new Date().toISOString(),
  };

  await fetch(FEEDBACK_CONFIG.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  });
};
```

**連結功能**（v2.5.3+）:
```typescript
// Email 連結
<TouchableOpacity 
  onPress={() => {
    Linking.openURL(`mailto:${FEEDBACK_CONFIG.FEEDBACK_EMAIL}`);
  }}
>
  <Text>📧 {FEEDBACK_CONFIG.FEEDBACK_EMAIL}</Text>
</TouchableOpacity>

// 官網連結
<TouchableOpacity 
  onPress={() => {
    Linking.openURL(`https://${FEEDBACK_CONFIG.TEAM_WEBSITE}`);
  }}
>
  <Text>🌐 {FEEDBACK_CONFIG.TEAM_WEBSITE}</Text>
</TouchableOpacity>
```

---

## Context API

### AppContext
**位置**: `src/context/AppContext.tsx`

#### 狀態
```typescript
interface AppContextType {
  config: AppConfig;
  updateLanguage: (language: 'en' | 'zh-TW') => Promise<void>;
  updateTheme: (theme: 'light' | 'dark') => Promise<void>;
  t: (key: string) => string;  // 翻譯函數
}
```

#### 使用範例
```typescript
const { config, updateLanguage, updateTheme, t } = useApp();

// 切換語言
await updateLanguage('zh-TW');

// 切換主題
await updateTheme('dark');

// 翻譯
const title = t('home');  // "首頁" or "Home"
```

---

## 存儲 Keys

### AsyncStorage Keys
```typescript
export const STORAGE_KEYS = {
  PASSBOOKS: 'finora_passbooks',
  TRANSACTIONS: 'finora_transactions',
  RATIO_SETTINGS: 'finora_ratio_settings',
  APP_CONFIG: 'finora_app_config',
  FEEDBACKS: 'finora_feedbacks',
};
```

---

## 性能優化

### 1. 記帳列表虛擬化
```typescript
<FlatList
  data={transactions}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <TransactionItem item={item} />}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### 2. 記憶化計算
```typescript
const totalBalance = useMemo(() => {
  return passbooks.reduce((sum, pb) => sum + pb.balance, 0);
}, [passbooks]);
```

### 3. 防抖輸入
```typescript
const [searchText, setSearchText] = useState('');
const debouncedSearch = useDebounce(searchText, 300);
```

---

## 錯誤處理

### AsyncStorage 錯誤
```typescript
try {
  await AsyncStorage.setItem(key, value);
} catch (error) {
  console.error('Storage error:', error);
  Alert.alert('錯誤', '保存失敗，請重試');
}
```

### 網絡請求錯誤
```typescript
try {
  await fetch(url);
} catch (error) {
  console.error('Network error:', error);
  // 離線備份
  await saveOfflineBackup(data);
}
```

---

## 測試建議

### 單元測試
```typescript
// DataService.test.ts
describe('DataService', () => {
  it('should create passbook', async () => {
    const passbook = { name: 'Test', balance: 0, color: '#000' };
    await DataService.createPassbook(passbook);
    const passbooks = await DataService.getPassbooks();
    expect(passbooks).toHaveLength(1);
  });
});
```

### 集成測試
```typescript
// TransactionFlow.test.ts
describe('Transaction Flow', () => {
  it('should switch passbook and update balance', async () => {
    // 創建記帳
    await DataService.addTransaction({...});
    
    // 切換存摺
    await DataService.updateTransaction(id, { passbookId: newId });
    
    // 驗證餘額
    const passbooks = await DataService.getPassbooks();
    expect(passbooks[0].balance).toBe(expectedBalance);
  });
});
```

---

## 開發工具

### 調試
```typescript
// 開發模式日誌
if (__DEV__) {
  console.log('Transaction:', transaction);
}
```

### React DevTools
```bash
npx react-devtools
```

### Expo DevTools
```bash
npx expo start --dev-client
```

---

## 構建與部署

### 開發預覽
```bash
npm start
```

### Android 構建
```bash
eas build --platform android
```

### iOS 構建
```bash
eas build --platform ios
```

---

## 相關文檔

- `docs/FEATURES.md` - 功能說明
- `DEVELOPMENT_GUIDE.md` - 開發指南
- `CHANGELOG.md` - 變更歷史

---

**最後更新**: 2025-10-18  
**文檔版本**: 2.5.3
