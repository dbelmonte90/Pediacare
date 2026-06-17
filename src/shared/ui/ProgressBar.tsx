import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';

interface ProgressBarProps {
  progress: number;  // 0–1
  color?: string;
  label?: string;
  showPercent?: boolean;
}

export function ProgressBar({
  progress,
  color = Colors.coral,
  label,
  showPercent = false,
}: ProgressBarProps) {
  const pct = Math.min(Math.max(progress, 0), 1);

  return (
    <View>
      {(label || showPercent) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercent && (
            <Text style={[styles.pct, { color }]}>{Math.round(pct * 100)}%</Text>
          )}
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  pct: {
    ...Typography.caption,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
