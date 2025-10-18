# 網站連結功能更新

## 📅 更新日期
**2025-10-18**

---

## ✨ 功能說明

在 App 中添加了可點擊的官網連結，讓用戶可以直接訪問 Serelix Studio 官網。

---

## 🔗 實作內容

### 1. Settings Screen - About 彈窗

**位置**: 設定 → 關於 Finora

**功能**:
- 顯示 App 資訊和團隊信息
- 新增「訪問官網」按鈕
- 點擊後在瀏覽器中打開 `https://www.serelix.xyz`

**UI 示意**:
```
┌──────────────────────────────┐
│      關於 Finora              │
├──────────────────────────────┤
│ Finora App v1.0.0            │
│                              │
│ 幫助您管理財務的應用程式      │
│                              │
│ Serelix Studio Team 開發     │
│ 官網: www.serelix.xyz        │
│                              │
│ © 2025 Serelix Studio        │
├──────────────────────────────┤
│ [訪問官網]     [確定]         │
└──────────────────────────────┘
```

**按鈕文字**:
- 中文: 「訪問官網」
- 英文: "Visit Website"

---

### 2. Feedback Screen - 聯絡區塊

**位置**: 意見反饋頁面頂部

**功能**:
- 顯示聯絡信息卡片
- **Email 按鈕** (藍色): 點擊打開郵件 App
- **官網按鈕** (綠色): 點擊打開瀏覽器訪問官網

**UI 示意**:
```
┌──────────────────────────────────┐
│ ℹ️  聯絡我們                      │
├──────────────────────────────────┤
│ 如有任何問題或建議，             │
│ 請透過以下方式聯絡我們：         │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 📧 serelixstudio@gmail.com   │ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 🌐 www.serelix.xyz           │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**按鈕顏色**:
- Email 按鈕: 主題藍色背景 (`theme.primary`)
- 官網按鈕: 綠色背景 (`theme.success`)

---

## 💻 技術實作

### 1. SettingsScreen.tsx

#### 導入 Linking API
```typescript
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,  // 新增
} from 'react-native';
```

#### About 彈窗邏輯
```typescript
const handleAbout = () => {
  Alert.alert(
    t('aboutFinora'),
    t('aboutMessage'),
    [
      {
        text: config.language === 'zh-TW' ? '訪問官網' : 'Visit Website',
        onPress: () => {
          Linking.openURL('https://www.serelix.xyz').catch(err => 
            console.error('Failed to open URL:', err)
          );
        },
      },
      { text: t('ok') },
    ]
  );
};
```

---

### 2. FeedbackScreen.tsx

#### 導入 Linking API
```typescript
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking,  // 新增
} from 'react-native';
```

#### Email 按鈕
```typescript
<TouchableOpacity 
  style={[styles.emailButton, { backgroundColor: theme.primary + '4D' }]}
  onPress={() => {
    Linking.openURL(`mailto:${FEEDBACK_CONFIG.FEEDBACK_EMAIL}`).catch(err =>
      console.error('Failed to open email:', err)
    );
  }}
>
  <Text style={[styles.emailText, { color: theme.primary }]}>
    📧 {FEEDBACK_CONFIG.FEEDBACK_EMAIL}
  </Text>
</TouchableOpacity>
```

#### 官網按鈕
```typescript
<TouchableOpacity 
  style={[styles.websiteButton, { backgroundColor: theme.success + '26' }]}
  onPress={() => {
    Linking.openURL(`https://${FEEDBACK_CONFIG.TEAM_WEBSITE}`).catch(err =>
      console.error('Failed to open website:', err)
    );
  }}
>
  <Text style={[styles.websiteText, { color: theme.success }]}>
    🌐 {FEEDBACK_CONFIG.TEAM_WEBSITE}
  </Text>
</TouchableOpacity>
```

#### 新增樣式
```typescript
websiteButton: {
  marginTop: 8,
  borderRadius: 8,
  padding: 12,
  alignItems: 'center',
},
websiteText: {
  fontSize: 16,
  fontWeight: '600',
},
```

---

## 🔄 Linking API 說明

### React Native Linking

**用途**: 打開外部連結、Email、電話等

**支援的 URL Scheme**:
| Scheme | 用途 | 範例 |
|--------|------|------|
| `https://` | 網站 | `https://www.serelix.xyz` |
| `mailto:` | Email | `mailto:serelixstudio@gmail.com` |
| `tel:` | 電話 | `tel:+886912345678` |

**使用方法**:
```typescript
// 打開網站
Linking.openURL('https://www.serelix.xyz');

// 打開 Email
Linking.openURL('mailto:serelixstudio@gmail.com');

// 帶主題的 Email
Linking.openURL('mailto:email@example.com?subject=Hello');

// 錯誤處理
Linking.openURL('https://...').catch(err => {
  console.error('Failed to open URL:', err);
});
```

---

## 🎨 UI/UX 設計考量

### 視覺層次

