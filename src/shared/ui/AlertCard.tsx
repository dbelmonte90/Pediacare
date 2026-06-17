import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Colors } from '@/shared/theme/colors';

type AlertType = 'info' | 'warning' | 'danger' | 'success';

const ALERT_CONFIG: Record<AlertType, { color: string; bg: string; border: string; icon: string }> = {
  info:    { color: Colors.skyBlue, bg: `${Colors.skyBlue}12`, border: `${Colors.skyBlue}30`, icon: 'ℹ️' },
  warning: { color: Colors.amber,   bg: `${Colors.amber}12`,   border: `${Colors.amber}30`,   icon: '⚠️' },
  danger:  { color: Colors.rose,    bg: `${Colors.rose}12`,    border: `${Colors.rose}30`,    icon: '🚨' },
  success: { color: Colors.mint,    bg: `${Colors.mint}12`,    border: `${Colors.mint}30`,    icon: '✅' },
};

interface AlertCardProps {
  type?: AlertType;
  icon?: string;
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AlertCard({ type = 'info', icon, title, children, style }: AlertCardProps) {
  const cfg = ALERT_CONFIG[type];
  const displayIcon = icon ?? cfg.icon;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: cfg.bg, borderColor: cfg.border },
        style,
      ]}
    >
      <Text style={styles.icon}>{displayIcon}</Text>
      <View style={styles.body}>
        {title ? (
          <Text style={[styles.title, { color: cfg.color }]}>{title}</Text>
        ) : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  icon: { fontSize: 18 },
  body: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
});
