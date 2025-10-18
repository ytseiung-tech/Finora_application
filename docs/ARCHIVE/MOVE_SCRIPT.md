# 文檔整理腳本

## 說明
本腳本用於將歷史文檔移動到 ARCHIVE 目錄

## 要移動到 ARCHIVE 的文件

以下文件的內容已整合到主要文檔，應移動到 `docs/ARCHIVE/`:

### 已整合到 CHANGELOG.md
- UPDATE_SUMMARY_v2.5.0.md
- UPDATE_SUMMARY_v2.4.0.md
- SESSION_9_COMPLETION_SUMMARY.md
- FINAL_SUMMARY.md
- FEATURE_UPDATE_2025-01-17.md
- ICON_FIX_AND_LINE_CHART_FEATURE.md
- CHANGELOG_OLD.md

### 已整合到 FEATURES.md
- FEATURES_COMPLETE.md
- BEIGE_THEME_AND_BACKGROUND_FEATURE.md

### 已整合到 IMPLEMENTATION.md
- IMPLEMENTATION_SUMMARY.md

### UI 修復文檔（已整合）
- UI_FIXES_SUMMARY.md
- UI_FIXES_BATCH_2.md
- SWIPE_DELETE_LANGUAGE_FIX.md
- LIGHT_MODE_BALANCE_LANGUAGE_FIX.md
- UI_IMPROVEMENTS_FEEDBACK.md

### 功能設定文檔（已整合）
- FEEDBACK_SETUP.md
- ICONS_SETUP.md
- LOCAL_ICONS_SETUP.md
- ICON_CUSTOMIZATION_GUIDE.md
- OFFLINE_UPDATE_SUMMARY.md

## PowerShell 命令

```powershell
# 切換到 docs 目錄
cd c:\Users\User\Desktop\github-code\Finora_app\docs

# 確保 ARCHIVE 目錄存在
if (-not (Test-Path ARCHIVE)) { New-Item -ItemType Directory -Path ARCHIVE }

# 移動文件到 ARCHIVE
$filesToMove = @(
    "UPDATE_SUMMARY_v2.4.0.md",
    "SESSION_9_COMPLETION_SUMMARY.md",
    "FINAL_SUMMARY.md",
    "FEATURE_UPDATE_2025-01-17.md",
    "ICON_FIX_AND_LINE_CHART_FEATURE.md",
    "CHANGELOG_OLD.md",
    "FEATURES_COMPLETE.md",
    "BEIGE_THEME_AND_BACKGROUND_FEATURE.md",
    "IMPLEMENTATION_SUMMARY.md",
    "UI_FIXES_SUMMARY.md",
    "UI_FIXES_BATCH_2.md",
    "SWIPE_DELETE_LANGUAGE_FIX.md",
    "LIGHT_MODE_BALANCE_LANGUAGE_FIX.md",
    "UI_IMPROVEMENTS_FEEDBACK.md",
    "FEEDBACK_SETUP.md",
    "ICONS_SETUP.md",
    "LOCAL_ICONS_SETUP.md",
    "ICON_CUSTOMIZATION_GUIDE.md",
    "OFFLINE_UPDATE_SUMMARY.md"
)

foreach ($file in $filesToMove) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "ARCHIVE\$file" -Force
        Write-Host "已移動: $file" -ForegroundColor Green
    } else {
        Write-Host "文件不存在: $file" -ForegroundColor Yellow
    }
}

Write-Host "`n完成！所有歷史文檔已移動到 ARCHIVE 目錄" -ForegroundColor Cyan
```

## 保留的文檔

以下文檔保留在 `docs/` 主目錄:

### 主要文檔
- README.md (新版文檔索引)
- FEATURES.md (完整功能文檔)
- IMPLEMENTATION.md (技術實作文檔)

### 最新功能文檔
- WEBSITE_LINKS_FEATURE.md (v2.5.3)
- BRANDING_UPDATE.md (v2.5.2)
- DAILY_VIEW_UPDATE.md (v2.5.1)

### 核心文檔
- OFFLINE_GUIDE.md (離線功能指南)

## 根目錄文檔

以下根目錄文檔需要更新:

### 需要替換
- CHANGELOG.md → 用 CHANGELOG_NEW.md 替換

### 可以刪除（內容已整合）
- UPDATE_SUMMARY.md
- CURRENT_VERSION_SUMMARY.md
- PROJECT_COMPLETE.md
- VERSION_ORGANIZATION_COMPLETE.md

## 執行步驟

1. **備份**: 先備份整個 docs 目錄
2. **執行腳本**: 運行上面的 PowerShell 命令
3. **驗證**: 檢查 ARCHIVE 目錄是否包含所有文件
4. **更新主文檔**: 替換 CHANGELOG.md
5. **測試**: 確保所有鏈接仍然有效

## 文檔結構（整理後）

```
Finora_app/
├── README.md
├── CHANGELOG.md (新版)
├── DEVELOPMENT_GUIDE.md
├── quick-start.md
└── docs/
    ├── README.md (文檔索引)
    ├── FEATURES.md (功能文檔)
    ├── IMPLEMENTATION.md (技術文檔)
    ├── WEBSITE_LINKS_FEATURE.md
    ├── BRANDING_UPDATE.md
    ├── DAILY_VIEW_UPDATE.md
    ├── OFFLINE_GUIDE.md
    └── ARCHIVE/
        ├── README.md (歸檔說明)
        ├── UPDATE_SUMMARY_v2.5.0.md
        ├── UPDATE_SUMMARY_v2.4.0.md
        └── ...（其他歷史文檔）
```

## 注意事項

- ⚠️ 移動前請備份
- ⚠️ 檢查是否有其他文檔鏈接到這些文件
- ⚠️ 更新 README.md 中的文檔路徑
- ⚠️ 確保 ARCHIVE/README.md 存在

---

**創建時間**: 2025-10-18  
**用途**: 文檔整理自動化
