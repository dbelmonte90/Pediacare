import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, type ViewStyle } from 'react-native';
import { Colors } from '@/shared/theme/colors';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  color = Colors.coral,
  disabled = false,
  icon,
  style,
  fullWidth = true,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: color },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.4 },
  icon: { fontSize: 18 },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
