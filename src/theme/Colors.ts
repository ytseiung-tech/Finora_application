// Morandi Color Palette - Matching iOS/Android implementations
export const COLORS = {
  // Primary Morandi Colors
  primaryBlue: '#7B68EE',
  sageGreen: '#87A96B',
  dustyPurple: '#9A8194',
  warmYellow: '#E6D690',
  blushPink: '#D4A5A5',
  softGray: '#B8B8B8',
  deepBlue: '#5A4FCF',
  mutedGreen: '#6B7B5A',

  // System Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Glass Effects
  glassWhite: 'rgba(255, 255, 255, 0.25)',
  glassWhiteLight: 'rgba(255, 255, 255, 0.1)',
  glassWhiteHeavy: 'rgba(255, 255, 255, 0.4)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassBorderLight: 'rgba(255, 255, 255, 0.1)',

  // Text Colors
  textPrimary: '#2C2C2C',
  textSecondary: '#6B6B6B',
  textTertiary: '#9A9A9A',
  textInverse: '#FFFFFF',

  // Background Colors
  backgroundPrimary: '#F8F9FA',
  backgroundSecondary: '#F1F3F4',
  backgroundGlass: 'rgba(248, 249, 250, 0.8)',

  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Shadow Colors
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowHeavy: 'rgba(0, 0, 0, 0.25)',
} as const;

// Theme configurations
export const THEME_COLORS = {
  dark: {
    background: '#111518',
    backgroundSecondary: '#1a2a32',
    backgroundTertiary: '#293338',
    text: '#ffffff',
    textSecondary: '#9dafb8',
    textTertiary: '#6b7b84',
    border: '#293338',
    borderLight: '#3d4b52',
    card: '#1a2a32',
    cardSecondary: '#293338',
    success: '#10b981',
    error: '#ff4757',
    warning: '#ff9500',
    info: '#19a2e6',
    primary: '#19a2e6',
  },
  light: {
    background: '#fffbec',  // 淺色溫暖米白
    backgroundSecondary: '#ffffff',  // 純白
    backgroundTertiary: '#fff8e1',  // 淺黃米白
    text: '#1a1a1a',  // 深灰黑色文字
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#e0e0e0',
    borderLight: '#f0f0f0',
    card: '#ffffff',  // 純白卡片
    cardSecondary: '#fffef7',  // 極淺米白
    success: '#10b981',
    error: '#ff4757',
    warning: '#ff9500',
    info: '#19a2e6',
    primary: '#19a2e6',
  },
};

// Passbook Color Options (matching iOS/Android)
export const PASSBOOK_COLORS = [
  COLORS.primaryBlue,
  COLORS.sageGreen,
  COLORS.dustyPurple,
  COLORS.warmYellow,
  COLORS.blushPink,
  COLORS.deepBlue,
  COLORS.mutedGreen,
  COLORS.softGray,
] as const;

// Category Colors for Transactions
export const CATEGORY_COLORS = {
  // Income
  salary: COLORS.success,
  freelance: COLORS.primaryBlue,
  investment: COLORS.warmYellow,
  gift: COLORS.blushPink,
  other_income: COLORS.softGray,

  // Needs (50%)
  rent: COLORS.error,
  utilities: COLORS.warning,
  groceries: COLORS.sageGreen,
  insurance: COLORS.info,
  healthcare: COLORS.blushPink,
  transportation: COLORS.dustyPurple,

  // Wants (30%)
  dining: COLORS.warmYellow,
  entertainment: COLORS.primaryBlue,
  shopping: COLORS.blushPink,
  travel: COLORS.sageGreen,
  hobbies: COLORS.dustyPurple,
  subscriptions: COLORS.softGray,

  // Savings (20%)
  emergency_fund: COLORS.success,
  investments: COLORS.warmYellow,
  retirement: COLORS.deepBlue,
  savings_goal: COLORS.primaryBlue,
} as const;

export type ColorKey = keyof typeof COLORS;
export type PassbookColor = typeof PASSBOOK_COLORS[number];
export type CategoryColorKey = keyof typeof CATEGORY_COLORS;
