# 新功能實作總結 - 米白色主題 & 背景主題系統

## 📅 實作日期
**2025-10-18**

## ✨ 新增功能

### 1. 淺色模式改為米白色背景 ✅

#### 修改內容
**文件**: `src/theme/Colors.ts`

**更改前**:
```typescript
light: {
  background: '#f5f7fa',        // 灰藍色
  backgroundSecondary: '#ffffff',
  card: '#ffffff',
  // ...
}
```

**更改後**:
```typescript
light: {
  background: '#f5f5dc',        // 米白色 (Beige)
  backgroundSecondary: '#faf8f3', // 淺米白
  backgroundTertiary: '#ebe8df',
  text: '#2c2416',              // 深棕色文字
  textSecondary: '#5a5347',
  textTertiary: '#8a8475',
  border: '#d4cfbf',
  borderLight: '#e8e4d8',
  card: '#fdfcf9',              // 淺米白卡片
  cardSecondary: '#f7f4ed',
  // 其他顏色保持不變
}
```

#### 效果
- 更溫暖、舒適的米白色背景
- 與米白色協調的深棕色文字
- 整體視覺更柔和、護眼

---

### 2. 背景主題系統 ✅

#### 新增文件

##### `src/models/BackgroundTheme.ts`
```typescript
export interface BackgroundTheme {
  id: string;
  name: string;
  nameZh: string;
  imageSource: any;          // 圖片源
  overlayColor: string;      // 濾鏡顏色
  overlayOpacity: number;    // 濾鏡透明度
}

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  {
    id: 'none',
    name: 'None',
    nameZh: '無背景',
    imageSource: null,
    overlayColor: 'transparent',
    overlayOpacity: 0,
  },
  {
    id: 'theme1',
    name: 'Nature',
    nameZh: '自然風景',
    imageSource: require('../../assets/background1/桌布.png'),
    overlayColor: '#000000',   // 黑色濾鏡
    overlayOpacity: 0.3,       // 30% 透明度
  },
];
```

##### `src/components/AppBackground.tsx`
通用背景組件：
- 自動讀取用戶選擇的背景主題
- 應用濾鏡效果
- 支持無背景模式

```typescript
export const AppBackground: React.FC<AppBackgroundProps> = ({ children }) => {
  const { config } = useApp();
  const currentTheme = BACKGROUND_THEMES.find(
    theme => theme.id === (config.backgroundThemeId || 'none')
  );

  if (!currentTheme.imageSource) {
    return <>{children}</>;
  }

  return (
    <ImageBackground source={currentTheme.imageSource}>
      <View style={overlay} />  {/* 濾鏡層 */}
      {children}
    </ImageBackground>
  );
};
```

##### `src/screens/BackgroundThemeSelectionScreen.tsx`
背景主題選擇頁面（350+ 行）：
- 網格佈局顯示主題預覽
- 實時預覽效果（含濾鏡）
- 已選擇主題標記
- 支援中英文

**功能特點**:
- 2 列網格佈局
- 每個主題卡片顯示預覽圖
- 濾鏡效果實時預覽
- 點擊即時應用

---

#### 修改文件

##### `src/config/app.config.ts`
```typescript
export interface AppConfig {
  language: 'en' | 'zh-TW';
  theme: 'light' | 'dark';
  backgroundThemeId?: string;  // ✨ 新增
}
```

##### `src/context/AppContext.tsx`
```typescript
interface AppContextType {
  config: AppConfig;
  updateLanguage: (language: 'en' | 'zh-TW') => Promise<void>;
  updateTheme: (theme: 'light' | 'dark') => Promise<void>;
  updateBackgroundTheme: (backgroundThemeId: string) => Promise<void>;  // ✨ 新增
  t: (key: string) => string;
}

const defaultConfig: AppConfig = {
  language: 'zh-TW',
  theme: 'dark',
  backgroundThemeId: 'none',  // ✨ 新增
};

const updateBackgroundTheme = async (backgroundThemeId: string) => {
  await saveConfig({ ...config, backgroundThemeId });
};
```

