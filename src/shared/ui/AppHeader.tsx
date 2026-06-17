import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Colors } from '@/shared/theme/colors';

type SectionName = keyof typeof Colors.gradients;

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  section: SectionName;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function AppHeader({ title, subtitle, section, children, style }: AppHeaderProps) {
  const [colorStart, colorEnd] = Colors.gradients[section];
  return (
    <View style={[styles.outer, style]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colorStart }]} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colorEnd, opacity: 0.55 }]} />
      <View style={styles.inner}>
        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
        <Text style={styles.title}>{title}</Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    marginBottom: 4,
  },
  inner: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 28,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
});
