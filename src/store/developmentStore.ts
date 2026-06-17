import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_ACHIEVEMENTS_SOFIA, MOCK_ACHIEVEMENTS_LUCAS } from '@/shared/constants/developmentData';

interface DevState {
  achievements: Record<string, Record<string, string>>; // profileId → milestoneId → achievedDate
  _hasHydrated: boolean;
}

interface DevActions {
  toggleMilestone:  (profileId: string, milestoneId: string) => void;
  isAchieved:       (profileId: string, milestoneId: string) => boolean;
  getAchievements:  (profileId: string) => Record<string, string>;
  seedIfEmpty:      (profileId: string, mock: 'sofia' | 'lucas') => void;
}

export const useDevelopmentStore = create<DevState & DevActions>()(
  persist(
    immer((set, get) => ({
      achievements: {},
      _hasHydrated: false,

      toggleMilestone(profileId, milestoneId) {
        set((state) => {
          if (!state.achievements[profileId]) state.achievements[profileId] = {};
          if (state.achievements[profileId][milestoneId]) {
            delete state.achievements[profileId][milestoneId];
          } else {
            state.achievements[profileId][milestoneId] = new Date().toISOString().slice(0, 10);
          }
        });
      },

      isAchieved(profileId, milestoneId) {
        return !!get().achievements[profileId]?.[milestoneId];
      },

      getAchievements(profileId) {
        return get().achievements[profileId] ?? {};
      },

      seedIfEmpty(profileId, mock) {
        const hasData = Object.keys(get().achievements[profileId] ?? {}).length > 0;
        if (hasData) return;
        set((state) => {
          state.achievements[profileId] =
            mock === 'sofia' ? { ...MOCK_ACHIEVEMENTS_SOFIA } : { ...MOCK_ACHIEVEMENTS_LUCAS };
        });
      },
    })),
    {
      name: 'development-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        achievements: state.achievements,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn('[developmentStore] hydration error', error);
        useDevelopmentStore.setState({ _hasHydrated: true });
      },
    }
  )
);
