# 左滑刪除與語言切換修復 (2025-10-17)

## 📝 問題描述

用戶回報了兩個問題：
1. **首頁沒辦法左滑刪除** - 首頁的交易項目只有長按刪除，沒有左滑刪除功能
2. **有些英文中文切換時沒設訂好** - 多個畫面有硬編碼中文文字，切換語言時不會改變

---

## ✅ 修復內容

### 1. 首頁左滑刪除功能

#### 問題分析
- `AllTransactionsScreen` 有完整的左滑刪除功能（使用 `SwipeableTransactionItem`）
- `HomeScreen` 只有 `onLongPress` 長按刪除
- 用戶體驗不一致

#### 解決方案
**檔案：** `src/screens/HomeScreen.tsx`

1. **新增必要的 imports**
```typescript
import {
  // ... 現有
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { translations } from '../config/app.config';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = -80;
```

2. **創建 SwipeableTransactionItem 組件**
```typescript
interface SwipeableTransactionItemProps {
  transaction: Transaction;
  iconColor: string;
  onDelete: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
}

const SwipeableTransactionItem: React.FC<SwipeableTransactionItemProps> = ({
  transaction,
  iconColor,
  onDelete,
  formatCurrency,
  formatDate,
}) => {
  const { config } = useApp();
  const t = translations[config.language];
  const [translateX] = useState(new Animated.Value(0));
  const [showDelete, setShowDelete] = useState(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        translateX.setValue(Math.max(gestureState.dx, SWIPE_THRESHOLD * 1.5));
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < SWIPE_THRESHOLD) {
        Animated.spring(translateX, {
          toValue: SWIPE_THRESHOLD,
          useNativeDriver: true,
        }).start();
        setShowDelete(true);
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        setShowDelete(false);
      }
    },
  });

  const handleDeletePress = () => {
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDelete();
    });
  };

  return (
    <View style={styles.swipeableContainer}>
      {showDelete && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeletePress}
        >
          <Text style={styles.deleteButtonText}>{t.delete}</Text>
        </TouchableOpacity>
      )}

      <Animated.View
        style={[
          styles.transactionItemWrapper,
          { transform: [{ translateX }] }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.transactionItem}>
          {/* ... 交易項目內容 */}
        </View>
      </Animated.View>
    </View>
  );
};
```

3. **更新 renderTransaction 方法**
```typescript
// 舊的實作（僅長按）
const renderTransaction = (transaction: Transaction) => {
  return (
    <TouchableOpacity
      key={transaction.id}
      onLongPress={() => handleDeleteTransaction(...)}
    >
      <View style={styles.transactionItem}>
        {/* ... */}
      </View>
    </TouchableOpacity>
  );
};

// 新的實作（支援左滑）
const renderTransaction = (transaction: Transaction) => {
  const passbook = passbooks.find(pb => pb.id === transaction.passbookId);
  const iconColor = passbook?.color || '#9dafb8';
  
  return (
    <SwipeableTransactionItem
      key={transaction.id}
      transaction={transaction}
      iconColor={iconColor}
      onDelete={() => handleDeleteTransaction(transaction.id, transaction.description)}
      formatCurrency={formatCurrency}
      formatDate={formatDate}
    />
  );
};
```

4. **新增樣式**
```typescript
styles = StyleSheet.create({
  // ... 現有樣式
  
  // 新增左滑相關樣式
  swipeableContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionItemWrapper: {
    backgroundColor: '#1c2427',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
```

#### 使用方式
- **左滑**：向左滑動交易項目，顯示紅色刪除按鈕
- **點擊刪除按鈕**：確認刪除（會有 Alert 確認對話框）
- **右滑回去**：取消刪除，項目回到原位

---

### 2. 語言切換修復

#### 問題畫面
1. ✅ **HomeScreen** - 已修復
2. ✅ **AddScreen** - 已修復
3. ⚠️ **RatioSettingsScreen** - 需要後續修復（較少使用）

