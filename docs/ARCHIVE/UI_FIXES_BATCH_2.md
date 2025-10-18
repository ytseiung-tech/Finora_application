# UI 修復批次 2 - 2025年10月17日

## 修復摘要

本次更新解決了 7 個使用者回報的問題：

### ✅ 1. Passbook 字體置中
**問題**: CheckScreen 的標題需要置中對齊

**修復**:
- 在 `CheckScreen.tsx` 中，將標題樣式改為 `{ textAlign: 'center', flex: 1 }`
- 移除了原本的 `paddingRight: 48` 以確保完全置中

**檔案**: `src/screens/CheckScreen.tsx`

---

### ✅ 2. 刪除下方選項欄位的字
**問題**: 底部導航欄顯示文字標籤，需要隱藏

**修復**:
- 在 `AppNavigator.tsx` 中，添加 `tabBarShowLabel: false`
- 移除了所有 `tabBarLabel` 屬性
- 移除了 `tabBarLabelStyle` 設定

**效果**: 底部導航欄現在只顯示圖標，沒有文字標籤

**檔案**: `src/navigation/AppNavigator.tsx`

---

### ✅ 3. 統計和設定頁面中文化
**問題**: StatisticsScreen 和 SettingsScreen 在中文模式下仍有英文文字

**修復**:

#### 新增翻譯 (`app.config.ts`):
```typescript
// English
monthlyIncomeVsExpenses: 'Monthly Income vs. Expenses',
netBalance: 'Net Balance',
loading: 'Loading...',
totalsByAccount: 'Totals by Account',
accounts: 'accounts',
allAccounts: 'All Accounts',
managePassbooks: 'Manage Passbooks',
adjustRatio: 'Adjust Ratio',
selectLanguage: 'Select Language',
selectTheme: 'Select Theme',
lightMode: 'Light Mode',
darkMode: 'Dark Mode',
clearDataTitle: 'Clear Data',
clearDataMessage: 'Are you sure you want to clear all transaction data? This action cannot be undone!',
allDataCleared: 'All data has been cleared',
aboutFinora: 'About Finora',
aboutMessage: 'Finora App v1.0.0\n\nAn app to help you manage your finances\n\n© 2025 Finora Team',
ok: 'OK',

// Chinese
monthlyIncomeVsExpenses: '月度收入與支出',
netBalance: '淨餘額',
loading: '載入中...',
totalsByAccount: '各帳戶總計',
accounts: '個帳戶',
allAccounts: '所有帳戶',
managePassbooks: '管理存摺',
adjustRatio: '調整比例',
selectLanguage: '選擇語言',
selectTheme: '選擇主題',
lightMode: '淺色模式',
darkMode: '深色模式',
clearDataTitle: '清除資料',
clearDataMessage: '確定要清除所有交易資料嗎？此操作無法撤銷！',
allDataCleared: '所有資料已清除',
aboutFinora: '關於 Finora',
aboutMessage: 'Finora App v1.0.0\n\n幫助您管理財務的應用程式\n\n© 2025 Finora 團隊',
ok: '確定',
```

#### StatisticsScreen 更新:
- 導入 `useApp` 和 `translations`
- 替換所有硬編碼文字為翻譯變數
- "Statistics" → `{t.statistics}`
- "Monthly Income vs. Expenses" → `{t.monthlyIncomeVsExpenses}`
- "Net Balance" → `{t.netBalance}`
- "Loading..." → `{t.loading}`
- "Totals by Account" → `{t.totalsByAccount}`
- "All Accounts" → `{t.allAccounts}`
- "Total Income" → `{t.totalIncome}`
- "Total Expenses" → `{t.totalExpense}`
- "accounts" → `{t.accounts}`

#### SettingsScreen 更新:
- 替換所有 Alert 對話框文字為翻譯變數
- "Manage Passbooks" → `{t('passbookManagement')}`
- "Adjust Ratio" → `{t('ratioSettings')}`
- "Settings" → `{t('settings')}`
- "About" → `{t('about')}`
- "Feedback" → `{t('feedback')}`
- "Clear Data" → `{t('clearData')}`
- 更新語言選擇對話框為使用 `t('selectLanguage')`
- 更新主題選擇對話框為使用 `t('selectTheme')`, `t('lightMode')`, `t('darkMode')`
- 更新清除資料對話框為使用 `t('clearDataTitle')`, `t('clearDataMessage')`
- 更新關於對話框為使用 `t('aboutFinora')`, `t('aboutMessage')`

**檔案**: 
- `src/config/app.config.ts`
- `src/screens/StatisticsScreen.tsx`
- `src/screens/SettingsScreen.tsx`

---

