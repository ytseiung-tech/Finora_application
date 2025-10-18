// Feedback Configuration
// 請在此處設定您的 Discord Webhook URL 和反饋接收 Email

export const FEEDBACK_CONFIG = {
  // Discord Webhook URL
  // 設定方法：
  // 1. 前往您的 Discord 伺服器
  // 2. 選擇一個頻道 → 編輯頻道 → 整合 → Webhooks
  // 3. 創建 Webhook 並複製 URL
  // 4. 將 URL 貼到下方
  DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/1428695906668253195/43w9w6dwZr1W8fB-mpji9cyXpYutDhC-CMwJOPrapwOb30-VEtMw210RwA-yHNXk-E3z',
  
  // 反饋接收 Email
  FEEDBACK_EMAIL: 'serelixstudio@gmail.com',
  
  // 團隊官網
  TEAM_WEBSITE: 'www.serelix.xyz',
  
  // 是否優先使用 Discord（如果設為 false，會優先使用 Email）
  PREFER_DISCORD: true,
};

// Discord Embed 顏色配置
export const DISCORD_COLORS = {
  FEEDBACK: 0x19a2e6,    // 藍色 - 一般反饋
  BUG_REPORT: 0xff3b30,  // 紅色 - 錯誤回報
  SUGGESTION: 0x4cd964,  // 綠色 - 功能建議
};

// 反饋類型
export enum FeedbackType {
  GENERAL = 'general',
  BUG_REPORT = 'bug',
  SUGGESTION = 'suggestion',
  OTHER = 'other',
}

// 反饋類型標籤（繁體中文）
export const FEEDBACK_TYPE_LABELS = {
  [FeedbackType.GENERAL]: '一般反饋',
  [FeedbackType.BUG_REPORT]: '問題回報',
  [FeedbackType.SUGGESTION]: '功能建議',
  [FeedbackType.OTHER]: '其他',
};