##### `src/navigation/AppNavigator.tsx`
註冊新路由：
```typescript
import { BackgroundThemeSelectionScreen } from '../screens/BackgroundThemeSelectionScreen';

<Stack.Screen 
  name="BackgroundThemeSelection" 
  component={BackgroundThemeSelectionScreen} 
/>
```

##### `src/screens/SettingsScreen.tsx`
新增背景主題選項：
```typescript
{/* Background Theme */}
<TouchableOpacity 
  style={styles.settingsItem}
  onPress={() => navigation.navigate('BackgroundThemeSelection')}
>
  <View style={styles.settingsItemLeft}>
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>🖼️</Text>
    </View>
    <Text style={styles.settingsItemLabel}>
      {config.language === 'zh-TW' ? '背景主題' : 'Background Theme'}
    </Text>
  </View>
  <Text style={styles.chevron}>›</Text>
</TouchableOpacity>
```

##### `src/screens/HomeScreen.tsx`
應用背景組件：
```typescript
import { AppBackground } from '../components/AppBackground';

return (
  <AppBackground>
    <View style={styles.container}>  {/* backgroundColor: 'transparent' */}
      {/* 原有內容 */}
    </View>
  </AppBackground>
);
```

---

## 🎯 使用流程

### 用戶操作步驟

1. **進入設置頁面**
   - 點擊底部 Tab Bar 的「設置」

2. **選擇背景主題**
   - 點擊「背景主題」選項（🖼️ 圖標）
   - 進入背景主題選擇頁面

3. **預覽和選擇**
   - 查看不同主題的預覽效果
   - 點擊喜歡的主題卡片
   - 選中的主題會顯示 ✓ 標記

4. **自動應用**
   - 選擇後立即保存到 AsyncStorage
   - 返回首頁即可看到效果

---

## 🎨 設計細節

### 濾鏡系統

#### 為什麼需要濾鏡？
1. **提高可讀性**: 背景圖片可能導致文字難以閱讀
2. **統一視覺**: 保持 UI 元素的清晰度
3. **美觀**: 創造深度感和層次感

#### 濾鏡參數
```typescript
{
  overlayColor: '#000000',    // 黑色
  overlayOpacity: 0.3,        // 30% 透明度
}
```

- **黑色濾鏡**: 適用於淺色背景圖
- **透明度 30%**: 保留圖片細節，同時確保文字可讀

#### 未來擴展
可以為不同背景設置不同濾鏡：
```typescript
{
  id: 'theme2',
  name: 'Sunset',
  overlayColor: '#ff6b35',  // 橙色濾鏡
  overlayOpacity: 0.2,
}
```

---

## 📂 資源管理

### 背景圖片存放
```
assets/
└── background1/
    └── 桌布.png
```

### 添加新背景主題
1. **添加圖片到 assets/**:
   ```
   assets/background2/主題名.png
   ```

2. **在 BackgroundTheme.ts 中註冊**:
   ```typescript
   {
     id: 'theme2',
     name: 'Sunset',
     nameZh: '日落',
     imageSource: require('../../assets/background2/主題名.png'),
     overlayColor: '#000000',
     overlayOpacity: 0.3,
   }
   ```

3. **自動出現在選擇頁面**

---

## 🔧 技術實現

### AppBackground 組件工作原理

```typescript
// 1. 讀取用戶配置
const currentTheme = BACKGROUND_THEMES.find(
  theme => theme.id === config.backgroundThemeId
);

// 2. 無背景時直接返回子組件
if (!currentTheme.imageSource) {
  return <>{children}</>;
}

// 3. 有背景時使用 ImageBackground
return (
  <ImageBackground source={currentTheme.imageSource}>
    {/* 濾鏡層 - 絕對定位覆蓋整個背景 */}
    <View style={{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: currentTheme.overlayColor,
      opacity: currentTheme.overlayOpacity,
    }} />
    
    {/* 原始內容 */}
    {children}
  </ImageBackground>
);
```

### 狀態持久化

```typescript
// 保存到 AsyncStorage
const updateBackgroundTheme = async (backgroundThemeId: string) => {
  const newConfig = { ...config, backgroundThemeId };
  await AsyncStorage.setItem('finora_app_config', JSON.stringify(newConfig));
  setConfig(newConfig);
};

