# 📱 本地圖示設定指南 | Local Icons Setup Guide

**版本**: v2.2.0  
**更新日期**: 2025-10-17  
**離線狀態**: ✅ 100% 離線

---

## 🎯 為什麼使用本地圖示？

使用本地圖示有以下優點：

- ✅ **完全離線** - 不需要網路連接
- ✅ **更快載入** - 無需下載，立即顯示
- ✅ **更穩定** - 不受網路狀況影響
- ✅ **自訂性** - 可以使用任何您喜歡的圖示
- ✅ **隱私保護** - 無外部請求

---

## 📋 圖示優先順序

應用程式會按照以下順序選擇圖示：

```
1. localSource (本地圖片) ← 推薦！完全離線
   ↓ 如果沒有
2. url (網路圖片) ← 需要網路
   ↓ 如果沒有
3. emoji (表情符號) ← 預設，完全離線
```

---

## 🚀 快速開始：3 步驟設定本地圖示

### 步驟 1: 下載圖示

#### 選項 A：從 Flaticon 下載（推薦）

1. 訪問您之前提供的連結：
   - Home 圖示: https://www.flaticon.com/free-icon/home_9643115
   - Statistics 圖示: https://www.flaticon.com/free-icon/graph_13522655

2. 點擊 **Download PNG**
3. 選擇尺寸：**512px** 或 **256px**（推薦）
4. 下載圖片

#### 選項 B：其他圖示網站

- **Icons8**: https://icons8.com/
- **Iconify**: https://icon-sets.iconify.design/
- **Material Icons**: https://fonts.google.com/icons

---

### 步驟 2: 放置圖示文件

將下載的圖片放到專案的 `assets/icons/` 資料夾：

```
Finora_app/
├── assets/
│   ├── icons/              ← 放這裡！
│   │   ├── home.png        ← 首頁圖示
│   │   ├── passbook.png    ← 存摺圖示
│   │   ├── add.png         ← 新增圖示
│   │   ├── statistics.png  ← 統計圖示
│   │   └── settings.png    ← 設定圖示
│   ├── icon.png
│   └── splash-icon.png
```

#### 檔案命名建議：

| Tab 名稱 | 建議檔名 | 用途 |
|---------|---------|------|
| home | `home.png` | 首頁 |
| check | `passbook.png` 或 `check.png` | 存摺 |
| add | `add.png` 或 `plus.png` | 新增交易 |
| statistics | `statistics.png` 或 `chart.png` | 統計分析 |
| settings | `settings.png` 或 `gear.png` | 設定 |

---

### 步驟 3: 更新配置文件

編輯 `src/config/app.config.ts`：

```typescript
// Tab icons with different styles
export const tabIcons: Record<string, TabIconConfig> = {
  home: {
    emoji: '🏠',
    char: '⌂',
    localSource: require('../../assets/icons/home.png'), // ← 取消註解並確認路徑
  },
  check: {
    emoji: '📖',
    char: '☰',
    localSource: require('../../assets/icons/passbook.png'),
  },
  add: {
    emoji: '➕',
    char: '+',
    localSource: require('../../assets/icons/add.png'),
  },
  statistics: {
    emoji: '📊',
    char: '≡',
    localSource: require('../../assets/icons/statistics.png'),
  },
  settings: {
    emoji: '⚙️',
    char: '⚙',
    localSource: require('../../assets/icons/settings.png'),
  },
};
```

---

## 📐 圖示規格建議

### 尺寸
- **推薦**: 256x256 px 或 512x512 px
- **最小**: 64x64 px
- **最大**: 1024x1024 px

### 格式
- ✅ **PNG** - 推薦（支援透明背景）
- ✅ **JPG** - 可用（無透明背景）
- ✅ **WebP** - 可用（較小檔案）

### 顏色
- **單色圖示** - 推薦（會自動著色）
- **彩色圖示** - 需要移除 `tintColor` 屬性

### 檔案大小
- **推薦**: < 50 KB
- **可接受**: < 100 KB
- **避免**: > 200 KB

---

## 🎨 進階自訂

### 1. 使用彩色圖示（不著色）

如果您想使用彩色圖示而不是單色，需要修改 `AppNavigator.tsx`：

```typescript
// 找到 TabIcon 組件
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const iconConfig = tabIcons[name as keyof typeof tabIcons];
  const iconLocalSource = iconConfig?.localSource;

  if (iconLocalSource) {
    return (
      <View style={styles.tabIconContainer}>
        <Image
          source={iconLocalSource}
          style={{
            width: 24,
            height: 24,
            // 移除 tintColor 以顯示原始顏色
            // tintColor: focused ? COLORS.white : COLORS.textSecondary,
            opacity: focused ? 1 : 0.6, // 用透明度代替著色
          }}
          resizeMode="contain"
        />
      </View>
    );
  }
  // ...
};
```

---

### 2. 調整圖示大小

在 `AppNavigator.tsx` 中修改：

```typescript
style={{
  width: 28,    // 調整寬度
  height: 28,   // 調整高度
  tintColor: focused ? COLORS.white : COLORS.textSecondary,
}}
```

---

### 3. 選中/未選中使用不同圖示

