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
  // 1. Mist Blue (�W�L�N��)
  mistBlue: {
    background: '#F3F5FB',
    card: '#FFFFFF',
    cardAlt: '#F7F9FF',
    glass: 'rgba(90, 131, 222, 0.10)',
    text: '#21232A',
    textSecondary: '#8087A2',
    primary: '#5A83DE',
    primarySoft: 'rgba(90,131,222,0.14)',
    accent: '#3EC6FF',
    border: 'rgba(17,24,39,0.06)',
    bottomBar: '#F3F5FB',
    success: '#16A34A',
    error: '#EF4444',
  },

  // 2. Lavender Smoke (�X��)
  lavenderSmoke: {
    background: '#F6F1FB',
    card: '#FFFFFF',
    cardAlt: '#F9F4FF',
    glass: 'rgba(149,114,207,0.10)',
    text: '#24212F',
    textSecondary: '#8B82A6',
    primary: '#9B6BFF',
    primarySoft: 'rgba(155,107,255,0.16)',
    accent: '#FF9BD5',
    border: 'rgba(42,25,72,0.06)',
    bottomBar: '#F6F1FB',
    success: '#22C55E',
    error: '#F97373',
  },

  // 3. Rose Dust (�x��)
  roseDust: {
    background: '#FFF5F7',
    card: '#FFFFFF',
    cardAlt: '#FFF8FA',
    glass: 'rgba(236,72,153,0.06)',
    text: '#291720',
    textSecondary: '#A67886',
    primary: '#EC5F9A',
    primarySoft: 'rgba(236,95,154,0.14)',
    accent: '#FFBCA8',
    border: 'rgba(148,81,110,0.08)',
    bottomBar: '#FFF5F7',
    success: '#16A34A',
    error: '#DC2626',
  },

  // 4. Olive Gray (�ξA�Ǻ�)
  oliveGray: {
    background: '#F4F5F2',
    card: '#FFFFFF',
    cardAlt: '#F7F8F5',
    glass: 'rgba(88,115,82,0.07)',
    text: '#222222',
    textSecondary: '#7A8275',
    primary: '#6C8A5A',
    primarySoft: 'rgba(108,138,90,0.14)',
    accent: '#C3D69B',
    border: 'rgba(0,0,0,0.06)',
    bottomBar: '#F4F5F2',
    success: '#15803D',
    error: '#B91C1C',
  },

  // 5. Sand Beige (�x�L�F��)
  sandBeige: {
    background: '#FFF7EE',
    card: '#FFFFFF',
    cardAlt: '#FFF9F1',
    glass: 'rgba(245,158,11,0.06)',
    text: '#2A2118',
    textSecondary: '#A38B73',
    primary: '#F59E0B',
    primarySoft: 'rgba(245,158,11,0.16)',
    accent: '#F97316',
    border: 'rgba(120,72,0,0.06)',
    bottomBar: '#FFF7EE',
    success: '#16A34A',
    error: '#DC2626',
  },

  // 6. Seafoam Green (���b��)
  seafoamGreen: {
    background: '#E9FAF4',
    card: '#FFFFFF',
    cardAlt: '#F3FFFA',
    glass: 'rgba(16,185,129,0.08)',
    text: '#12332A',
    textSecondary: '#649A85',
    primary: '#10B981',
    primarySoft: 'rgba(16,185,129,0.14)',
    accent: '#22C55E',
    border: 'rgba(15,118,110,0.08)',
    bottomBar: '#E9FAF4',
    success: '#16A34A',
    error: '#DC2626',
  },

  // 7. Cloud Gray (���ʦǥ�)
  cloudGray: {
    background: '#F2F3F5',
    card: '#FFFFFF',
    cardAlt: '#F7F7F8',
    glass: 'rgba(148,163,253,0.05)',
    text: '#111827',
    textSecondary: '#6B7280',
    primary: '#4B5563',
    primarySoft: 'rgba(75,85,99,0.10)',
    accent: '#38BDF8',
    border: 'rgba(148,163,253,0.14)',
    bottomBar: '#F2F3F5',
    success: '#16A34A',
    error: '#DC2626',
  },

  // 8. Plum Night (���`��)
  plumNight: {
    background: '#F1ECF8',
    card: '#FFFFFF',
    cardAlt: '#F7F3FF',
    glass: 'rgba(109,40,217,0.08)',
    text: '#1F172A',
    textSecondary: '#7C6CA8',
    primary: '#8B5CF6',
    primarySoft: 'rgba(139,92,246,0.16)',
    accent: '#EC4899',
    border: 'rgba(79,70,229,0.10)',
    bottomBar: '#F1ECF8',
    success: '#22C55E',
    error: '#F97373',
  },

  // 9. Mint Frost (�H��N��)
  mintFrost: {
    background: '#ECFFF8',
    card: '#FFFFFF',
    cardAlt: '#F5FFFB',
    glass: 'rgba(22,163,74,0.06)',
    text: '#10231B',
    textSecondary: '#5F8F7A',
    primary: '#22C55E',
    primarySoft: 'rgba(34,197,94,0.16)',
    accent: '#38BDF8',
    border: 'rgba(15,118,110,0.06)',
    bottomBar: '#ECFFF8',
    success: '#16A34A',
    error: '#DC2626',
  },

  // 10. Coral Clay (�ŷx����)
  coralClay: {
    background: '#FFF4EF',
    card: '#FFFFFF',
    cardAlt: '#FFF8F4',
    glass: 'rgba(248,113,113,0.06)',
    text: '#231616',
    textSecondary: '#C27A6A',
    primary: '#FB7185',
    primarySoft: 'rgba(251,113,133,0.16)',
    accent: '#F97316',
    border: 'rgba(180,83,9,0.06)',
    bottomBar: '#FFF4EF',
    success: '#16A34A',
    error: '#B91C1C',
  },

  // 11. Sage Green (������� - ������)
  sageGreen: {
    background: '#E8F4EA',
    card: '#FFFFFF',
    cardAlt: '#F3F9F4',
    glass: 'rgba(34,197,94,0.08)',
    text: '#1A1A1A',
    textSecondary: '#6B7E6C',
    primary: '#65A30D',
    primarySoft: 'rgba(101,163,13,0.16)',
    accent: '#22C55E',
    border: 'rgba(15,118,110,0.08)',
    bottomBar: '#E8F4EA',
    success: '#16A34A',
    error: '#DC2626',
  },

  // 12. Denim Blue (���J�� - �������`)
  denimBlue: {
    background: '#E5EAF3',
    card: '#FFFFFF',
    cardAlt: '#EFF3FB',
    glass: 'rgba(59,130,246,0.08)',
    text: '#1A2332',
    textSecondary: '#5A6E8C',
    primary: '#3B82F6',
    primarySoft: 'rgba(59,130,246,0.16)',
    accent: '#22D3EE',
    border: 'rgba(79,70,229,0.10)',
    bottomBar: '#E5EAF3',
    success: '#22C55E',
    error: '#EF4444',
  },

  // 13. Mocha Cream (���d���o - �x����)
  mochaCream: {
    background: '#F9F4F0',
    card: '#FFFFFF',
    cardAlt: '#FCF7F3',
    glass: 'rgba(180,83,9,0.06)',
    text: '#272314',
    textSecondary: '#8C7A66',
    primary: '#D97706',
    primarySoft: 'rgba(217,119,6,0.16)',
    accent: '#F59E0B',
    border: 'rgba(120,72,0,0.08)',
    bottomBar: '#F9F4F0',
    success: '#16A34A',
    error: '#DC2626',
  },

  // 14. Teal Ocean (�`�C��)
  tealOcean: {
    background: '#E7F6F8',
    card: '#FFFFFF',
    cardAlt: '#F1FAFB',
    glass: 'rgba(20,184,166,0.08)',
    text: '#0F3A3C',
    textSecondary: '#5A8D8F',
    primary: '#14B8A6',
    primarySoft: 'rgba(20,184,166,0.16)',
    accent: '#06B6D4',
    border: 'rgba(15,118,110,0.10)',
    bottomBar: '#E7F6F8',
    success: '#16A34A',
    error: '#DC2626',
  },

  // 15. Amber Dawn (�[�ı�� - �x��)
  amberDawn: {
    background: '#FFF8EB',
    card: '#FFFFFF',
    cardAlt: '#FFFAEF',
    glass: 'rgba(251,146,60,0.06)',
    text: '#2A1A0F',
    textSecondary: '#A67C52',
    primary: '#FB923C',
    primarySoft: 'rgba(251,146,60,0.16)',
    accent: '#F59E0B',
    border: 'rgba(180,83,9,0.08)',
    bottomBar: '#FFF8EB',
    success: '#16A34A',
    error: '#DC2626',
  },

  // 16. Charcoal Violet (���� - �`����D����)
  charcoalViolet: {
    background: '#1A1625',
    card: 'rgba(30,26,40,0.96)',
    cardAlt: 'rgba(35,30,48,0.98)',
    glass: 'rgba(168,85,247,0.12)',
    text: '#E5E7EB',
    textSecondary: '#A78BFA',
    primary: '#8B5CF6',
    primarySoft: 'rgba(139,92,246,0.20)',
    accent: '#C084FC',
    border: 'rgba(168,85,247,0.20)',
    bottomBar: 'rgba(15,12,24,0.98)',
    success: '#22C55E',
    error: '#F97373',
  },

  // 17. Ice Pink (�B��)
  icePink: {
    background: '#FFF0F5',
    card: '#FFFFFF',
    cardAlt: '#FFF5F9',
    glass: 'rgba(251,113,133,0.06)',
    text: '#2A0F1A',
    textSecondary: '#B86B7E',
    primary: '#FB7185',
    primarySoft: 'rgba(251,113,133,0.14)',
    accent: '#EC4899',
    border: 'rgba(190,24,93,0.08)',
    bottomBar: '#FFF0F5',
    success: '#22C55E',
    error: '#DC2626',
  },

  // 18. Sky Gray (�ѪŦ� - �L����)
  skyGray: {
    background: '#F0F4F8',
    card: '#FFFFFF',
    cardAlt: '#F5F8FA',
    glass: 'rgba(100,116,139,0.06)',
    text: '#1E293B',
    textSecondary: '#64748B',
    primary: '#64748B',
    primarySoft: 'rgba(100,116,139,0.14)',
    accent: '#38BDF8',
    border: 'rgba(100,116,139,0.12)',
    bottomBar: '#F0F4F8',
    success: '#22C55E',
    error: '#EF4444',
  },

  // 19. Forest Shadow (�˪L�v - �`����)
  forestShadow: {
    background: '#0F1F14',
    card: 'rgba(18,30,22,0.96)',
    cardAlt: 'rgba(22,35,27,0.98)',
    glass: 'rgba(34,197,94,0.12)',
    text: '#E5E7EB',
    textSecondary: '#9CA3AF',
    primary: '#22C55E',
    primarySoft: 'rgba(34,197,94,0.20)',
    accent: '#4ADE80',
    border: 'rgba(34,197,94,0.20)',
    bottomBar: 'rgba(10,15,12,0.98)',
    success: '#22C55E',
    error: '#F97373',
  },

  // 20. Ink Black (���� - �²`��D�D)
  inkBlack: {
    background: '#050816',
    card: 'rgba(10,15,30,0.98)',
    cardAlt: 'rgba(14,23,42,0.98)',
    glass: 'rgba(148,163,253,0.10)',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#6366F1',
    primarySoft: 'rgba(99,102,241,0.22)',
    accent: '#22C55E',
    border: 'rgba(148,163,253,0.16)',
    bottomBar: 'rgba(5,8,22,0.98)',
    success: '#22C55E',
    error: '#F97373',
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

// Helper function to check if a theme is dark
export const isDarkTheme = (themeName: string): boolean => {
  const darkThemes = ['charcoalViolet', 'forestShadow', 'inkBlack'];
  return darkThemes.includes(themeName);
};

// Get theme type for each theme
export const THEME_TYPES = {
  mistBlue: 'light',
  lavenderSmoke: 'light',
  roseDust: 'light',
  oliveGray: 'light',
  sandBeige: 'light',
  seafoamGreen: 'light',
  cloudGray: 'light',
  plumNight: 'light',
  mintFrost: 'light',
  coralClay: 'light',
  sageGreen: 'light',
  denimBlue: 'light',
  mochaCream: 'light',
  tealOcean: 'light',
  amberDawn: 'light',
  charcoalViolet: 'dark',
  icePink: 'light',
  skyGray: 'light',
  forestShadow: 'dark',
  inkBlack: 'dark',
} as const;