// App 啟動時自動加載
useEffect(() => {
  const loadConfig = async () => {
    const stored = await AsyncStorage.getItem('finora_app_config');
    if (stored) {
      setConfig(JSON.parse(stored));
    }
  };
  loadConfig();
}, []);
```

---

## 🎯 待應用背景的頁面

目前只有 **HomeScreen** 應用了背景，建議為以下頁面也添加：

### 需要添加 AppBackground 的頁面
```typescript
// 1. CheckScreen (月度對帳)
// 2. StatisticsScreen (統計分析)
// 3. SettingsScreen (設置)
// 4. AllTransactionsScreen (全部交易)
```

### 添加方法（統一模式）
```typescript
import { AppBackground } from '../components/AppBackground';

return (
  <AppBackground>
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* 原有內容 */}
    </View>
  </AppBackground>
);
```

---

## 📊 功能對比

### 更新前
- ❌ 固定灰藍色背景
- ❌ 無法自定義背景
- ❌ 視覺單調

### 更新後
- ✅ 溫暖米白色背景
- ✅ 可選背景主題
- ✅ 濾鏡系統保護可讀性
- ✅ 持久化保存選擇
- ✅ 支援中英文
- ✅ 實時預覽效果

---

## 🚀 未來擴展

### P0 - 立即可做
- [ ] 為其他頁面應用背景（CheckScreen, StatisticsScreen 等）
- [ ] 添加更多預設背景主題

### P1 - 短期計劃
- [ ] 支援用戶自定義上傳背景
- [ ] 動態調整濾鏡透明度（滑桿控制）
- [ ] 背景圖片模糊效果（blur）

### P2 - 長期計劃
- [ ] 背景主題分類（自然、抽象、簡約等）
- [ ] 每日自動更換背景
- [ ] 根據時間自動切換主題（早/午/晚）

---

## ✅ 測試檢查清單

- [x] 米白色背景在淺色模式正常顯示
- [x] 深色模式不受影響
- [x] 背景主題選擇頁面正常運作
- [x] 濾鏡效果正確應用
- [x] 選擇保存到 AsyncStorage
- [x] App 重啟後配置正確加載
- [x] HomeScreen 背景正確顯示
- [x] 無背景模式正常工作
- [x] 中英文翻譯正確
- [ ] 其他頁面背景應用（待完成）

---

## 📝 文件變更統計

### 新增文件 (3)
1. `src/models/BackgroundTheme.ts` (42 行)
2. `src/components/AppBackground.tsx` (52 行)
3. `src/screens/BackgroundThemeSelectionScreen.tsx` (236 行)

### 修改文件 (6)
1. `src/theme/Colors.ts` (15 行更改)
2. `src/config/app.config.ts` (1 行新增)
3. `src/context/AppContext.tsx` (10 行新增)
4. `src/navigation/AppNavigator.tsx` (2 行新增)
5. `src/screens/SettingsScreen.tsx` (17 行新增)
6. `src/screens/HomeScreen.tsx` (5 行更改)

### 總計
- **新增代碼**: ~350 行
- **修改代碼**: ~50 行
- **總變更**: ~400 行

---

**實作完成！** 🎉

用戶現在可以：
1. 享受更舒適的米白色淺色主題
2. 選擇自己喜歡的背景主題
3. 體驗更個性化的應用界面
