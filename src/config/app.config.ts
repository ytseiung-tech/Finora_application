// App Configuration
export interface AppConfig {
  language: 'en' | 'zh-TW';
  theme: 'light' | 'dark';
}

// Tab Icon Configuration
export interface TabIconConfig {
  emoji: string;
  char: string;
  url?: string;           // Optional URL for custom icon image (需要網路)
  localSource?: any;      // Optional local image source (完全離線)
}

// Language translations
export const translations = {
  en: {
    // Tab labels
    home: 'Home',
    check: 'Passbook',
    add: 'Add',
    statistics: 'Statistics',
    settings: 'Settings',
    
    // Home screen
    financialOverview: 'Financial Overview',
    totalBalance: 'Total Balance',
    myAccounts: 'My Accounts',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
    noTransactions: 'No transactions yet',
    noTransactionsSubtext: 'Tap "Add" to start tracking',
    income: 'Income',
    expense: 'Expense',
    
    // Add screen
    addTransaction: 'Add Transaction',
    amount: 'Amount',
    note: 'Note',
    noteExample: 'Note (e.g., Lunch, Freelance Fee)',
    selectPassbook: 'Select Passbook',
    selectCategory: 'Select Category',
    autoAllocate: 'Auto-allocate by ratio',
    pleaseSetRatio: 'Please set ratio in settings first',
    cancel: 'Cancel',
    complete: 'Complete',
    errorTitle: 'Error',
    pleaseEnterValidAmount: 'Please enter a valid amount',
    ratioNotSet: 'Ratio Not Set',
    pleaseSetRatioFirst: 'Please set the ratio for each passbook in "Ratio Settings" first',
    goToSettings: 'Go to Settings',
    ratioError: 'Ratio Error',
    ratioMustBe100: 'The sum of all passbook ratios must be 100%\nCurrent sum: ',
    transactionAdded: 'Transaction added successfully',
    addFailed: 'Failed to add transaction',
    food: 'Food',
    transport: 'Transportation',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    utilities: 'Utilities',
    other: 'Other',
    
    // Check screen
    passbook: 'Passbook',
    balance: 'Balance',
    incomeLabel: 'Income',
    expensesLabel: 'Expenses',
    balanceLabel: 'Balance',
    
    // Statistics screen
    monthlyStatistics: 'Monthly Statistics',
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    netSavings: 'Net Savings',
    
    // Settings screen
    passbookManagement: 'Passbook Management',
    ratioSettings: 'Ratio Settings',
    feedback: 'Feedback',
    language: 'Language',
    theme: 'Theme',
    clearData: 'Clear Data',
    about: 'About',
    
    // Common
    delete: 'Delete',
    confirm: 'Confirm',
    success: 'Success',
    error: 'Error',
    save: 'Save',
    
    // Additional
    incomeAllocatedTo: 'Income allocated to',
    allTransactions: 'All Transactions',
    deleteTransaction: 'Delete Transaction',
    confirmDelete: 'Are you sure you want to delete',
    transactionDeleted: 'Transaction deleted',
    deleteFailed: 'Delete failed',
    
    // Statistics Screen
    monthlyIncomeVsExpenses: 'Monthly Income vs. Expenses',
    netBalance: 'Net Balance',
    loading: 'Loading...',
    totalsByAccount: 'Totals by Account',
    accounts: 'accounts',
    allAccounts: 'All Accounts',
    
    // CheckScreen
    monthlySummary: 'Monthly Summary',
    noDataForMonth: 'No data for this month',
    displaysMonthlyInfo: 'Displays monthly income, expenses, and balance for each passbook',
    
    // Settings Screen
    managePassbooks: 'Manage Passbooks',
    adjustRatio: 'Adjust Ratio',
    selectLanguage: 'Select Language',
    selectTheme: 'Select Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    clearDataTitle: 'Clear Data',
    clearDataMessage: 'Are you sure you want to clear all transaction data? This action cannot be undone!',
    allDataCleared: 'All data has been cleared',
    aboutFinora: 'About Finora',
    aboutMessage: 'Finora App v1.0.0\n\nAn app to help you manage your finances\n\nDeveloped by Serelix Studio Team\nWebsite: www.serelix.xyz\n\n© 2025 Serelix Studio',
    ok: 'OK',
    
    // Ratio Settings Screen
    ratioSettingsTitle: 'Ratio Settings',
    autoDistribution: 'Auto Distribution',
    setRatio: 'Set the distribution ratio for each passbook',
    totalRatio: 'Total Ratio',
    adjustRatioTooltip: 'Adjust the sliders so the total equals 100%',
    ratioSaved: 'Ratio settings saved',
    ratioSaveFailed: 'Failed to save ratio settings',
  },
  'zh-TW': {
    // Tab labels
    home: '首頁',
    check: '存摺',
    add: '新增',
    statistics: '統計',
    settings: '設定',
    
    // Home screen
    financialOverview: '財務總覽',
    totalBalance: '總餘額',
    myAccounts: '我的帳戶',
    recentTransactions: '最近記帳',
    viewAll: '查看全部',
    noTransactions: '尚無記帳記錄',
    noTransactionsSubtext: '點擊下方「新增」按鈕開始記帳',
    income: '收入',
    expense: '支出',
    
    // Add screen
    addTransaction: '新增記帳',
    amount: '金額',
    note: '備註',
    noteExample: '備註（例如：午餐、接案收入）',
    selectPassbook: '選擇存摺',
    selectCategory: '選擇類別',
    autoAllocate: '按比例自動分配',
    pleaseSetRatio: '請先在設定中設定比例',
    cancel: '取消',
    complete: '完成',
    errorTitle: '錯誤',
    pleaseEnterValidAmount: '請輸入有效金額',
    ratioNotSet: '未設定比例',
    pleaseSetRatioFirst: '請先在「比例設定」頁面設定各存摺的比例',
    goToSettings: '前往設定',
    ratioError: '比例錯誤',
    ratioMustBe100: '所有存摺的比例總和必須為 100%\n目前總和為 ',
    transactionAdded: '記帳新增成功',
    addFailed: '新增失敗',
    food: '飲食',
    transport: '交通',
    entertainment: '娛樂',
    shopping: '購物',
    utilities: '帳單',
    other: '其他',
    
    // Check screen
    passbook: '存摺',
    balance: '餘額',
    incomeLabel: '收入',
    expensesLabel: '支出',
    balanceLabel: '餘額',
    
    // Statistics screen
    monthlyStatistics: '月度統計',
    totalIncome: '總收入',
    totalExpense: '總支出',
    netSavings: '淨儲蓄',
    
    // Settings screen
    passbookManagement: '存摺管理',
    ratioSettings: '比例設定',
    feedback: '意見反饋',
    language: '語言',
    theme: '主題',
    clearData: '清除資料',
    about: '關於',
    
    // Common
    delete: '刪除',
    confirm: '確認',
    success: '成功',
    error: '錯誤',
    save: '儲存',
    
    // Additional
    incomeAllocatedTo: '收入分配至',
    allTransactions: '所有記帳',
    deleteTransaction: '刪除記帳',
    confirmDelete: '確定要刪除',
    transactionDeleted: '記帳已刪除',
    deleteFailed: '刪除失敗',
    
    // Statistics Screen
    monthlyIncomeVsExpenses: '月度收入與支出',
    netBalance: '淨餘額',
    loading: '載入中...',
    totalsByAccount: '各帳戶總計',
    accounts: '個帳戶',
    allAccounts: '所有帳戶',
    
    // CheckScreen
    monthlySummary: '月度摘要',
    noDataForMonth: '本月無資料',
    displaysMonthlyInfo: '顯示各存摺的月度收入、支出與餘額',
    
    // Settings Screen
    managePassbooks: '管理存摺',
    adjustRatio: '調整比例',
    selectLanguage: '選擇語言',
    selectTheme: '選擇主題',
    lightMode: '淺色模式',
    darkMode: '深色模式',
    clearDataTitle: '清除資料',
    clearDataMessage: '確定要清除所有記帳資料嗎？此操作無法撤銷！',
    allDataCleared: '所有資料已清除',
    aboutFinora: '關於 Finora',
    aboutMessage: 'Finora App v1.0.0\n\n幫助您管理財務的應用程式\n\nSerelix Studio Team 開發\n官網: www.serelix.xyz\n\n© 2025 Serelix Studio',
    ok: '確定',
    
    // Ratio Settings Screen
    ratioSettingsTitle: '比例設定',
    autoDistribution: '自動分配',
    setRatio: '設定各存摺的分配比例',
    totalRatio: '總比例',
    adjustRatioTooltip: '調整滑桿使總和等於 100%',
    ratioSaved: '比例設定已儲存',
    ratioSaveFailed: '儲存比例設定失敗',
  },
};

// Tab icons with different styles
export const tabIcons: Record<string, TabIconConfig> = {
  home: {
    emoji: '🏠',
    char: '⌂',
    localSource: require('../../assets/icons/home.png'), // ✅ 本地圖示（完全離線）
  },
  check: {
    emoji: '📖',
    char: '☰',
    localSource: require('../../assets/icons/passbook.png'), // ✅ 本地圖示
  },
  add: {
    emoji: '➕',
    char: '+',
    localSource: require('../../assets/icons/more.png'), // ✅ 本地圖示
  },
  statistics: {
    emoji: '📊',
    char: '≡',
    localSource: require('../../assets/icons/bar-chart.png'), // ✅ 本地圖示
  },
  settings: {
    emoji: '⚙️',
    char: '⚙',
    localSource: require('../../assets/icons/settings.png'), // ✅ 本地圖示
  },
};
