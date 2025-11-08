// ThemePreview.tsx - Mini UI preview for theme selection
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ThemePreviewProps {
  theme: {
    background: string;
    card: string;
    primary: string;
    accent: string;
    text: string;
    border: string;
  };
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, borderColor: theme.border },
      ]}
    >
      {/* Mini header */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.headerTitle,
            { backgroundColor: theme.text },
          ]}
        />
        <View
          style={[
            styles.headerDot,
            { backgroundColor: theme.primary },
          ]}
        />
      </View>

      {/* Mini card */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.accent || theme.primary },
          ]}
        />
        <View style={styles.cardTextCol}>
          <View
            style={[
              styles.line,
              { backgroundColor: theme.text },
            ]}
          />
          <View
            style={[
              styles.lineShort,
              { backgroundColor: theme.border },
            ]}
          />
        </View>
      </View>

      {/* Mini button */}
      <View
        style={[
          styles.button,
          { backgroundColor: theme.primary },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 8,
    borderWidth: 0.5,
    height: 66,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    opacity: 0.12,
  },
  headerDot: {
    marginLeft: 'auto',
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.9,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 6,
    marginBottom: 6,
    opacity: 0.96,
    borderWidth: 0.5,
  },
  avatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
    opacity: 0.9,
  },
  cardTextCol: {
    flex: 1,
  },
  line: {
    height: 5,
    borderRadius: 3,
    marginBottom: 3,
    opacity: 0.18,
  },
  lineShort: {
    width: '60%',
    height: 4,
    borderRadius: 3,
    opacity: 0.16,
  },
  button: {
    marginTop: 2,
    alignSelf: 'flex-end',
    width: 40,
    height: 8,
    borderRadius: 999,
    opacity: 0.9,
  },
});
