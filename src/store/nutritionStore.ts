import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MOCK_FOOD_SOFIA,
  MOCK_FOOD_LUCAS,
  MOCK_DIARY_SOFIA,
  MOCK_DIARY_LUCAS,
} from '@/shared/constants/nutritionData';
import type { FoodStatus, FoodIntroduction, DiaryEntry } from '@/entities/nutrition/model/types';

interface NutritionState {
  foodIntroductions: Record<string, Record<string, FoodIntroduction>>;
  diaryEntries:      Record<string, DiaryEntry[]>;
}

interface NutritionActions {
  setFoodStatus:        (profileId: string, foodId: string, status: FoodStatus, notes?: string) => void;
  getFoodIntroductions: (profileId: string) => Record<string, FoodIntroduction>;
  addDiaryEntry:        (profileId: string, entry: DiaryEntry) => void;
  removeDiaryEntry:     (profileId: string, entryId: string) => void;
  getDiaryEntries:      (profileId: string) => DiaryEntry[];
  seedIfEmpty:          (profileId: string, mock: 'sofia' | 'lucas') => void;
}

export const useNutritionStore = create<NutritionState & NutritionActions>()(
  persist(
    immer((set, get) => ({
      foodIntroductions: {},
      diaryEntries:      {},

      setFoodStatus(profileId, foodId, status, notes) {
        set((state) => {
          if (!state.foodIntroductions[profileId]) state.foodIntroductions[profileId] = {};
          const existing = state.foodIntroductions[profileId][foodId];
          state.foodIntroductions[profileId][foodId] = {
            foodId,
            status,
            dateIntroduced: existing?.dateIntroduced ?? new Date().toISOString().slice(0, 10),
            notes: notes ?? existing?.notes,
          };
        });
      },

      getFoodIntroductions(profileId) {
        return get().foodIntroductions[profileId] ?? {};
      },

      addDiaryEntry(profileId, entry) {
        set((state) => {
          if (!state.diaryEntries[profileId]) state.diaryEntries[profileId] = [];
          state.diaryEntries[profileId].unshift(entry);
        });
      },

      removeDiaryEntry(profileId, entryId) {
        set((state) => {
          if (state.diaryEntries[profileId]) {
            state.diaryEntries[profileId] = state.diaryEntries[profileId].filter(
              (e) => e.id !== entryId
            );
          }
        });
      },

      getDiaryEntries(profileId) {
        return get().diaryEntries[profileId] ?? [];
      },

      seedIfEmpty(profileId, mock) {
        const hasFoods = Object.keys(get().foodIntroductions[profileId] ?? {}).length > 0;
        const hasDiary = (get().diaryEntries[profileId]?.length ?? 0) > 0;
        set((state) => {
          if (!hasFoods) {
            state.foodIntroductions[profileId] =
              mock === 'sofia' ? { ...MOCK_FOOD_SOFIA } : { ...MOCK_FOOD_LUCAS };
          }
          if (!hasDiary) {
            state.diaryEntries[profileId] =
              mock === 'sofia' ? [...MOCK_DIARY_SOFIA] : [...MOCK_DIARY_LUCAS];
          }
        });
      },
    })),
    {
      name: 'nutrition-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
