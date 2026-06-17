import React from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';

interface FormInputProps extends TextInputProps {
  label?: string;
  unit?: string;
  error?: string;
  accentColor?: string;
}

export function FormInput({ label, unit, error, accentColor = Colors.coral, style, ...rest }: FormInputProps) {
  return (
    <View>
      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
      <View style={[styles.inputWrapper, { borderColor: accentColor }]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textSecondary}
          {...rest}
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#a07060',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  unit: { ...Typography.bodyMedium, color: Colors.textSecondary, paddingRight: 12 },
  error: { ...Typography.caption, color: Colors.rose, marginTop: 4 },
});