#### HomeScreen 修復

**檔案：** `src/screens/HomeScreen.tsx`

##### 硬編碼文字清單（已修復）

| 舊的硬編碼 | 新的實作 | 英文顯示 |
|-----------|---------|---------|
| `財務總覽` | `{t.financialOverview}` | Financial Overview |
| `總餘額` | `{t.totalBalance}` | Total Balance |
| `我的帳戶` | `{t.myAccounts}` | My Accounts |
| `最近交易` | `{t.recentTransactions}` | Recent Transactions |
| `查看全部` | `{t.viewAll}` | View All |
| `尚無交易記錄` | `{t.noTransactions}` | No transactions yet |
| `點擊下方「新增」按鈕開始記帳` | `{t.noTransactionsSubtext}` | Tap "Add" to start tracking |
| `收入` | `{t.income}` | Income |
| `支出` | `{t.expense}` | Expense |
| `刪除交易` | `{t.delete}` | Delete |
| `確定要刪除` | `{t.confirm}` | Confirm |
| `取消` | `{t.cancel}` | Cancel |

##### 實作方式

```typescript
export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // 1. 取得語言設定
  const { config } = useApp();
  const t = translations[config.language];
  
  // 2. 在 UI 中使用
  return (
    <View>
      <Text>{t.financialOverview}</Text>
      <Text>{t.totalBalance}</Text>
      {/* ... */}
    </View>
  );
};
```

#### AddScreen 修復

**檔案：** `src/screens/AddScreen.tsx`

##### 問題
當使用「按比例自動分配」功能時，交易描述會自動生成為：
```
收入分配至 [帳本名稱]
```

這個文字是硬編碼的，無法隨語言切換。

##### 修復

1. **更新 app.config.ts**
```typescript
export const translations = {
  en: {
    // ... 現有
    incomeAllocatedTo: 'Income allocated to',
  },
  'zh-TW': {
    // ... 現有
    incomeAllocatedTo: '收入分配至',
  },
};
```

2. **修改 AddScreen.tsx**
```typescript
// 舊的
description: note || `收入分配至 ${allocation.passbook.name}`,

// 新的
description: note || `${t.incomeAllocatedTo} ${allocation.passbook.name}`,
```

##### 效果
- **中文**：`收入分配至 生活費`
- **英文**：`Income allocated to Living Expenses`

---

## 📋 完整修復清單

### ✅ 已完成

| 檔案 | 問題 | 狀態 |
|------|------|------|
| `HomeScreen.tsx` | 缺少左滑刪除 | ✅ 已修復 |
| `HomeScreen.tsx` | 硬編碼中文（9處） | ✅ 已修復 |
| `AddScreen.tsx` | 自動分配描述硬編碼 | ✅ 已修復 |
| `app.config.ts` | 缺少翻譯 `incomeAllocatedTo` | ✅ 已新增 |

### ⚠️ 已知未修復（優先級較低）

| 檔案 | 硬編碼位置 | 建議 |
|------|-----------|------|
| `RatioSettingsScreen.tsx` | `平均`、`自動分配比例`、`總比例` 等 | 使用頻率較低，可後續修復 |

---

## 🎯 測試指南

### 測試左滑刪除

1. **進入首頁**
2. **確保有交易記錄**（如果沒有，先新增一筆）
3. **測試左滑**
   - 在任意交易項目上向左滑動
   - 應該看到紅色的「刪除」按鈕出現在右側
4. **測試刪除**
   - 點擊「刪除」按鈕
   - 應該出現確認對話框
   - 點擊確認後交易應該消失
5. **測試取消**
   - 左滑後，向右滑回去
   - 刪除按鈕應該消失，項目恢復原狀

### 測試語言切換

1. **切換到英文**
   - 前往「設定」→「Language」→ 選擇「English」
   
