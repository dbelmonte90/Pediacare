import type { Profile } from '@/entities/profile/model/types';

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'profile-ana',
    type: 'pregnancy',
    name: 'Ana',
    color: '#8B5CF6',
    createdAt: '2026-01-08T00:00:00.000Z',
    motherName: 'Ana',
    fur: '2026-01-08',
    fpp: '2026-10-15',
    bloodType: 'A+',
  },
  {
    id: 'profile-sofia',
    type: 'child',
    name: 'Sofía',
    color: '#F43F5E',
    createdAt: '2023-03-15T00:00:00.000Z',
    birthDate: '2023-03-15',
    sex: 'female',
    bloodType: 'A+',
  },
  {
    id: 'profile-lucas',
    type: 'child',
    name: 'Lucas',
    color: '#0EA5E9',
    createdAt: '2021-07-22T00:00:00.000Z',
    birthDate: '2021-07-22',
    sex: 'male',
    bloodType: 'O+',
  },
];
