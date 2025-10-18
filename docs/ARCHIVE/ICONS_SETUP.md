# Tab Bar 圖標設定指南

**更新日期**: 2025-10-17  
**版本**: v2.2.0  
**離線狀態**: ✅ 支援完全離線本地圖示

---

## 🎯 當前狀態

目前應用程式使用 **emoji 表情符號**作為預設圖示，這樣可以確保：
- ✅ 應用程式正常運行
- ✅ 無需額外的圖片資源
- ✅ **完全離線可用**

現在您可以選擇使用**本地圖片圖示**，同樣**完全離線**！

---

## 🚀 快速設定：3 步驟

### 1️⃣ 下載圖示

從您提供的連結下載圖示（選擇 **256px PNG**）：

- **Home**: https://www.flaticon.com/free-icon/home_9643115
- **Statistics**: https://www.flaticon.com/free-icon/graph_13522655

或搜尋其他圖示：
- Flaticon: https://flaticon.com
- Icons8: https://icons8.com
- Material Icons: https://fonts.google.com/icons

---

### 2️⃣ 放置檔案

將下載的圖片重新命名並放到專案的 `assets/icons/` 資料夾：

```
Finora_app/
└── assets/
    └── icons/              ← 放這裡！
        ├── home.png        ← 首頁圖示
        ├── passbook.png    ← 存摺圖示（可選）
        ├── add.png         ← 新增圖示（可選）
        ├── statistics.png  ← 統計圖示
        └── settings.png    ← 設定圖示（可選）
```

**PowerShell 複製指令**（在專案根目錄執行）：
```powershell
# 將您下載的檔案複製到 assets/icons/
Copy-Item "C:\Users\User\Downloads\home.png" "assets\icons\home.png"
Copy-Item "C:\Users\User\Downloads\statistics.png" "assets\icons\statistics.png"
```

---

### 3️⃣ 更新配置

編輯 `src/config/app.config.ts`，取消註解 `localSource` 行：

```typescript
export const tabIcons: Record<string, TabIconConfig> = {
  home: {
    emoji: '🏠',
    char: '⌂',
    localSource: require('../../assets/icons/home.png'), // ← 取消這行註解
  },
  check: {
    emoji: '📖',
    char: '☰',
    // localSource: require('../../assets/icons/passbook.png'), // 可選
  },
  add: {
    emoji: '➕',
    char: '+',
    // localSource: require('../../assets/icons/add.png'), // 可選
  },
  statistics: {
    emoji: '📊',
    char: '≡',
    localSource: require('../../assets/icons/statistics.png'), // ← 取消這行註解
  },
  settings: {
    emoji: '⚙️',
    char: '⚙',
    // localSource: require('../../assets/icons/settings.png'), // 可選
  },
};
```

儲存後，在 Expo 中按 **'r'** 重新載入應用程式。

---

## 📋 方案比較

### 方案 A：使用 Emoji（當前預設）✅

**優點**：
- ✅ 無需下載額外檔案
- ✅ 跨平台一致顯示
- ✅ 無編譯問題
- ✅ 檔案大小更小
- ✅ **完全離線**

**當前圖示**：
- Home: 🏠
- Check: 📖
- Add: ➕
- Statistics: 📊
- Settings: ⚙️

---

### 方案 B：使用本地圖片（新增！）✨

**優點**：
- ✅ 更專業的視覺效果
- ✅ 完全自訂外觀
- ✅ 可以使用品牌色彩
- ✅ **完全離線**（無需網路）
- ✅ 比 URL 圖示更快

**建議尺寸**: 256x256 或 512x512 px  
**格式**: PNG（支援透明背景）  
**檔案大小**: < 50 KB

---

### 方案 C：混合使用

您可以為某些 Tab 使用圖片，其他使用 Emoji：

```typescript
export const tabIcons = {
  home: {
    emoji: '🏠',
    localSource: require('../../assets/icons/home.png'), // 使用圖片
  },
  check: {
    emoji: '📖', // 使用 Emoji
  },
  add: {
    emoji: '➕', // 使用 Emoji
  },
  statistics: {
    emoji: '📊',
    localSource: require('../../assets/icons/statistics.png'), // 使用圖片
  },
  settings: {
    emoji: '⚙️', // 使用 Emoji
  },
};
```

---

## 🎨 圖示規格
- Add: 搜尋 "plus" 或 "add"
- Settings: 搜尋 "settings" 或 "gear"

### 步驟 2：創建資料夾結構

```bash
assets/
  └── icons/
      ├── home.png
      ├── home@2x.png (可選)
      ├── home@3x.png (可選)
      ├── statistics.png
      ├── statistics@2x.png (可選)
      └── statistics@3x.png (可選)
```

### 步驟 3：更新 AppNavigator.tsx

將檔案中的 TabIcon 組件改為以下代碼：

