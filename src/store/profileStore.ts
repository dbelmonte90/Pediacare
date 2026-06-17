import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { immer } from 'zustand/middleware/immer';
import type { Profile } from '@/entities/profile/model/types';
import { MOCK_PROFILES } from '@/shared/constants/mockProfiles';

interface ProfileState {
  profiles: Profile[];
  activeProfileId: string | null;
}

interface ProfileActions {
  setActiveProfile: (id: string) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, patch: Partial<Profile>) => void;
  removeProfile: (id: string) => void;
  activeProfile: () => Profile | null;
}

export const useProfileStore = create<ProfileState & ProfileActions>()(
  persist(
    immer((set, get) => ({
      profiles: MOCK_PROFILES,
      activeProfileId: MOCK_PROFILES[0]?.id ?? null,

      activeProfile: () => {
        const { profiles, activeProfileId } = get();
        return profiles.find((p) => p.id === activeProfileId) ?? null;
      },

      setActiveProfile: (id) =>
        set((state) => {
          state.activeProfileId = id;
        }),

      addProfile: (profile) =>
        set((state) => {
          state.profiles.push(profile);
          state.activeProfileId = profile.id;
        }),

      updateProfile: (id, patch) =>
        set((state) => {
          const idx = state.profiles.findIndex((p) => p.id === id);
          if (idx !== -1) Object.assign(state.profiles[idx], patch);
        }),

      removeProfile: (id) =>
        set((state) => {
          state.profiles = state.profiles.filter((p) => p.id !== id);
          if (state.activeProfileId === id) {
            state.activeProfileId = state.profiles[0]?.id ?? null;
          }
        }),
    })),
    {
      name: 'pediacare-profiles',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