### ✅ 4. 意見反饋改為 Gmail 聯絡方式
**問題**: 反饋頁面顯示「智能模式」說明，需改為 Gmail 聯絡資訊

**修復前**:
```tsx
<Text>智能模式：優先發送到雲端，離線時儲存本地</Text>
```

**修復後**:
```tsx
<View style={styles.infoCard}>
  <Text style={styles.infoIcon}>📧</Text>
  <Text style={styles.infoTitle}>
    {isZhTW ? '聯絡我們' : 'Contact Us'}
  </Text>
  <Text style={styles.infoText}>
    {isZhTW 
      ? '如有任何問題或建議，請透過以下 Email 聯絡我們：'
      : 'For any questions or suggestions, please contact us via email:'
    }
  </Text>
  <TouchableOpacity style={styles.emailButton}>
    <Text style={styles.emailText}>finoraapp@gmail.com</Text>
  </TouchableOpacity>
</View>
```

**變更**:
- 移除「智能模式」提示區塊
- 新增 Gmail 聯絡資訊卡片
- 顯示聯絡 Email: `finoraapp@gmail.com`
- 添加樣式: `emailButton` 和 `emailText`

**檔案**: `src/screens/FeedbackScreen.tsx`

---

### ⚠️ 5. Light Mode 支援（部分完成）
**問題**: Light Mode 目前只有首頁有改變

**已完成**:
- ✅ CheckScreen 已完全支援 Light/Dark 主題切換
  - 導入 `THEME_COLORS`
  - 使用 `theme = THEME_COLORS[config.theme]`
  - 所有顏色改為動態: `{ backgroundColor: theme.background }`, `{ color: theme.text }` 等

- ✅ StatisticsScreen 部分支援
  - 已導入 `THEME_COLORS`
  - 已更新 header 和 settings 按鈕顏色
  - 仍需更新其餘元素

**待完成**:
- ⏳ StatisticsScreen 完整主題支援
- ⏳ SettingsScreen 主題支援
- ⏳ AllTransactionsScreen 主題支援
- ⏳ FeedbackScreen 主題支援
- ⏳ AddScreen 主題支援
- ⏳ PassbookManagementScreen 主題支援
- ⏳ RatioSettingsScreen 主題支援

**建議**: 使用相同模式更新所有畫面：
1. 導入 `THEME_COLORS`
2. 獲取當前主題: `const theme = THEME_COLORS[config.theme]`
3. 替換硬編碼顏色為動態主題顏色
4. 移除 StyleSheet 中的顏色定義，改為 inline styles

---

### ✅ 6. 修復左滑刪除和格子溢出問題
**問題**: AllTransactionsScreen 的左滑刪除不工作，圖像與金額超出格子

#### 修復 1: 格子溢出
**變更**:
```typescript
// 交易項目容器
transactionItem: {
  overflow: 'hidden',  // 防止內容溢出
}

// 圖標
transactionIcon: {
  flexShrink: 0,  // 防止圖標被壓縮
}

// 資訊區域
transactionInfo: {
  flex: 1,
  marginRight: 8,
  overflow: 'hidden',  // 防止文字溢出
}

// 金額
transactionAmount: {
  flexShrink: 0,  // 防止金額被壓縮
  minWidth: 80,
  textAlign: 'right',
}
```

**文字截斷**:
```tsx
<Text 
  style={styles.transactionDescription} 
  numberOfLines={1} 
  ellipsizeMode="tail"
>
  {transaction.description}
</Text>
```

#### 修復 2: 左滑刪除手勢
**改進的 PanResponder**:
```typescript
const panResponder = PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onMoveShouldSetPanResponder: (_, gestureState) => {
    // 只響應水平滑動，忽略垂直滑動
    return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 30;
  },
  onPanResponderGrant: () => {
    translateX.setOffset(0);
  },
  onPanResponderMove: (_, gestureState) => {
    if (gestureState.dx < 0) {
      const newValue = Math.max(gestureState.dx, SWIPE_THRESHOLD * 1.2);
      translateX.setValue(newValue);
    } else if (gestureState.dx > 0 && showDelete) {
      translateX.setValue(Math.min(gestureState.dx + SWIPE_THRESHOLD, 0));
    }
  },
  onPanResponderRelease: (_, gestureState) => {
    if (gestureState.dx < SWIPE_THRESHOLD / 2) {
      Animated.spring(translateX, {
        toValue: SWIPE_THRESHOLD,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }).start();
      setShowDelete(true);
    } else {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }).start();
      setShowDelete(false);
    }
  },
  onPanResponderTerminate: () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setShowDelete(false);
  },
});
```

