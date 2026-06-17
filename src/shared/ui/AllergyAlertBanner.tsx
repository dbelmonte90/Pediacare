import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { useProfileStore } from '@/store/profileStore';

export function AllergyAlertBanner() {
  const activeProfile = useProfileStore((s) => s.activeProfile());

  if (!activeProfile || activeProfile.type !== 'child') return null;
  if (!activeProfile.allergies || activeProfile.allergies.length === 0) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>⚠️</Text>
      <View style={styles.textBlock}>
        <Text style={styles.label}>ALERGIAS REGISTRADAS</Text>
        <Text style={styles.list}>
          {activeProfile.allergies.join(' · ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.amber}18`,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: `${Colors.amber}35`,
    marginHorizontal: 16,
    marginTop: 8,
  },
  icon: { fontSize: 20 },
  textBlock: { flex: 1 },
  label: {
    ...Typography.labelUppercase,
    color: Colors.amber,
    fontSize: 10,
  },
  list: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginTop: 2,
  },
});
