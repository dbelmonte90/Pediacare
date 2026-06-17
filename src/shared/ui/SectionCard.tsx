import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Card } from './Card';

interface SectionCardProps {
  label?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  padding?: number;
  style?: ViewStyle;
}

export function SectionCard({ label, action, children, padding = 16, style }: SectionCardProps) {
  return (
    <Card padding={padding} style={style}>
      {label ? (
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          {action ?? null}
        </View>
      ) : null}
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#a07060',
  },
});
