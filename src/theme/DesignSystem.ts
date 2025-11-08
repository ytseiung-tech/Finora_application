// designSystem.ts
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  card: 18,
  button: 14,
  pill: 999,
};

export const FONT = {
  titleXL: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  titleL: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  titleM: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  bodyM: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  label: {
    fontSize: 13,
    fontWeight: '400' as const,
  },
};

export const SHADOW = {
  softCard: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
};
