import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, type ViewStyle } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Shadows } from '@/shared/theme/shadows';

interface Segment<T extends string> {
  key: T;
  label: string;
  emoji?: string;
}

interface SegmentedControlProps<T extends string> {
  segments: Array<Segment<T>>;
  value: T;
  onChange: (key: T) => void;
  activeColor?: string;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  activeColor = Colors.coral,
  style,
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.container, style]}>
      {segments.map((seg) => {
        const active = seg.key === value;
        return (
          <TouchableOpacity
            key={seg.key}
            style={[styles.segment, active && { backgroundColor: activeColor }]}
            onPress={() => onChange(seg.key)}
            activeOpacity={0.75}
          >
            {seg.emoji ? (
              <Text style={styles.emoji}>{seg.emoji}</Text>
            ) : null}
            <Text style={[styles.label, active && styles.labelActive]}>
              {seg.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginHorizontal: 16,
    marginVertical: 12,
    ...Shadows.card,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    borderRadius: 10,
  },
  emoji: { fontSize: 14 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  labelActive: { color: '#fff' },
});
