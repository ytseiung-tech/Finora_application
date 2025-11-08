# 🎨 Theme Color Reference - Quick Lookup

This is a quick reference sheet for developers and designers working with Finora themes.

## Color Codes Table

| Theme | Background | Primary | Accent | Text | Card |
|-------|-----------|---------|--------|------|------|
| **Light** | `#fffbec` | `#7B68EE` | - | `#1a1a1a` | `#ffffff` |
| **Dark** | `#111518` | `#7B68EE` | - | `#ffffff` | `#1a2a32` |
| **Honey Sea** | `#FDF6EC` | `#FFB703` | `#FB8500` | `#2B2B2B` | `#FFF9F1` |
| **Glacier Blue** | `#E0F2FE` | `#0284C7` | `#38BDF8` | `#0F172A` | `#F0F9FF` |
| **Mint Cloud** | `#F9FAF5` | `#22C55E` | `#86EFAC` | `#1A1A1A` | `#FFFFFF` |
| **Sakura Dream** | `#FFF1F2` | `#EC4899` | `#F9A8D4` | `#3F3F46` | `#FFE4E6` |
| **Iron Void** | `#0F172A` | `#38BDF8` | `#0EA5E9` | `#E2E8F0` | `rgba(255,255,255,0.05)` |
| **Desert Sand** | `#FAF3E0` | `#CA8A04` | `#FACC15` | `#3F3F3F` | `#FEFCE8` |
| **Midnight Plum** | `#1E1B4B` | `#7C3AED` | `#C084FC` | `#EDE9FE` | `#2E1065` |
| **Forest Dew** | `#ECFDF5` | `#10B981` | `#34D399` | `#064E3B` | `#D1FAE5` |
| **Nebula Gray** | `#F3F4F6` | `#6B7280` | `#9CA3AF` | `#111827` | `#E5E7EB` |
| **Solar Ember** | `#FFF7ED` | `#EA580C` | `#F97316` | `#1C1917` | `#FFEDD5` |

## Theme Characteristics

### Light Themes (Day Use)
- Light Mode ⭐ Original
- Honey Sea 🍯 Warm & Inviting
- Glacier Blue ❄️ Professional
- Mint Cloud 🌿 Fresh & Calming
- Sakura Dream 🌸 Soft & Elegant
- Desert Sand 🏜️ Warm & Serene
- Forest Dew 🌲 Natural & Refreshing
- Nebula Gray ⚪ Neutral & Versatile
- Solar Ember 🔥 Energetic & Bold

### Dark Themes (Night Use)
- Dark Mode 🌙 Original
- Iron Void 🖤 Tech & Futuristic
- Midnight Plum 💜 Mysterious & Premium

## Color Psychology

### Warm Themes (Energy, Comfort)
- Honey Sea - Optimism, warmth
- Desert Sand - Stability, earthiness
- Solar Ember - Energy, action
- Sakura Dream - Romance, gentleness

### Cool Themes (Calm, Trust)
- Glacier Blue - Trust, professionalism
- Mint Cloud - Growth, freshness
- Iron Void - Technology, focus
- Midnight Plum - Luxury, creativity

### Neutral Themes (Balance, Versatility)
- Light Mode - Classic, clean
- Dark Mode - Modern, sleek
- Nebula Gray - Minimal, professional
- Forest Dew - Balance, nature

## Usage Tips

### Professional Settings
1. Glacier Blue - Best for banking/finance
2. Nebula Gray - Corporate environments
3. Light Mode - Traditional office

### Creative Work
1. Midnight Plum - Design work
2. Sakura Dream - Content creation
3. Forest Dew - Nature photography

### Personal Finance
1. Mint Cloud - Growth mindset
2. Honey Sea - Warm tracking
3. Solar Ember - Motivational

### Focus & Productivity
1. Dark Mode - Late night work
2. Iron Void - Deep focus
3. Nebula Gray - Distraction-free

## Accessibility Notes

### High Contrast (Best for Visibility)
- Dark Mode
- Light Mode
- Iron Void
- Glacier Blue

### Medium Contrast (Comfortable)
- Mint Cloud
- Forest Dew
- Nebula Gray
- Desert Sand

### Soft Contrast (Easy on Eyes)
- Honey Sea
- Sakura Dream
- Midnight Plum
- Solar Ember

## Testing Commands

To test themes programmatically:

```typescript
// In any component with useApp() hook
const { updateTheme } = useApp();

// Switch to specific theme
updateTheme('honeySea');
updateTheme('glacierBlue');
updateTheme('mintCloud');
// ... etc
```

## Color Naming Convention

All theme objects follow this structure:
```typescript
{
  background: string;        // Main screen background
  backgroundSecondary: string;  // Alternative background
  backgroundTertiary: string;   // Accent background
  text: string;              // Primary text
  textSecondary: string;     // Secondary text
  textTertiary: string;      // Tertiary text
  border: string;            // Border color
  borderLight: string;       // Light border
  card: string;              // Card background
  cardSecondary: string;     // Alternative card
  success: string;           // Success status
  error: string;             // Error status
  warning: string;           // Warning status
  info: string;              // Info status
  primary: string;           // Primary action
}
```

## Quick Switch Guide

**In Settings Screen:**
1. Tap "Theme" (主題)
2. Select from list
3. Done! ✅

**Keyboard Shortcuts (Future Feature):**
- Ctrl+1 → Light
- Ctrl+2 → Dark
- Ctrl+3 → Honey Sea
- ... (to be implemented)

---

**Version:** 2.6.0  
**Last Updated:** 2025-01-17
