import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  VACCINE_CALENDAR,
  MOCK_GROWTH_SOFIA,
  MOCK_GROWTH_LUCAS,
  MOCK_SYMPTOMS_SOFIA,
  MOCK_SYMPTOMS_LUCAS,
} from '@/shared/constants/healthData';
import type { GrowthRecord, SymptomLog } from '@/entities/health/model/types';

interface HealthState {
  growthRecords:  Record<string, GrowthRecord[]>;
  vaccineStatus:  Record<string, Record<string, boolean>>; // profileId → vaccineId → done
  symptomLogs:    Record<string, SymptomLog[]>;
  _hasHydrated:   boolean;
}

interface HealthActions {
  addGrowthRecord:   (profileId: string, record: GrowthRecord) => void;
  removeGrowthRecord:(profileId: string, recordId: string) => void;
  getGrowthRecords:  (profileId: string) => GrowthRecord[];
  toggleVaccine:     (profileId: string, vaccineId: string) => void;
  isVaccineDone:     (profileId: string, vaccineId: string) => boolean;
  getDoneCount:      (profileId: string) => number;
  addSymptomLog:     (profileId: string, log: SymptomLog) => void;
  resolveSymptomLog: (profileId: string, logId: string) => void;
  getSymptomLogs:    (profileId: string) => SymptomLog[];
  seedIfEmpty:       (profileId: string, mockProfile: 'sofia' | 'lucas') => void;
}

export const useHealthStore = create<HealthState & HealthActions>()(
  persist(
    immer((set, get) => ({
      growthRecords: {},
      vaccineStatus: {},
      symptomLogs:   {},
      _hasHydrated:  false,

      addGrowthRecord(profileId, record) {
        set((state) => {
          if (!state.growthRecords[profileId]) state.growthRecords[profileId] = [];
          state.growthRecords[profileId].push(record);
          state.growthRecords[profileId].sort((a, b) => a.ageMonths - b.ageMonths);
        });
      },

      removeGrowthRecord(profileId, recordId) {
        set((state) => {
          if (state.growthRecords[profileId]) {
            state.growthRecords[profileId] = state.growthRecords[profileId].filter(
              (r) => r.id !== recordId
            );
          }
        });
      },

      getGrowthRecords(profileId) {
        return get().growthRecords[profileId] ?? [];
      },

      toggleVaccine(profileId, vaccineId) {
        set((state) => {
          if (!state.vaccineStatus[profileId]) state.vaccineStatus[profileId] = {};
          const current = state.vaccineStatus[profileId][vaccineId] ?? false;
          state.vaccineStatus[profileId][vaccineId] = !current;
        });
      },

      isVaccineDone(profileId, vaccineId) {
        return get().vaccineStatus[profileId]?.[vaccineId] ?? false;
      },

      getDoneCount(profileId) {
        const map = get().vaccineStatus[profileId] ?? {};
        return Object.values(map).filter(Boolean).length;
      },

      addSymptomLog(profileId, log) {
        set((state) => {
          if (!state.symptomLogs[profileId]) state.symptomLogs[profileId] = [];
          state.symptomLogs[profileId].unshift(log);
        });
      },

      resolveSymptomLog(profileId, logId) {
        set((state) => {
          const logs = state.symptomLogs[profileId];
          if (logs) {
            const idx = logs.findIndex((l) => l.id === logId);
            if (idx >= 0) logs[idx].resolved = true;
          }
        });
      },

      getSymptomLogs(profileId) {
        return get().symptomLogs[profileId] ?? [];
      },

      seedIfEmpty(profileId, mockProfile) {
        const hasGrowth   = (get().growthRecords[profileId]?.length ?? 0) > 0;
        const hasSymptoms = (get().symptomLogs[profileId]?.length ?? 0) > 0;
        const hasVaccines = Object.keys(get().vaccineStatus[profileId] ?? {}).length > 0;

        set((state) => {
          if (!hasGrowth) {
            state.growthRecords[profileId] =
              mockProfile === 'sofia' ? MOCK_GROWTH_SOFIA : MOCK_GROWTH_LUCAS;
          }
          if (!hasSymptoms) {
            state.symptomLogs[profileId] =
              mockProfile === 'sofia' ? MOCK_SYMPTOMS_SOFIA : MOCK_SYMPTOMS_LUCAS;
          }
          if (!hasVaccines) {
            // Pre-mark vaccines that should be done based on age
            const ageThreshold = mockProfile === 'sofia' ? 38 : 58; // months
            const doneMap: Record<string, boolean> = {};
            VACCINE_CALENDAR.forEach((v) => {
              doneMap[v.id] = v.ageMonths < ageThreshold;
            });
            state.vaccineStatus[profileId] = doneMap;
          }
        });
      },
    })),
    {
      name: 'health-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => () => {
        useHealthStore.setState({ _hasHydrated: true });
      },
    }
  )
);
