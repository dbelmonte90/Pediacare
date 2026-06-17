import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRENATAL_CHECKLIST, MOCK_WEIGHT_ENTRIES } from '@/shared/constants/pregnancyData';
import type { WeightEntry } from '@/entities/pregnancy/model/types';

interface PregnancyState {
  // checklist: profileId → { itemId → done }
  checklist: Record<string, Record<string, boolean>>;
  // weight: profileId → entries[]
  weightEntries: Record<string, WeightEntry[]>;
  _hasHydrated: boolean;
}

interface PregnancyActions {
  toggleChecklistItem: (profileId: string, itemId: string) => void;
  addWeightEntry: (profileId: string, entry: WeightEntry) => void;
  removeWeightEntry: (profileId: string, date: string) => void;
  getChecklist: (profileId: string) => Array<{ id: string; label: string; category: string; weekRange?: string; done: boolean }>;
  getWeightEntries: (profileId: string) => WeightEntry[];
  seedWeightIfEmpty: (profileId: string) => void;
}

export const usePregnancyStore = create<PregnancyState & PregnancyActions>()(
  persist(
    immer((set, get) => ({
      checklist: {},
      weightEntries: {},
      _hasHydrated: false,

      toggleChecklistItem(profileId, itemId) {
        set((state) => {
          if (!state.checklist[profileId]) {
            state.checklist[profileId] = {};
          }
          const current = state.checklist[profileId][itemId] ?? false;
          state.checklist[profileId][itemId] = !current;
        });
      },

      addWeightEntry(profileId, entry) {
        set((state) => {
          if (!state.weightEntries[profileId]) {
            state.weightEntries[profileId] = [];
          }
          // Replace if same date, otherwise append
          const idx = state.weightEntries[profileId].findIndex((e) => e.date === entry.date);
          if (idx >= 0) {
            state.weightEntries[profileId][idx] = entry;
          } else {
            state.weightEntries[profileId].push(entry);
            state.weightEntries[profileId].sort((a, b) => a.date.localeCompare(b.date));
          }
        });
      },

      removeWeightEntry(profileId, date) {
        set((state) => {
          if (state.weightEntries[profileId]) {
            state.weightEntries[profileId] = state.weightEntries[profileId].filter((e) => e.date !== date);
          }
        });
      },

      getChecklist(profileId) {
        const doneMap = get().checklist[profileId] ?? {};
        return PRENATAL_CHECKLIST.map((item) => ({
          ...item,
          done: doneMap[item.id] ?? false,
        }));
      },

      getWeightEntries(profileId) {
        return get().weightEntries[profileId] ?? [];
      },

      seedWeightIfEmpty(profileId) {
        const existing = get().weightEntries[profileId];
        if (!existing || existing.length === 0) {
          set((state) => {
            state.weightEntries[profileId] = MOCK_WEIGHT_ENTRIES;
          });
        }
      },
    })),
    {
      name: 'pregnancy-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        checklist:     state.checklist,
        weightEntries: state.weightEntries,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn('[pregnancyStore] hydration error', error);
        usePregnancyStore.setState({ _hasHydrated: true });
      },
    }
  )
);