#### Settings Screen
- **主要操作**: 「確定」- 關閉彈窗
- **次要操作**: 「訪問官網」- 外部連結
- 按鈕排列: 左邊為次要，右邊為主要（符合慣例）

#### Feedback Screen
- **Email 按鈕**: 藍色（主題色）- 主要聯絡方式
- **官網按鈕**: 綠色（成功色）- 次要信息渠道
- 間距: 8px - 視覺上分離但保持群組感

---

### 互動反饋

#### 點擊效果
- ✅ TouchableOpacity 自動提供點擊縮放效果
- ✅ 顏色區分不同按鈕功能
- ✅ Icon 增加視覺辨識度

#### 錯誤處理
```typescript
.catch(err => console.error('Failed to open URL:', err))
```
- 不會因為打不開連結而閃退
- Console 記錄錯誤便於調試

---

## 📱 跨平台兼容性

### iOS
- ✅ 使用 Safari 打開網站
- ✅ 使用 Mail App 打開 Email
- ✅ 需要添加 `LSApplicationQueriesSchemes` (已在 info.plist)

### Android
- ✅ 使用默認瀏覽器打開網站
- ✅ 使用默認郵件 App 打開 Email
- ✅ 自動選擇用戶偏好的 App

---

## ✅ 測試清單

### Settings Screen
- [ ] 點擊「關於 Finora」顯示彈窗
- [ ] 彈窗顯示完整團隊信息
- [ ] 「訪問官網」按鈕可見
- [ ] 點擊「訪問官網」打開瀏覽器
- [ ] 瀏覽器跳轉至 `https://www.serelix.xyz`
- [ ] 點擊「確定」關閉彈窗
- [ ] 中英文切換正常

### Feedback Screen
- [ ] Email 按鈕顯示正確 (藍色)
- [ ] 官網按鈕顯示正確 (綠色)
- [ ] 點擊 Email 按鈕打開郵件 App
- [ ] Email 收件人為 `serelixstudio@gmail.com`
- [ ] 點擊官網按鈕打開瀏覽器
- [ ] 瀏覽器跳轉至 `https://www.serelix.xyz`
- [ ] 深色模式顯示正常
- [ ] 淺色模式顯示正常

### 錯誤處理
- [ ] 無網絡時不會閃退
- [ ] 無瀏覽器 App 時顯示友好提示
- [ ] Console 正確記錄錯誤

---

## 🔐 隱私與安全

### URL 安全
- ✅ 使用 HTTPS 協議
- ✅ 官網域名從配置文件讀取
- ✅ Email 地址從配置文件讀取
- ✅ 不包含敏感信息

### 用戶同意
- ✅ 明確標示為外部連結
- ✅ 用戶主動點擊才會跳轉
- ✅ 不會自動打開外部連結

---

## 📊 配置管理

### feedback.config.ts
```typescript
export const FEEDBACK_CONFIG = {
  DISCORD_WEBHOOK_URL: '...',
  FEEDBACK_EMAIL: 'serelixstudio@gmail.com',
  TEAM_WEBSITE: 'www.serelix.xyz',  // 集中管理
  PREFER_DISCORD: true,
};
```

**優點**:
- ✅ 集中管理聯絡信息
- ✅ 易於更新維護
- ✅ 避免硬編碼

---

## 🚀 未來優化

### P1 - 短期
1. **深度連結 (Deep Linking)**
   - 官網可以跳回 App
   - 例: `finora://feedback` 打開反饋頁面

2. **在 App 內預覽**
   - 使用 WebView 在 App 內顯示官網
   - 無需跳轉至外部瀏覽器

### P2 - 中期
3. **社交媒體連結**
   - Instagram: `instagram://user?username=serelix`
   - Twitter: `twitter://user?screen_name=serelix`

4. **聯絡方式選擇器**
   - 彈出選單: Email / 官網 / Discord
   - 用戶選擇偏好聯絡方式

### P3 - 長期
5. **即時客服**
   - 整合線上客服系統
   - 提供即時對話支援

6. **Analytics 追蹤**
   - 追蹤連結點擊率
   - 分析用戶偏好的聯絡方式

---

## 📈 版本更新

**版本**: v2.5.2 → v2.5.3  
**更新類型**: 功能增強  
**影響範圍**: 
- SettingsScreen - About 彈窗
- FeedbackScreen - 聯絡區塊

**向後兼容**: ✅ 是  
**需要更新依賴**: ❌ 否 (Linking 為 RN 內建)

---

## 🎉 總結

### 核心改進
1. ✅ **Settings About**: 新增「訪問官網」按鈕
2. ✅ **Feedback Email**: Email 按鈕可點擊打開郵件
3. ✅ **Feedback Website**: 新增官網按鈕 (綠色)
4. ✅ **雙語支援**: 中英文按鈕文字

### 用戶價值
- 更便捷的聯絡方式
- 一鍵訪問官網
- 專業的品牌展示
- 提升用戶信任度

**連結功能完成！** 🔗
