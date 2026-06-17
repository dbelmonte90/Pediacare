import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Shadows } from '@/shared/theme/shadows';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: number;
}

export function Card({ children, padding = 16, style, ...rest }: CardProps) {
  return (
    <View style={[styles.card, { padding }, Shadows.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
