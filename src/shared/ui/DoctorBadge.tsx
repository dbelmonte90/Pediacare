import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';

export function DoctorBadge() {
  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      <View>
        <Text style={styles.name}>Dra. Saray Mesonero</Text>
        <Text style={styles.role}>Contenido validado · Pediatra colegiada</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.mint}15`,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: `${Colors.mint}30`,
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  role: {
    ...Typography.caption,
    color: Colors.mint,
  },
});
