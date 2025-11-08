# Fix theme access in all TypeScript files
$files = @(
    "src/screens/AboutScreen.tsx",
    "src/screens/StatisticsScreen.tsx",
    "src/screens/PassbookManagementScreen.tsx",
    "src/screens/CheckScreen.tsx",
    "src/screens/SettingsScreen.tsx",
    "src/screens/FeedbackScreen.tsx",
    "src/screens/AddScreen.tsx",
    "src/screens/RatioSettingsScreen.tsx",
    "src/screens/TransactionDetailScreen.tsx",
    "src/screens/AllTransactionsScreen.tsx",
    "src/screens/ThemeSelectionScreen.tsx",
    "src/screens/CustomThemeScreen.tsx",
    "src/screens/ThemeProposalsScreen.tsx",
    "src/components/GlassCard.tsx",
    "src/components/GlassButton.tsx",
    "src/navigation/AppNavigator.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Replace const { config } = useApp(); with const { config, getTheme } = useApp();
        $content = $content -replace 'const \{ config \} = useApp\(\);', 'const { config, getTheme } = useApp();'
        
        # Replace const theme = THEME_COLORS[config.theme] || THEME_COLORS.mistBlue; with const theme = getTheme();
        $content = $content -replace 'const theme = THEME_COLORS\[config\.theme\] \|\| THEME_COLORS\.mistBlue;', 'const theme = getTheme();'
        
        Set-Content $file -Value $content -NoNewline
        Write-Host "Fixed: $file"
    }
}
