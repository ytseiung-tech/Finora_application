# Finora App - 開發指南

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 啟動開發服務器
```bash
npm start
```

### 在設備上運行
```bash
npm run android  # Android
npm run ios      # iOS
```

---

## 📁 專案結構說明

### 核心目錄

#### `/src/screens/`
所有頁面組件，每個文件對應一個頁面：
- `HomeScreen.tsx` - 首頁（餘額、近期交易）
- `AddScreen.tsx` - 新增交易頁面
- `StatisticsScreen.tsx` - 統計分析頁面
- `CheckScreen.tsx` - 月度對帳頁面
- `SettingsScreen.tsx` - 設置頁面
- `TransactionDetailScreen.tsx` - 交易詳情頁面（新增）
- `AllTransactionsScreen.tsx` - 全部交易列表
- `PassbookManagementScreen.tsx` - 帳本管理
- `RatioSettingsScreen.tsx` - 比例設置
- `FeedbackScreen.tsx` - 反饋頁面

#### `/src/services/`
業務邏輯層：
- `DataService.ts` - 所有數據操作的統一入口
  - 帳本 CRUD
  - 交易 CRUD
  - 比例設置
  - 應用配置

#### `/src/models/`
資料模型定義：
- `Passbook.ts` - 帳本模型
- `Transaction.ts` - 交易記錄模型
- `RatioSetting.ts` - 比例設置模型

#### `/src/context/`
全局狀態管理：
- `AppContext.tsx` - 主題和語言狀態

#### `/src/theme/`
主題配置：
- `Colors.ts` - 顏色定義（淺色/深色模式）
- `Typography.ts` - 字體樣式
- `Spacing.ts` - 間距定義

#### `/src/config/`
配置文件：
- `app.config.ts` - 語言翻譯
- `feedback.config.ts` - 反饋配置

---

## 🔧 常用開發任務

### 1. 新增一個頁面

#### 步驟 1: 創建頁面組件
在 `src/screens/` 創建新文件：
```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { THEME_COLORS } from '../theme/Colors';

export const NewScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { config } = useApp();
  const theme = THEME_COLORS[config.theme];
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={{ color: theme.text }}>新頁面</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

#### 步驟 2: 註冊路由
在 `src/navigation/AppNavigator.tsx` 中註冊：
```typescript
import { NewScreen } from '../screens/NewScreen';

