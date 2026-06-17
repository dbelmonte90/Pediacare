import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type TouchableOpacityProps,
} from 'react-native';
import { Colors, type SectionName } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'outline' | 'ghost';
  section?: SectionName;
}

export function Button({
  label,
  variant = 'primary',
  section = 'home',
  style,
  ...rest
}: ButtonProps) {
  const accentColor = Colors.gradients[section][0];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.base,
        variant === 'primary' && { backgroundColor: accentColor },
        variant === 'outline' && [styles.outline, { borderColor: accentColor }],
        variant === 'ghost' && styles.ghost,
        style,
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' && { color: Colors.surface },
          variant === 'outline' && { color: accentColor },
          variant === 'ghost' && { color: accentColor },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  label: {
    ...Typography.bodyMedium,
    fontWeight: '700',
  },
});