```typescript
// Tab Icons
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  // Icon sources - 在檔案頂部定義以確保可以被打包工具處理
  const icons = {
    home: require('../../assets/icons/home.png'),
    check: null, // 可選：添加圖標
    add: null,
    statistics: require('../../assets/icons/statistics.png'),
    settings: null,
  };

  const emojiMap: { [key: string]: string } = {
    home: '🏠',
    check: '✓',
    add: '+',
    statistics: '📊',
    settings: '⚙',
  };

  const iconSource = icons[name as keyof typeof icons];
  const emoji = emojiMap[name] || '?';

  return (
    <View style={styles.tabIconContainer}>
      {iconSource ? (
        <Image 
          source={iconSource}
          style={{
            width: 24,
            height: 24,
            tintColor: focused ? COLORS.white : COLORS.textSecondary,
          }}
          resizeMode="contain"
        />
      ) : (
        <Text style={{
          color: focused ? COLORS.white : COLORS.textSecondary,
          fontSize: 24,
        }}>
          {emoji}
        </Text>
      )}
    </View>
  );
};
```

### 步驟 4：確保 Import

在檔案頂部確保有 Image import：

```typescript
import { View, Text, StyleSheet, Image } from 'react-native';
```

---

## 下載圖標的詳細步驟

### 從 Flaticon 下載

1. **開啟 Flaticon 網站**
   - 點擊上方提供的 URL

2. **選擇格式**
   - 點擊「Download」按鈕
   - 選擇「PNG」格式

3. **選擇尺寸**
   - 建議選擇 96px（適合 3x 解析度）
   - 或下載多個尺寸（48px, 96px, 144px）

4. **下載並重新命名**
   - Home 圖標重新命名為 `home.png`
   - Statistics 圖標重新命名為 `statistics.png`

5. **處理多解析度（可選但建議）**
   - 48px → `home.png` 或 `home@1x.png`
   - 96px → `home@2x.png`
   - 144px → `home@3x.png`

### 使用其他來源

您也可以從以下網站下載圖標：
- **Flaticon**: https://www.flaticon.com
- **Icons8**: https://icons8.com
- **Iconscout**: https://iconscout.com
- **Font Awesome**: https://fontawesome.com

**注意事項**：
- 確保圖標是單色或簡單的設計（因為我們會使用 tintColor）
- 確保有使用授權（商業使用請注意授權條款）
- 背景必須是透明的

---

## 技術說明

### 為什麼使用 require() 而不是動態載入？

React Native 的打包工具（Metro）需要在編譯時知道所有資源檔案。因此：

❌ **不可行**：
```typescript
const path = `../../assets/${name}.png`;
require(path); // 錯誤！動態路徑無法編譯
```

✅ **可行**：
```typescript
const icons = {
  home: require('../../assets/icons/home.png'), // 靜態路徑
  stats: require('../../assets/icons/stats.png'),
};
```

### tintColor 的作用

`tintColor` 屬性可以改變圖標的顏色，但要求：
- 圖標是單色的
- 使用 PNG 格式且背景透明
- 圖標的主要部分是黑色或白色

---

## 疑難排解

### 問題 1：找不到圖標檔案

**錯誤訊息**：
```
Unable to resolve "../../assets/icons/home.png"
```

**解決方案**：
1. 確認檔案路徑正確
2. 確認檔案名稱完全匹配（包括大小寫）
3. 重新啟動 Metro bundler：`npx expo start --clear`

### 問題 2：圖標顯示為空白

**可能原因**：
- 圖標沒有透明背景
- 圖標是全白色的（與 tintColor 衝突）

**解決方案**：
- 使用圖片編輯軟體確保背景透明
- 確保圖標主體是可見的顏色

### 問題 3：圖標太模糊

**解決方案**：
- 使用更高解析度的圖標（96px 或以上）
- 提供 @2x 和 @3x 版本

---

## 建議

### 當前建議：保持使用 Emoji ✅

除非您有特定需求，否則建議保持使用當前的 emoji 圖標：
- 無需額外設定
- 跨平台一致
- 無版權問題
- 檔案更小

### 何時使用圖片圖標

考慮使用圖片圖標的情況：
- 需要品牌一致性
- 有設計師提供的專屬圖標
- 需要更專業的外觀
- emoji 在某些裝置上顯示不佳

---

## 完成檢查清單

如果您決定使用圖片圖標，請確保：

- [ ] 已下載所需的圖標檔案
- [ ] 圖標格式為 PNG 且背景透明
- [ ] 已創建 `assets/icons/` 資料夾
- [ ] 圖標檔案已正確命名
- [ ] 已更新 `AppNavigator.tsx` 代碼
- [ ] 已添加 Image import
- [ ] 已重新啟動 Metro bundler（`npx expo start --clear`）
- [ ] 已在實際裝置或模擬器上測試

---

## 聯絡支援

如有任何問題，請透過以下方式聯繫：
- **Email**: serelixstudio@gmail.com
- **應用內反饋**: 使用「設定」→「反饋」功能