```typescript
export const tabIcons: Record<string, TabIconConfig> = {
  home: {
    emoji: '🏠',
    char: '⌂',
    localSource: require('../../assets/icons/home.png'),
    localSourceActive: require('../../assets/icons/home-active.png'), // 選中時
  },
};
```

然後在 `AppNavigator.tsx` 中：

```typescript
const iconSource = focused 
  ? (iconConfig?.localSourceActive || iconConfig?.localSource)
  : iconConfig?.localSource;
```

---

## 🔄 混合使用本地圖示和 Emoji

您可以為某些 Tab 使用本地圖示，其他使用 Emoji：

```typescript
export const tabIcons: Record<string, TabIconConfig> = {
  home: {
    emoji: '🏠',
    localSource: require('../../assets/icons/home.png'), // 使用本地圖示
  },
  check: {
    emoji: '📖', // 使用 Emoji（沒有 localSource）
  },
  add: {
    emoji: '➕', // 使用 Emoji
  },
  statistics: {
    emoji: '📊',
    localSource: require('../../assets/icons/statistics.png'), // 使用本地圖示
  },
  settings: {
    emoji: '⚙️', // 使用 Emoji
  },
};
```

---

## 🛠️ 故障排除

### 問題 1: 圖示不顯示

**可能原因**:
- 檔案路徑錯誤
- 檔案不存在
- 檔名大小寫錯誤

**解決方案**:
```bash
# 檢查檔案是否存在
ls assets/icons/

# 確認路徑正確（相對於 app.config.ts）
# 從 src/config/app.config.ts 到 assets/icons/
# 正確路徑: ../../assets/icons/home.png
```

---

### 問題 2: TypeScript 錯誤

**錯誤訊息**: `Cannot find module '../../assets/icons/home.png'`

**解決方案 A** - 添加類型聲明：

創建 `src/types/assets.d.ts`：

```typescript
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}
```

**解決方案 B** - 使用 @ts-ignore：

```typescript
// @ts-ignore
localSource: require('../../assets/icons/home.png'),
```

---

### 問題 3: 圖示顯示太大/太小

**解決方案**:

調整 `width` 和 `height`：

```typescript
style={{
  width: 24,   // 調整這個值（16-32 推薦）
  height: 24,  // 調整這個值
  tintColor: focused ? COLORS.white : COLORS.textSecondary,
}}
```

---

### 問題 4: 圖示沒有變色

**原因**: 圖片可能是彩色的，`tintColor` 只對單色圖示有效

**解決方案**:
1. 使用單色 PNG（黑色或白色）
2. 或移除 `tintColor` 屬性保留原色

---

## 📦 完整範例

### 1. 下載這些圖示

從 Flaticon 下載以下 5 個圖示（選擇 256px PNG）：

- Home: https://www.flaticon.com/free-icon/home_9643115
- Passbook: https://www.flaticon.com/free-icon/notebook_3305812
- Add: https://www.flaticon.com/free-icon/plus_4315609
- Statistics: https://www.flaticon.com/free-icon/graph_13522655
- Settings: https://www.flaticon.com/free-icon/settings_2099058

### 2. 重新命名檔案

```
下載的檔案 → 重新命名為
home_9643115.png → home.png
notebook_3305812.png → passbook.png
plus_4315609.png → add.png
graph_13522655.png → statistics.png
settings_2099058.png → settings.png
```

### 3. 複製到專案

```powershell
# 在 Finora_app 根目錄執行
Copy-Item "C:\Users\User\Downloads\home.png" "assets\icons\home.png"
Copy-Item "C:\Users\User\Downloads\passbook.png" "assets\icons\passbook.png"
Copy-Item "C:\Users\User\Downloads\add.png" "assets\icons\add.png"
Copy-Item "C:\Users\User\Downloads\statistics.png" "assets\icons\statistics.png"
Copy-Item "C:\Users\User\Downloads\settings.png" "assets\icons\settings.png"
```

### 4. 更新配置

編輯 `src/config/app.config.ts`，取消註解 `localSource` 行。

### 5. 重新載入應用

```bash
# 按 'r' 重新載入
# 或重啟 Metro
npx expo start
```

---

## ✅ 驗證清單

完成設定後，請檢查：

- [ ] 所有 5 個圖示檔案都在 `assets/icons/` 資料夾
- [ ] 檔案格式為 PNG
- [ ] 檔案大小 < 100 KB
- [ ] `app.config.ts` 已更新 `localSource`
- [ ] 應用程式已重新載入
- [ ] 所有 Tab 圖示正常顯示
- [ ] 選中/未選中顏色正確
- [ ] 飛行模式下圖示正常顯示

---

## 🎉 完成！

現在您的 Finora 應用使用**完全離線**的本地圖示！

### 優點總結：
- ✅ 無需網路連接
- ✅ 載入速度更快
- ✅ 自訂您喜歡的圖示
- ✅ 100% 隱私保護

---

## 🔗 相關文件

- [離線使用指南](./OFFLINE_GUIDE.md)
- [圖示自訂指南](./ICON_CUSTOMIZATION_GUIDE.md)
- [功能完整清單](./FEATURES_COMPLETE.md)

---

**祝您使用愉快！** 🎨📱✨
