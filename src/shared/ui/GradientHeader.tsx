import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, type SectionName } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  section: SectionName;
}

export function GradientHeader({ title, subtitle, section }: GradientHeaderProps) {
  const [startColor] = Colors.gradients[section];

  return (
    <View style={[styles.container, { backgroundColor: startColor }]}>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  subtitle: {
    ...Typography.labelUppercase,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
  },
  title: {
    ...Typography.displayBold,
    color: Colors.surface,
  },
});
