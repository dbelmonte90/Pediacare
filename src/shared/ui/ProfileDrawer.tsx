import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Shadows } from '@/shared/theme/shadows';
import { useProfileStore } from '@/store/profileStore';
import { useUIStore } from '@/store/uiStore';
import { getProfileKeyData } from '@/entities/profile/model/selectors';
import type { Profile } from '@/entities/profile/model/types';

const TYPE_EMOJI: Record<string, string> = {
  pregnancy: '🤰',
  male: '👦',
  female: '👧',
};

const TYPE_LABEL: Record<string, string> = {
  pregnancy: 'Embarazo',
  male: 'Niño',
  female: 'Niña',
};

function getTypeKey(profile: Profile): string {
  if (profile.type === 'pregnancy') return 'pregnancy';
  return profile.sex;
}

function ProfileRow({
  profile,
  isActive,
  onSelect,
  onDelete,
}: {
  profile: Profile;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const [showDelete, setShowDelete] = useState(false);
  const typeKey = getTypeKey(profile);

  return (
    <TouchableOpacity
      style={[styles.profileRow, isActive && styles.activeRow]}
      onPress={() => {
        if (showDelete) { setShowDelete(false); return; }
        onSelect();
      }}
      onLongPress={() => setShowDelete(true)}
      activeOpacity={0.7}
      delayLongPress={400}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: profile.color }]}>
        <Text style={styles.avatarLetter}>{profile.name[0].toUpperCase()}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeEmoji}>{TYPE_EMOJI[typeKey]}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.profileInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.profileName}>{profile.name}</Text>
          {isActive && (
            <View style={[styles.activePill, { backgroundColor: `${profile.color}20` }]}>
              <Text style={[styles.activePillText, { color: profile.color }]}>Activo</Text>
            </View>
          )}
        </View>
        <Text style={styles.profileMeta}>
          {TYPE_LABEL[typeKey]} · {getProfileKeyData(profile)}
        </Text>
      </View>

      {/* Delete button (long press) or active checkmark */}
      {showDelete ? (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteText}>🗑</Text>
        </TouchableOpacity>
      ) : isActive ? (
        <View style={[styles.activeCheck, { backgroundColor: profile.color }]}>
          <Text style={styles.activeCheckMark}>✓</Text>
        </View>
      ) : (
        <View style={styles.inactiveCheck} />
      )}
    </TouchableOpacity>
  );
}

export function ProfileDrawer() {
  const router = useRouter();
  const profiles = useProfileStore((s) => s.profiles);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile);
  const removeProfile = useProfileStore((s) => s.removeProfile);
  const drawerOpen = useUIStore((s) => s.profileDrawerOpen);
  const closeDrawer = useUIStore((s) => s.closeProfileDrawer);

  const handleSelect = (profile: Profile) => {
    setActiveProfile(profile.id);
    closeDrawer();
  };

  const handleDelete = (profile: Profile) => {
    if (profiles.length <= 1) {
      Alert.alert('No puedes eliminar el último perfil');
      return;
    }
    Alert.alert(
      `Eliminar ${profile.name}`,
      'Se eliminará el perfil y todos sus datos. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removeProfile(profile.id),
        },
      ]
    );
  };

  const handleAddProfile = () => {
    closeDrawer();
    setTimeout(() => router.push('/modals/add-profile'), 250);
  };

  return (
    <Modal
      visible={drawerOpen}
      transparent
      animationType="slide"
      onRequestClose={closeDrawer}
    >
      <Pressable style={styles.overlay} onPress={closeDrawer}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Mis perfiles</Text>
            <Text style={styles.hint}>Mantén pulsado para eliminar</Text>
          </View>

          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {profiles.map((profile) => (
              <ProfileRow
                key={profile.id}
                profile={profile}
                isActive={profile.id === activeProfileId}
                onSelect={() => handleSelect(profile)}
                onDelete={() => handleDelete(profile)}
              />
            ))}
          </ScrollView>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddProfile}
            activeOpacity={0.8}
          >
            <View style={styles.addIconWrapper}>
              <Text style={styles.addIcon}>+</Text>
            </View>
            <Text style={styles.addButtonText}>Añadir nuevo perfil</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 36,
    ...Shadows.modal,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    ...Typography.headingBold,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  list: {
    maxHeight: 340,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 4,
  },
  activeRow: {
    backgroundColor: Colors.background,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: Colors.surface,
    fontWeight: '800',
    fontSize: 20,
  },
  typeBadge: {
    position: 'absolute',
    bottom: -1,
    right: -3,
    backgroundColor: Colors.surface,
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadgeEmoji: {
    fontSize: 11,
    lineHeight: 13,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
  },
  activePill: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileMeta: {
    ...Typography.caption,
    marginTop: 2,
  },
  activeCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCheckMark: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '800',
  },
  inactiveCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.rose}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: 12,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.lavender,
  },
  addIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.lavender}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 24,
    color: Colors.lavender,
    fontWeight: '300',
    lineHeight: 28,
  },
  addButtonText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.lavender,
  },
});
