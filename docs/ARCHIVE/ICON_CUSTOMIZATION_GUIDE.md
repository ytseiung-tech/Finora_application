# 圖示自訂指南 | Icon Customization Guide

## 📱 如何更換 Tab 圖示

### 方法 1: 使用網路圖片 URL

#### 步驟：

1. **找到你喜歡的圖示**
   - 訪問 [Flaticon](https://www.flaticon.com/)
   - 搜尋你需要的圖示（例如：home, statistics）
   
2. **獲取 CDN URL**
   - 在圖示頁面，右鍵點擊圖示
   - 選擇「複製圖片網址」
   - Flaticon CDN 格式通常是：`https://cdn-icons-png.flaticon.com/512/[id]/[id].png`

3. **更新配置檔案**
   
   編輯 `src/config/app.config.ts`：
   
   ```typescript
   export const tabIcons: Record<string, TabIconConfig> = {
     home: {
       emoji: '🏠',                    // 備用圖示（如果 URL 載入失敗）
       char: '⌂',
       url: 'YOUR_ICON_URL_HERE',      // 新增 url 屬性
     },
     // ... 其他圖示
   };
   ```

#### 範例（已配置）：

✅ **Home 圖示**: 
- URL: `https://cdn-icons-png.flaticon.com/512/9643/9643115.png`
- 來源: [Flaticon - Home Icon](https://www.flaticon.com/free-icon/home_9643115)

✅ **Statistics 圖示**: 
- URL: `https://cdn-icons-png.flaticon.com/512/13522/13522655.png`
- 來源: [Flaticon - Graph Icon](https://www.flaticon.com/free-icon/graph_13522655)

---

### 方法 2: 使用本地圖片（推薦用於離線應用）

1. **下載圖示**
   - 從 Flaticon 或其他網站下載 PNG 圖片
   - 建議尺寸：512x512 或 256x256

2. **放置圖片**
   - 將圖片放到 `assets/icons/` 目錄
   - 例如：`assets/icons/home.png`

3. **更新配置**
   ```typescript
   import homeIcon from '../../assets/icons/home.png';
   
   export const tabIcons = {
     home: {
       emoji: '🏠',
       char: '⌂',
       source: homeIcon,  // 使用 require() 或 import
     },
   };
   ```

4. **更新 AppNavigator.tsx**
   ```typescript
   // 在 TabIcon 組件中
   if (iconConfig?.source) {
     return (
       <Image
         source={iconConfig.source}
         style={{ width: 24, height: 24, ... }}
       />
     );
   }
   ```

---

### 方法 3: 使用 Emoji（目前預設）

最簡單的方式，直接使用 emoji：

```typescript
export const tabIcons = {
  home: {
    emoji: '🏠',   // 就是這個！
    char: '⌂',
  },
};
```

---

## 🎨 圖示顏色控制

圖示會根據選中狀態自動變色：

```typescript
tintColor: focused ? COLORS.white : COLORS.textSecondary
```

- **選中時**: 白色 (`#ffffff`)
- **未選中**: 灰色 (`#9dafb8`)

---

## 🔧 進階自訂

### 修改圖示大小

在 `AppNavigator.tsx` 中：

```typescript
<Image
  source={{ uri: iconUrl }}
  style={{
    width: 28,    // 調整寬度
    height: 28,   // 調整高度
    tintColor: focused ? COLORS.white : COLORS.textSecondary,
  }}
/>
```

### 添加載入指示器

```typescript
const [imageError, setImageError] = React.useState(false);

if (iconUrl && !imageError) {
  return (
    <Image
      source={{ uri: iconUrl }}
      onError={() => setImageError(true)}
      style={...}
    />
  );
}
// Fallback to emoji if image fails
```

---

## 📋 可用的 Tab 名稱

- `home` - 首頁
- `check` - 存摺
- `add` - 新增
- `statistics` - 數據分析
- `settings` - 設定

---

## 🌐 推薦圖示資源

1. **Flaticon** (已使用)
   - https://www.flaticon.com/
   - 免費 + 付費圖示
   - 需要註明來源（免費版）

2. **Icons8**
   - https://icons8.com/
   - 多種風格

3. **Iconify**
   - https://icon-sets.iconify.design/
   - 開源圖示集合

4. **Material Icons**
   - https://fonts.google.com/icons
   - Google 官方圖示

---

## ⚠️ 注意事項

1. **網路圖示需要網路連接**
   - 首次載入會有延遲
   - 離線時會顯示 emoji 備用圖示

2. **版權聲明**
   - Flaticon 免費圖示需要註明來源
   - 付費版可移除版權要求

3. **效能考量**
   - 網路圖示會快取
   - 建議圖片大小 < 50KB
   - PNG 格式支援透明背景

4. **顏色**
   - 使用 `tintColor` 屬性會將圖示變成單色
   - 如需彩色圖示，移除 `tintColor` 屬性

---

## 🚀 快速開始範例

想要更換所有圖示為 Flaticon 風格：

```typescript
export const tabIcons: Record<string, TabIconConfig> = {
  home: {
    emoji: '🏠',
    char: '⌂',
    url: 'https://cdn-icons-png.flaticon.com/512/9643/9643115.png',
  },
  check: {
    emoji: '📖',
    char: '☰',
    url: 'https://cdn-icons-png.flaticon.com/512/XXX/XXX.png', // 替換成你的 URL
  },
  add: {
    emoji: '➕',
    char: '+',
    url: 'https://cdn-icons-png.flaticon.com/512/XXX/XXX.png',
  },
  statistics: {
    emoji: '📊',
    char: '≡',
    url: 'https://cdn-icons-png.flaticon.com/512/13522/13522655.png',
  },
  settings: {
    emoji: '⚙️',
    char: '⚙',
    url: 'https://cdn-icons-png.flaticon.com/512/XXX/XXX.png',
  },
};
```

儲存後重新載入應用程式即可看到新圖示！
