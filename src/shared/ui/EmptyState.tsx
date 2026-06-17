import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Typography } from '@/shared/theme/typography';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export function EmptyState({ emoji = '📭', title, subtitle, action, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {action ?? null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  emoji: { fontSize: 48, marginBottom: 8 },
  title: { ...Typography.headingBold, textAlign: 'center' },
  subtitle: { ...Typography.bodyRegular, textAlign: 'center', lineHeight: 22 },
});
