import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

interface BadgeProps {
  label: string;
  color?: string;
  filled?: boolean;
  size?: 'sm' | 'md';
}

export function Badge({ label, color = Colors.coral, filled = false, size = 'sm' }: BadgeProps) {
  const isMd = size === 'md';
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: filled ? color : `${color}15`,
          paddingVertical: isMd ? 4 : 2,
          paddingHorizontal: isMd ? 10 : 6,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: filled ? '#fff' : color,
            fontSize: isMd ? 12 : 11,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 8 },
  label: { fontWeight: '700' },
});
