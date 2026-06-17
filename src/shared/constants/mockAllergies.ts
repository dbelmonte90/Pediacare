export interface Allergy {
  id: string;
  profileId: string;
  substance: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export const MOCK_ALLERGIES: Allergy[] = [
  { id: 'a1', profileId: 'profile-sofia', substance: 'Huevo', severity: 'moderate' },
  { id: 'a2', profileId: 'profile-sofia', substance: 'Látex', severity: 'mild' },
];
