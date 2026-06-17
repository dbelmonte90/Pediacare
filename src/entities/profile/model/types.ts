export type ProfileType = 'pregnancy' | 'child';

export interface BaseProfile {
  id: string;
  type: ProfileType;
  name: string;
  color: string;
  createdAt: string;
}

export interface PregnancyProfile extends BaseProfile {
  type: 'pregnancy';
  motherName: string;
  fur: string;      // ISO date — Fecha Última Regla
  fpp: string;      // ISO date — Fecha Probable Parto
  bloodType: string;
}

export interface ChildProfile extends BaseProfile {
  type: 'child';
  birthDate: string;  // ISO date
  sex: 'male' | 'female';
  bloodType?: string;
  allergies: string[];
}

export type Profile = PregnancyProfile | ChildProfile;
