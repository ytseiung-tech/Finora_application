# 🎨 Finora Theme Gallery

This document showcases all 12 available themes in the Finora app.

## How to Use

1. Open the app and navigate to **Settings**
2. Tap on **Theme** (主題)
3. Select your preferred theme from the list

---

## Theme Previews

### 1. 🌟 Light Mode (淺色模式)
**Original Theme - Clean & Bright**
- Background: `#fffbec` (Warm cream white)
- Primary: `#7B68EE` (Soft purple-blue)
- Card: `#ffffff` (Pure white)
- Text: `#1a1a1a` (Dark gray)

**Best For:** Daytime use, bright environments, professional look

---

### 2. 🌙 Dark Mode (深色模式)
**Original Theme - Sleek & Modern**
- Background: `#111518` (Deep charcoal)
- Primary: `#7B68EE` (Soft purple-blue)
- Card: `#1a2a32` (Dark slate)
- Text: `#ffffff` (White)

**Best For:** Night use, OLED displays, eye comfort in dark environments

---

### 3. 🍯 Honey Sea (蜂蜜海)
**Warm & Inviting**
- Background: `#FDF6EC` (Honey cream)
- Primary: `#FFB703` (Golden amber)
- Accent: `#FB8500` (Sunset orange)
- Card: `#FFF9F1` (Soft cream)

**Mood:** Warm honey orange with sea breeze blue light, soft yet bright
**Best For:** Cozy feel, warm atmosphere, morning energy

---

### 4. ❄️ Glacier Blue (冰川藍)
**Professional & Clean**
- Background: `#E0F2FE` (Ice blue)
- Primary: `#0284C7` (Deep sky blue)
- Accent: `#38BDF8` (Bright blue)
- Card: `#F0F9FF` (Frost white)

**Mood:** Fresh blue-white, clean and calm, strong financial sense
**Best For:** Professional banking feel, clarity, trust

---

### 5. 🌿 Mint Cloud (薄荷雲)
**Fresh & Calming**
- Background: `#F9FAF5` (Cloud white)
- Primary: `#22C55E` (Fresh mint)
- Accent: `#86EFAC` (Light mint)
- Card: `#FFFFFF` (Pure white)

**Mood:** Smooth mint green, reassuring for financial management
**Best For:** Peaceful tracking, growth mindset, nature lovers

---

### 6. 🌸 Sakura Dream (櫻花夢)
**Soft & Elegant**
- Background: `#FFF1F2` (Cherry blossom)
- Primary: `#EC4899` (Pink blossom)
- Accent: `#F9A8D4` (Soft pink)
- Card: `#FFE4E6` (Petal pink)

**Mood:** Soft cherry blossom color, suitable for light theme or feminine style
**Best For:** Gentle aesthetics, spring vibes, elegant tracking

---

### 7. 🖤 Iron Void (鐵灰虛空)
**Tech & Futuristic**
- Background: `#0F172A` (Deep void)
- Primary: `#38BDF8` (Cyan blue)
- Accent: `#0EA5E9` (Electric blue)
- Card: `rgba(255,255,255,0.05)` (Translucent)

**Mood:** Tech cold black system, best for night mode
**Best For:** Tech enthusiasts, minimal distraction, pure focus

---

### 8. 🏜️ Desert Sand (沙漠沙)
**Warm & Serene**
- Background: `#FAF3E0` (Sandy beige)
- Primary: `#CA8A04` (Desert gold)
- Accent: `#FACC15` (Sunshine yellow)
- Card: `#FEFCE8` (Pale sand)

**Mood:** Dry warm sand color, like afternoon sunlight on a ledger
**Best For:** Warmth without intensity, afternoon sessions

---

### 9. 💜 Midnight Plum (午夜紫)
**Mysterious & Premium**
- Background: `#1E1B4B` (Deep purple night)
- Primary: `#7C3AED` (Royal purple)
- Accent: `#C084FC` (Light purple)
- Card: `#2E1065` (Dark plum)

**Mood:** Deep purple night color, mysterious yet premium
**Best For:** Luxury feel, creative minds, evening elegance

---

### 10. 🌲 Forest Dew (森林露)
**Natural & Refreshing**
- Background: `#ECFDF5` (Morning mist)
- Primary: `#10B981` (Forest green)
- Accent: `#34D399` (Spring green)
- Card: `#D1FAE5` (Dew green)

**Mood:** Morning forest tone, combines vitality with calmness
**Best For:** Nature connection, balanced energy, growth tracking

---

### 11. ⚪ Nebula Gray (星雲灰)
**Neutral & Versatile**
- Background: `#F3F4F6` (Light gray)
- Primary: `#6B7280` (Medium gray)
- Accent: `#9CA3AF` (Silver gray)
- Card: `#E5E7EB` (Pale gray)

**Mood:** Neutral gray system, most versatile UI base color
**Best For:** Minimalists, maximum compatibility, professional neutrality

---

### 12. 🔥 Solar Ember (太陽餘燼)
**Energetic & Bold**
- Background: `#FFF7ED` (Warm cream)
- Primary: `#EA580C` (Orange ember)
- Accent: `#F97316` (Flame orange)
- Card: `#FFEDD5` (Soft peach)

**Mood:** Orange-red ember feel, full of energy and contrast
**Best For:** High energy, motivation, bold statements

---

## Theme Selection Guide

### For Different Times of Day
- **Morning:** Honey Sea, Mint Cloud, Forest Dew
- **Afternoon:** Desert Sand, Sakura Dream, Nebula Gray
- **Evening:** Midnight Plum, Glacier Blue
- **Night:** Dark Mode, Iron Void

### By Personality
- **Professional:** Glacier Blue, Nebula Gray
- **Creative:** Sakura Dream, Midnight Plum
- **Energetic:** Solar Ember, Honey Sea
- **Calm:** Mint Cloud, Forest Dew
- **Tech-Savvy:** Iron Void, Dark Mode

### By Mood
- **Focus:** Iron Void, Nebula Gray, Dark Mode
- **Relaxation:** Mint Cloud, Forest Dew, Sakura Dream
- **Energy:** Solar Ember, Honey Sea
- **Elegance:** Midnight Plum, Glacier Blue
- **Warmth:** Desert Sand, Honey Sea

---

## Implementation Details

All themes include:
- ✅ Background colors (3 levels)
- ✅ Text colors (primary, secondary, tertiary)
- ✅ Card backgrounds (primary, secondary)
- ✅ Border colors (standard, light)
- ✅ Status colors (success, error, warning, info)
- ✅ Primary action color

Each theme is carefully balanced for:
- 📱 Mobile readability
- 🎨 Visual harmony
- 👁️ Eye comfort
- ♿ Accessibility

---

## Technical Notes

**File Locations:**
- Theme definitions: `src/theme/Colors.ts`
- Theme configuration: `src/config/app.config.ts`
- Theme context: `src/context/AppContext.tsx`
- Theme selector: `src/screens/SettingsScreen.tsx`

**Storage:**
- Themes are saved to AsyncStorage
- Persists across app restarts
- Default: Dark Mode

---

**Version:** 2.0.0  
**Last Updated:** 2025-01-17  
**Total Themes:** 12 (2 original + 10 new)
