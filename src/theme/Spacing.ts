// Spacing system matching iOS/Android implementations
export const SPACING = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  xxxxxl: 48,

  // Semantic spacing
  padding: 16,
  margin: 16,
  gap: 12,
  section: 24,
  screen: 20,

  // Component specific
  cardPadding: 16,
  cardMargin: 8,
  buttonPadding: 12,
  inputPadding: 16,
  listItemPadding: 12,
  headerPadding: 20,

  // Border radius
  radiusSmall: 8,
  radiusMedium: 12,
  radiusLarge: 16,
  radiusXLarge: 20,
  radiusRound: 50,

  // Elevation/Shadow
  elevation1: 2,
  elevation2: 4,
  elevation3: 8,
  elevation4: 12,
  elevation5: 16,
} as const;

export type SpacingKey = keyof typeof SPACING;
