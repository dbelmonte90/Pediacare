import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { useProfileStore } from '@/store/profileStore';
import { useUIStore } from '@/store/uiStore';
import { getProfileKeyData } from '@/entities/profile/model/selectors';

export function ProfilePill() {
  const activeProfile = useProfileStore((s) => s.activeProfile());
  const openDrawer = useUIStore((s) => s.openProfileDrawer);

  if (!activeProfile) return null;

  const keyData = getProfileKeyData(activeProfile);

  return (
    <TouchableOpacity
      onPress={openDrawer}
      activeOpacity={0.8}
      style={[styles.pill, { borderColor: activeProfile.color }]}
    >
      <View style={[styles.dot, { backgroundColor: activeProfile.color }]} />
      <View>
        <Text style={styles.name}>{activeProfile.name}</Text>
        <Text style={styles.keyData}>{keyData}</Text>
      </View>
      <Text style={[styles.chevron, { color: activeProfile.color }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1.5,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  name: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  keyData: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 2,
  },
});
