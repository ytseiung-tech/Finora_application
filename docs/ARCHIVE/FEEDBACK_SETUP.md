# 反饋系統設定指南

## 📝 功能說明

Finora App 的反饋系統支援兩種提交方式：
1. **Discord Webhook** - 自動將反饋發送到您的 Discord 頻道
2. **Email** - 通過郵件應用程式發送反饋

## 🔧 設定步驟

### 1. 設定 Discord Webhook（推薦）

#### 步驟 1: 創建 Discord Webhook

1. 前往您的 Discord 伺服器
2. 選擇要接收反饋的頻道
3. 點擊頻道設定（齒輪圖標）
4. 前往「整合」→「Webhooks」
5. 點擊「創建 Webhook」
6. 設定 Webhook 名稱（例如：Finora Feedback）
7. 複製 Webhook URL

#### 步驟 2: 配置應用程式

編輯文件：`src/config/feedback.config.ts`

```typescript
export const FEEDBACK_CONFIG = {
  // 將您的 Discord Webhook URL 貼在這裡
  DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN',
  
  // 您的接收 Email
  FEEDBACK_EMAIL: 'your-email@example.com',
  
  // 優先使用 Discord
  PREFER_DISCORD: true,
};
```

### 2. 設定 Email

如果不使用 Discord Webhook，或作為備用方案：

編輯文件：`src/config/feedback.config.ts`

```typescript
export const FEEDBACK_CONFIG = {
  DISCORD_WEBHOOK_URL: 'YOUR_DISCORD_WEBHOOK_URL_HERE',
  
  // 將您的 Email 地址貼在這裡
  FEEDBACK_EMAIL: 'support@yourcompany.com',
  
  // 如果不使用 Discord，設為 false
  PREFER_DISCORD: false,
};
```

## 📮 Discord Webhook 訊息格式

當用戶提交反饋時，Discord 會收到以下格式的訊息：

```
📝 新的反饋
━━━━━━━━━━━━━━━━━━

👤 姓名
[用戶名稱或"未提供"]

📧 Email  
[用戶 Email 或"未提供"]

📌 主題
[反饋主題]

💬 訊息
[反饋詳細內容]

━━━━━━━━━━━━━━━━━━
Finora App Feedback
[時間戳記]
```

## 🎨 自訂顏色

您可以在 `feedback.config.ts` 中自訂 Discord Embed 的顏色：

```typescript
export const DISCORD_COLORS = {
  FEEDBACK: 0x19a2e6,    // 藍色 - 一般反饋
  BUG_REPORT: 0xff3b30,  // 紅色 - 錯誤回報
  SUGGESTION: 0x4cd964,  // 綠色 - 功能建議
};
```

## 🔐 安全性建議

1. **不要將 Webhook URL 提交到公開的 Git 儲存庫**
2. 建議使用環境變數來儲存敏感資訊
3. 定期更新 Webhook URL
4. 限制 Discord 頻道的訪問權限

## 🧪 測試

設定完成後，請測試反饋功能：

1. 啟動應用程式
2. 前往「設定」→「意見回饋」
3. 填寫測試反饋並提交
4. 檢查 Discord 頻道是否收到訊息

## ❓ 常見問題

### Q: Webhook URL 在哪裡找？
A: Discord → 頻道設定 → 整合 → Webhooks → 複製 Webhook URL

### Q: 為什麼 Discord 沒收到訊息？
A: 檢查：
- Webhook URL 是否正確
- 網路連接是否正常
- Discord 伺服器是否運作中

### Q: 可以同時使用 Discord 和 Email 嗎？
A: 可以！系統會優先嘗試 Discord，如果失敗則會提供 Email 選項

### Q: 如何變更反饋接收頻道？
A: 創建新的 Webhook 並更新配置文件中的 URL

## 📞 支援

如有任何問題，請聯繫開發團隊：
- Email: support@finora.app
- Discord: [您的 Discord 伺服器連結]
