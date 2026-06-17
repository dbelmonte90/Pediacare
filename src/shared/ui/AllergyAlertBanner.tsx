import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { MOCK_ALLERGIES } from '@/shared/constants/mockAllergies';
import { useProfileStore } from '@/store/profileStore';

export function AllergyAlertBanner() {
  const activeProfile = useProfileStore((s) => s.activeProfile());

  if (!activeProfile || activeProfile.type !== 'child') return null;

  const allergies = MOCK_ALLERGIES.filter((a) => a.profileId === activeProfile.id);
  if (allergies.length === 0) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>⚠️</Text>
      <View style={styles.text}>
        <Text style={styles.label}>ALERGIAS REGISTRADAS</Text>
        <Text style={styles.list}>{allergies.map((a) => a.substance).join(' · ')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.amber}20`,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: `${Colors.amber}40`,
    marginHorizontal: 16,
    marginTop: 8,
  },
  icon: { fontSize: 20 },
  text: { flex: 1 },
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
