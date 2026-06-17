import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Shadows } from '@/shared/theme/shadows';
import { useProfileStore } from '@/store/profileStore';
import { useUIStore } from '@/store/uiStore';
import { getProfileKeyData } from '@/entities/profile/model/selectors';
import type { Profile } from '@/entities/profile/model/types';

export function ProfileDrawer() {
  const profiles = useProfileStore((s) => s.profiles);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile);
  const drawerOpen = useUIStore((s) => s.profileDrawerOpen);
  const closeDrawer = useUIStore((s) => s.closeProfileDrawer);
  const openAddProfile = useUIStore((s) => s.openAddProfileModal);

  const handleSelect = (profile: Profile) => {
    setActiveProfile(profile.id);
    closeDrawer();
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
          <Text style={styles.title}>Mis perfiles</Text>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {profiles.map((profile) => {
              const isActive = profile.id === activeProfileId;
              return (
                <TouchableOpacity
                  key={profile.id}
                  style={[styles.profileRow, isActive && styles.activeRow]}
                  onPress={() => handleSelect(profile)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.avatar, { backgroundColor: profile.color }]}>
                    <Text style={styles.avatarLetter}>{profile.name[0]}</Text>
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{profile.name}</Text>
                    <Text style={styles.profileMeta}>
                      {profile.type === 'pregnancy' ? 'Embarazo' : 'Niño/a'} ·{' '}
                      {getProfileKeyData(profile)}
                    </Text>
                  </View>
                  {isActive && <View style={[styles.activeDot, { backgroundColor: profile.color }]} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              closeDrawer();
              openAddProfile();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Añadir perfil</Text>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  title: {
    ...Typography.headingBold,
    marginBottom: 16,
  },
  list: { maxHeight: 320 },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  activeRow: {
    backgroundColor: Colors.background,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: Colors.surface,
    fontWeight: '800',
    fontSize: 18,
  },
  profileInfo: { flex: 1 },
  profileName: { ...Typography.bodyMedium, fontWeight: '700' },
  profileMeta: { ...Typography.caption, marginTop: 2 },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  addButton: {
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.lavender,
  },
});