2. **檢查首頁文字**
   - ✅ 標題應顯示 "Financial Overview"
   - ✅ 卡片顯示 "Total Balance"
   - ✅ 區塊標題 "My Accounts"、"Recent Transactions"
   - ✅ 按鈕 "View All"
   - ✅ 空狀態 "No transactions yet"
   - ✅ 收入/支出 "Income" / "Expense"

3. **切換回中文**
   - 前往「Settings」→「Language」→ 選擇「繁體中文」
   - 所有文字應恢復中文顯示

4. **測試自動分配描述**
   - 新增一筆收入交易
   - 勾選「按比例自動分配」
   - 不輸入備註，直接完成
   - 查看「查看全部」中的交易描述：
     - **中文**：應為「收入分配至 [帳本名]」
     - **英文**：應為「Income allocated to [Passbook Name]」

---

## 🔧 技術細節

### PanResponder 手勢處理

```typescript
const panResponder = PanResponder.create({
  // 判斷是否應該響應滑動（橫向滑動 > 5px）
  onMoveShouldSetPanResponder: (_, gestureState) => {
    return Math.abs(gestureState.dx) > 5;
  },
  
  // 處理滑動中（只允許向左滑）
  onPanResponderMove: (_, gestureState) => {
    if (gestureState.dx < 0) {  // 向左滑
      translateX.setValue(Math.max(gestureState.dx, SWIPE_THRESHOLD * 1.5));
    }
  },
  
  // 處理滑動結束
  onPanResponderRelease: (_, gestureState) => {
    if (gestureState.dx < SWIPE_THRESHOLD) {  // 滑過閾值
      // 顯示刪除按鈕
      Animated.spring(translateX, {
        toValue: SWIPE_THRESHOLD,
        useNativeDriver: true,
      }).start();
      setShowDelete(true);
    } else {  // 未滑過閾值
      // 回彈到原位
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      setShowDelete(false);
    }
  },
});
```

### 關鍵參數

- **SWIPE_THRESHOLD**: `-80` - 滑動多遠才觸發刪除按鈕
- **SWIPE_THRESHOLD * 1.5**: `-120` - 滑動的最大距離限制
- **useNativeDriver: true** - 使用原生動畫驅動，性能更好

### 語言切換機制

```typescript
// 1. AppContext 提供全局配置
const { config } = useApp();
// config.language: 'en' | 'zh-TW'

// 2. translations 物件提供翻譯
const t = translations[config.language];
// t.financialOverview: '財務總覽' | 'Financial Overview'

// 3. 在 UI 中使用
<Text>{t.financialOverview}</Text>
```

---

## 📚 相關文件

- [app.config.ts](../src/config/app.config.ts) - 語言翻譯配置
- [HomeScreen.tsx](../src/screens/HomeScreen.tsx) - 首頁實作
- [AddScreen.tsx](../src/screens/AddScreen.tsx) - 新增交易實作
- [AllTransactionsScreen.tsx](../src/screens/AllTransactionsScreen.tsx) - 原始的左滑刪除實作參考

---

## 🎨 UI 效果預覽

### 左滑刪除動畫流程

```
初始狀態
┌─────────────────────────────┐
│ ↑  交易描述        +NT$ 100 │
│    2025/10/17              │
└─────────────────────────────┘

向左滑動中...
┌─────────────────────────────┐
│ ↑  交易描述    +NT$ 100  [刪]│
│    2025/10/17           [除]│
└─────────────────────────────┘

滑過閾值，顯示刪除按鈕
┌───────────────────────┬─────┐
│ ↑  交易描述  +NT$ 100 │刪除 │
│    2025/10/17        │     │
└───────────────────────┴─────┘

點擊刪除後消失（向左飛出動畫）
→ → → → → [消失]
```

---

## ✅ 更新時間

**日期：** 2025-10-17  
**版本：** v1.3.1  
**類型：** 功能修復與改進