**改進**:
- ✅ 更好的手勢檢測（區分水平/垂直滑動）
- ✅ 加入 `onStartShouldSetPanResponder` 確保手勢響應
- ✅ 加入 `onPanResponderGrant` 重置偏移量
- ✅ 加入 `onPanResponderTerminate` 處理手勢中斷
- ✅ 改善動畫參數（tension, friction）使滑動更流暢
- ✅ 支援右滑收回刪除按鈕

**檔案**: `src/screens/AllTransactionsScreen.tsx`

---

### ✅ 7. Total by Account 只在 All Accounts 顯示
**問題**: 統計頁面的「各帳戶總計」區塊應該只在選擇「所有帳戶」時顯示

**修復**:
```tsx
{/* Annual Totals by Account */}
{selectedAccount === 'all' && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{t.totalsByAccount}</Text>
    {/* ... 其餘內容 ... */}
  </View>
)}
```

**效果**: 
- 當選擇「All Accounts」時，顯示各帳戶總計圖表
- 當選擇特定帳戶時，隱藏該區塊

**檔案**: `src/screens/StatisticsScreen.tsx`

---

## 測試建議

### 1. Passbook 字體置中
- [ ] 打開 CheckScreen
- [ ] 確認標題「存摺」/「Passbook」完全置中

### 2. 底部導航欄
- [ ] 查看所有畫面的底部導航欄
- [ ] 確認只有圖標，沒有文字標籤

### 3. 中文化
- [ ] 切換到中文模式
- [ ] 檢查 StatisticsScreen 所有文字都是中文
- [ ] 檢查 SettingsScreen 所有文字和對話框都是中文
- [ ] 測試語言選擇、主題選擇、清除資料、關於對話框

### 4. 意見反饋
- [ ] 打開 FeedbackScreen
- [ ] 確認顯示 Gmail 聯絡資訊（finoraapp@gmail.com）
- [ ] 確認沒有「智能模式」提示

### 5. Light Mode
- [ ] 切換到 Light Mode
- [ ] 檢查 CheckScreen 是否變為淺色主題
- [ ] 檢查其他畫面（目前可能還是暗色）

### 6. 左滑刪除
- [ ] 打開 AllTransactionsScreen
- [ ] 在交易項目上向左滑動
- [ ] 確認刪除按鈕出現
- [ ] 點擊刪除按鈕測試刪除功能
- [ ] 確認文字不會超出格子邊界

### 7. Total by Account
- [ ] 打開 StatisticsScreen
- [ ] 選擇「All Accounts」，確認顯示各帳戶總計圖表
- [ ] 選擇特定帳戶，確認隱藏該圖表

---

## 已知問題

### Light Mode 未完全實作
大部分畫面（除了 HomeScreen 和 CheckScreen）仍使用暗色主題。需要逐一更新：
- StatisticsScreen（部分完成）
- SettingsScreen
- AllTransactionsScreen
- FeedbackScreen
- AddScreen
- PassbookManagementScreen
- RatioSettingsScreen

建議統一使用以下模式：
```typescript
import { THEME_COLORS } from '../theme/Colors';

const { config } = useApp();
const theme = THEME_COLORS[config.theme];

// In JSX
<View style={[styles.container, { backgroundColor: theme.background }]}>
  <Text style={[styles.text, { color: theme.text }]}>Text</Text>
</View>

// Remove color from StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#111518',  // ❌ Remove
  },
  text: {
    fontSize: 16,
    // color: '#ffffff',  // ❌ Remove
  },
});
```

---

## 檔案變更清單

### 修改的檔案
1. `src/screens/CheckScreen.tsx` - 置中標題 + Light Mode 支援
2. `src/navigation/AppNavigator.tsx` - 隱藏底部標籤文字
3. `src/config/app.config.ts` - 新增大量翻譯
4. `src/screens/StatisticsScreen.tsx` - 中文化 + Total by Account 條件 + 部分 Light Mode
5. `src/screens/SettingsScreen.tsx` - 中文化
6. `src/screens/FeedbackScreen.tsx` - Gmail 聯絡資訊
7. `src/screens/AllTransactionsScreen.tsx` - 修復左滑刪除和溢出

### 新增的檔案
- `docs/UI_FIXES_BATCH_2.md` - 本文檔

---

## 下次更新建議

1. **完成 Light Mode 實作**
   - 更新所有畫面支援主題切換
   - 統一使用 THEME_COLORS

2. **全面測試**
   - 測試所有功能在 Light/Dark 模式下的表現
   - 測試所有文字在中文/英文模式下的顯示

3. **效能優化**
   - 檢查不必要的重新渲染
   - 優化動畫效能

4. **無障礙功能**
   - 添加適當的 accessibilityLabel
   - 確保顏色對比度符合標準
