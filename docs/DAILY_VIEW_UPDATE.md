# 單日分析功能更新 - 折線圖改為單日視圖

## 📅 更新日期
**2025-10-18**

---

## ✨ 功能描述

將統計頁面的「每日趨勢折線圖」改為「單日分析」視圖，提供更聚焦的單日收支數據查看體驗。

### 核心改進

#### 更新前：折線圖模式
- 顯示最近 30 天的折線圖
- 需要水平滾動查看完整數據
- 數據密集，不易聚焦單日

#### 更新後：單日視圖模式
- ✅ **預設顯示今天**的收支數據
- ✅ **左右箭頭切換**日期（可查看最近 30 天）
- ✅ **大字體顯示**當日收入、支出、淨額
- ✅ **智能日期標籤**（今天、昨天、N 天前）
- ✅ **即時淨額計算**（綠色/紅色顯示盈虧）

---

## 🎯 UI 設計

### 日期導航器
```
┌─────────────────────────────────┐
│   ←    10/18    今天    →      │
└─────────────────────────────────┘
```

**功能**:
- 左箭頭：查看前一天
- 右箭頭：查看後一天
- 中間：顯示當前選中日期和提示文字

**日期提示邏輯**:
| 日期 | 顯示文字 |
|------|----------|
| 最後一天 | 今天 |
| 倒數第二天 | 昨天 |
| 其他 | N 天前 |

### 數據卡片

```
┌─────────────────────────────────┐
│ ● 收入                         │
│ NT$ 5,000                      │
│                                │
│ ─────────────────────────────  │
│                                │
│ ● 支出                         │
│ NT$ 2,500                      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 當日淨額                        │
│ +NT$ 2,500                     │
└─────────────────────────────────┘
```

**色彩規則**:
- 收入：綠色 (`theme.success`)
- 支出：紅色 (`theme.error`)
- 淨額：正數綠色，負數紅色

---

## 💻 技術實作

### 1. 新增狀態管理

```typescript
const [selectedDateIndex, setSelectedDateIndex] = useState(29); // 預設最後一天（今天）
```

**說明**:
- `selectedDateIndex`: 0-29，對應最近 30 天
- `29`: 今天（最新）
- `0`: 30 天前（最舊）

### 2. 日期導航邏輯

```typescript
// 前一天
<TouchableOpacity
  onPress={() => setSelectedDateIndex(Math.max(0, selectedDateIndex - 1))}
  disabled={selectedDateIndex === 0}
>

// 後一天
<TouchableOpacity
  onPress={() => setSelectedDateIndex(Math.min(29, selectedDateIndex + 1))}
  disabled={selectedDateIndex === 29}
>
```

**邊界處理**:
- 到達最舊日期（index=0）時，左箭頭變灰並禁用
- 到達最新日期（index=29）時，右箭頭變灰並禁用

### 3. 智能日期標籤

```typescript
{selectedDateIndex === 29 
  ? (config.language === 'zh-TW' ? '今天' : 'Today')
  : selectedDateIndex === 28
  ? (config.language === 'zh-TW' ? '昨天' : 'Yesterday')
  : `${29 - selectedDateIndex} ${config.language === 'zh-TW' ? '天前' : 'days ago'}`
}
```

### 4. 數據顯示

```typescript
// 收入
dailyIncomeData[selectedDateIndex]?.amount.toLocaleString()

// 支出
dailyExpenseData[selectedDateIndex]?.amount.toLocaleString()

// 淨額
(dailyIncomeData[selectedDateIndex]?.amount || 0) - (dailyExpenseData[selectedDateIndex]?.amount || 0)
```

---

## 🎨 新增樣式

### 日期導航
```typescript
dateNavigation: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 16,
  marginBottom: 20,
},
navButton: {
  width: 44,
  height: 44,
  borderRadius: 22,
  alignItems: 'center',
  justifyContent: 'center',
},
navButtonText: {
  fontSize: 24,
  fontWeight: '600',
},
dateInfo: {
  flex: 1,
  alignItems: 'center',
  paddingHorizontal: 16,
},
selectedDate: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 4,
},
dateHint: {
  fontSize: 13,
},
```

### 數據卡片
```typescript
dailySummary: {
  flexDirection: 'row',
  gap: 16,
  marginBottom: 16,
},
summaryItem: {
  flex: 1,
},
summaryDivider: {
  width: 1,
  backgroundColor: '#e0e0e0',
},
summaryAmount: {
  fontSize: 20,
  fontWeight: '700',
  marginTop: 8,
},
netBalanceCard: {
  padding: 16,
  borderRadius: 12,
  borderWidth: 1,
  alignItems: 'center',
},
netBalanceLabel: {
  fontSize: 14,
  marginBottom: 8,
},
netBalanceAmount: {
  fontSize: 28,
  fontWeight: '700',
},
```

---

## 📊 優勢對比

