import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_PROFILES } from '@/shared/constants/mockProfiles';
import { useProfileStore } from '@/store/profileStore';
import { useHealthStore } from '@/store/healthStore';
import { useNutritionStore } from '@/store/nutritionStore';
import { usePregnancyStore } from '@/store/pregnancyStore';
import { useDevelopmentStore } from '@/store/developmentStore';

const STORE_KEYS = [
  'pediacare-profiles',
  'health-store',
  'nutrition-store',
  'pregnancy-store',
  'development-store',
];

/**
 * Wipes all persisted store data and resets in-memory state to demo defaults.
 * Intended for dev/QA use only.
 */
export async function resetAppData(): Promise<void> {
  await AsyncStorage.multiRemove(STORE_KEYS);

  useProfileStore.setState({
    profiles: [...MOCK_PROFILES],
    activeProfileId: MOCK_PROFILES[0]?.id ?? null,
  });

  useHealthStore.setState({ growthRecords: {}, vaccineStatus: {}, symptomLogs: {} });
  useNutritionStore.setState({ foodIntroductions: {}, diaryEntries: {} });
  usePregnancyStore.setState({ checklist: {}, weightEntries: {} });
  useDevelopmentStore.setState({ achievements: {} });
}