// 在 Stack.Navigator 中添加
<Stack.Screen name="NewScreen" component={NewScreen} />
```

#### 步驟 3: 添加導航
從其他頁面導航到新頁面：
```typescript
navigation.navigate('NewScreen');
```

---

### 2. 修改主題顏色

編輯 `src/theme/Colors.ts`：
```typescript
export const THEME_COLORS = {
  light: {
    primary: '#7B68EE',  // 修改主色調
    // ... 其他顏色
  },
  dark: {
    primary: '#9d8fff',  // 修改深色模式主色調
    // ... 其他顏色
  }
};
```

---

### 3. 添加新的翻譯

編輯 `src/config/app.config.ts`：
```typescript
export const translations = {
  'zh-TW': {
    newKey: '新的翻譯',
    // ... 其他翻譯
  },
  'en': {
    newKey: 'New Translation',
    // ... 其他翻譯
  }
};
```

使用翻譯：
```typescript
const { config } = useApp();
const t = translations[config.language];
console.log(t.newKey);
```

---

### 4. 新增資料模型

#### 步驟 1: 定義模型
在 `src/models/` 創建新文件：
```typescript
// src/models/Category.ts
export interface Category {
  id: string;
  name: string;
  icon: string;
  createdAt: Date;
}
```

#### 步驟 2: 在 DataService 中添加方法
在 `src/services/DataService.ts` 中添加：
```typescript
// 獲取分類
static async getCategories(): Promise<Category[]> {
  try {
    const data = await AsyncStorage.getItem('@finora/categories');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

// 添加分類
static async addCategory(category: Omit<Category, 'id'>): Promise<void> {
  try {
    const categories = await this.getCategories();
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    categories.push(newCategory);
    await AsyncStorage.setItem('@finora/categories', JSON.stringify(categories));
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}
```

---

### 5. 添加新的 Tab

在 `src/navigation/AppNavigator.tsx` 的 TabNavigator 中添加：
```typescript
<Tab.Screen 
  name="NewTab" 
  component={NewScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Image 
        source={require('../../assets/icons/new-icon.png')} 
        style={{ width: size, height: size, tintColor: color }} 
      />
    ),
  }}
/>
```

---

## 🎨 UI 組件使用

### 使用主題顏色
```typescript
const { config } = useApp();
const theme = THEME_COLORS[config.theme];

<View style={{ backgroundColor: theme.background }}>
  <Text style={{ color: theme.text }}>內容</Text>
</View>
```

### 使用卡片樣式
```typescript
<View style={[styles.card, { backgroundColor: theme.card }]}>
  {/* 卡片內容 */}
</View>

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
```

### 使用可觸控元素
```typescript
<TouchableOpacity 
  onPress={() => console.log('按下')}
  activeOpacity={0.7}
  style={[styles.button, { backgroundColor: theme.primary }]}
>
  <Text style={{ color: '#ffffff' }}>按鈕</Text>
</TouchableOpacity>
```

---

## 📊 資料操作示例

### 獲取資料
```typescript
import { DataService } from '../services/DataService';

// 在組件中
const loadData = async () => {
  const passbooks = await DataService.getPassbooks();
  const transactions = await DataService.getTransactions();
  console.log(passbooks, transactions);
};

useEffect(() => {
  loadData();
}, []);
```

### 新增資料
```typescript
const handleAddTransaction = async () => {
  await DataService.addTransaction({
    description: '午餐',
    amount: 150,
    passbookId: '1',
    passbookName: 'Needs',
    isIncome: false,
    date: new Date(),
  });
  loadData(); // 重新加載資料
};
```

### 更新資料
```typescript
const handleUpdateTransaction = async (id: string) => {
  await DataService.updateTransaction(id, {
    amount: 200,
    description: '晚餐',
  });
  loadData();
};
```

### 刪除資料
```typescript
const handleDeleteTransaction = async (id: string) => {
  await DataService.deleteTransaction(id);
  loadData();
};
```

---

## 🔍 除錯技巧

### 1. 查看 Console 日誌
在瀏覽器開發者工具或終端中查看日誌：
```typescript
console.log('資料:', data);
console.error('錯誤:', error);
```

### 2. 使用 React DevTools
安裝 React Native Debugger 查看組件狀態

### 3. 檢查 AsyncStorage 資料
```typescript
const checkStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  console.log('Storage Keys:', keys);
  
  const values = await AsyncStorage.multiGet(keys);
  console.log('Storage Values:', values);
};
```

### 4. 清除所有資料（測試用）
```typescript
await DataService.clearAllData();
```

---

## 📦 打包發布

### Android APK
```bash
# 測試版
npx eas-cli build --platform android --profile preview

# 正式版
npx eas-cli build --platform android --profile production
```

### 查看打包狀態
```bash
npx eas-cli build:list
```

---

## 🐛 常見問題

### Q: 為什麼更改沒有生效？
A: 嘗試重新啟動開發服務器（按 `r` 重新加載）

### Q: AsyncStorage 資料不更新？
A: 確保使用 `await` 等待異步操作完成

### Q: 主題顏色沒有變化？
A: 檢查是否正確使用 `theme.xxx` 而不是硬編碼顏色

### Q: 頁面導航失敗？
A: 確認路由名稱在 AppNavigator 中已註冊

---

## 📚 學習資源

- [React Native 文檔](https://reactnative.dev/)
- [Expo 文檔](https://docs.expo.dev/)
- [React Navigation 文檔](https://reactnavigation.org/)
- [TypeScript 文檔](https://www.typescriptlang.org/)

---

**祝編碼愉快！** 💻✨