### 折線圖模式（舊）
| 優點 | 缺點 |
|------|------|
| 趨勢一目了然 | 數據點密集 |
| 可看到 30 天整體 | 需要滾動查看 |
| | 單日數據不清晰 |
| | 佔用垂直空間大 |

### 單日視圖模式（新）
| 優點 | 缺點 |
|------|------|
| ✅ 聚焦單日，數據清晰 | 看不到趨勢曲線 |
| ✅ 大字體，易讀 | 需要點擊切換日期 |
| ✅ 預設顯示今天 | |
| ✅ 即時淨額計算 | |
| ✅ 佔用空間小 | |
| ✅ 操作簡單直觀 | |

---

## 🔧 代碼變更

### 修改文件
- `src/screens/StatisticsScreen.tsx`

### 變更統計
- **新增代碼**: ~80 行
- **刪除代碼**: ~60 行（LineChart 相關）
- **修改代碼**: ~10 行
- **淨增加**: ~20 行

### 移除依賴
```typescript
// 移除 LineChart import
- import { LineChart } from 'react-native-chart-kit';
```

**說明**: 不再需要圖表庫，改用原生組件

---

## 🎯 使用場景

### 典型用戶流程

1. **查看今天收支**
   - 打開統計頁面
   - 自動顯示今天的收入、支出、淨額

2. **對比昨天數據**
   - 點擊左箭頭
   - 查看「昨天」的數據

3. **查看一週前**
   - 持續點擊左箭頭
   - 或直接看日期提示「7 天前」

4. **返回今天**
   - 點擊右箭頭直到「今天」
   - 或重新進入頁面

---

## 📱 響應式設計

### 深色模式適配
- ✅ 自動使用 `theme.card` 背景
- ✅ 文字顏色跟隨主題
- ✅ 按鈕背景使用 `theme.backgroundSecondary`

### 雙語支援
| 元素 | 中文 | 英文 |
|------|------|------|
| 標題 | 單日分析 | Daily Analysis |
| 今天 | 今天 | Today |
| 昨天 | 昨天 | Yesterday |
| N天前 | N 天前 | N days ago |
| 收入 | 收入 | Income |
| 支出 | 支出 | Expense |
| 當日淨額 | 當日淨額 | Daily Net |

---

## ✅ 測試清單

### 功能測試
- [ ] 預設顯示今天的數據
- [ ] 左箭頭可查看前一天
- [ ] 右箭頭可查看後一天
- [ ] 到達邊界時箭頭變灰
- [ ] 日期標籤正確顯示（今天、昨天、N天前）
- [ ] 收入金額正確顯示
- [ ] 支出金額正確顯示
- [ ] 淨額正確計算（收入 - 支出）
- [ ] 淨額顏色正確（正數綠色、負數紅色）

### UI 測試
- [ ] 深色模式顯示正常
- [ ] 淺色模式顯示正常
- [ ] 中文顯示正確
- [ ] 英文顯示正確
- [ ] 按鈕可點擊區域足夠大
- [ ] 數據對齊正確
- [ ] 分隔線顯示清晰

### 數據測試
- [ ] 無數據時顯示 NT$ 0
- [ ] 大金額正常顯示（格式化）
- [ ] 負數淨額正常顯示
- [ ] 切換帳本後數據更新

---

## 🚀 後續優化建議

### P1 - 短期
1. **手勢滑動支援**
   - 左滑：下一天
   - 右滑：上一天
   - 提升操作流暢度

2. **快速跳轉**
   - 點擊日期彈出日期選擇器
   - 快速跳到任意日期

### P2 - 中期
3. **趨勢指示器**
   - 顯示相比昨天的變化百分比
   - 例：↑ 15% 或 ↓ 8%

4. **詳細交易列表**
   - 點擊卡片展開當日交易明細
   - 快速查看該日所有記帳

### P3 - 長期
5. **週/月視圖切換**
   - 添加標籤：日/週/月
   - 提供不同時間粒度的視圖

6. **數據導出**
   - 導出當日數據為 CSV
   - 分享當日統計圖片

---

## 📝 版本更新

**版本**: v2.5.0 → v2.5.1  
**更新類型**: 功能改進  
**影響範圍**: StatisticsScreen 單日分析區塊  
**向後兼容**: ✅ 是

---

## 🎉 總結

### 改進亮點
1. ✅ **用戶體驗提升** - 預設顯示今天，符合查看習慣
2. ✅ **操作簡化** - 左右箭頭直觀易用
3. ✅ **視覺清晰** - 大字體，聚焦單日數據
4. ✅ **即時反饋** - 淨額一目了然
5. ✅ **性能優化** - 移除圖表庫，減少依賴

### 適用場景
- ✅ 每日記帳後查看當日總結
- ✅ 對比不同日期的收支情況
- ✅ 快速了解財務狀況
- ✅ 檢查異常支出日期

**功能已完成，建議立即測試！** 🚀
