import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { useProfileStore } from '@/store/profileStore';
import { useUIStore } from '@/store/uiStore';
import { getProfileKeyData } from '@/entities/profile/model/selectors';

const TYPE_EMOJI: Record<string, string> = {
  pregnancy: '🤰',
  male: '👦',
  female: '👧',
};

export function ProfilePill() {
  const activeProfile = useProfileStore((s) => s.activeProfile());
  const openDrawer = useUIStore((s) => s.openProfileDrawer);

  if (!activeProfile) return null;

  const keyData = getProfileKeyData(activeProfile);
  const typeEmoji =
    activeProfile.type === 'pregnancy'
      ? TYPE_EMOJI.pregnancy
      : TYPE_EMOJI[activeProfile.sex];

  return (
    <TouchableOpacity
      onPress={openDrawer}
      activeOpacity={0.75}
      style={styles.pill}
    >
      {/* Avatar */}
      <View style={[styles.avatarWrapper, { backgroundColor: activeProfile.color }]}>
        <Text style={styles.avatarLetter}>{activeProfile.name[0].toUpperCase()}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeEmoji}>{typeEmoji}</Text>
        </View>
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text style={styles.name} numberOfLines={1}>{activeProfile.name}</Text>
        <Text style={styles.keyData} numberOfLines={1}>{keyData}</Text>
      </View>

      {/* Chevron */}
      <View style={[styles.chevronWrapper, { borderColor: `${activeProfile.color}40` }]}>
        <Text style={[styles.chevron, { color: activeProfile.color }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 220,
  },
  avatarWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.surface,
    lineHeight: 18,
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadgeEmoji: {
    fontSize: 10,
    lineHeight: 12,
  },
  textBlock: {
    flex: 1,
    gap: 1,
  },
  name: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 13,
    color: Colors.textPrimary,
  },
  keyData: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  chevronWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
    marginLeft: 1,
  },
});
