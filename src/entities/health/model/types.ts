export interface GrowthRecord {
  id: string;
  date: string;       // ISO date
  ageMonths: number;
  weight: number;     // kg (1 decimal)
  height: number;     // cm (1 decimal)
  weightPercentile?: number;  // 0-100
  heightPercentile?: number;
}

export type VaccineStatus = 'done' | 'upcoming' | 'overdue' | 'scheduled';

export interface VaccineEntry {
  id: string;
  name: string;
  doseLabel: string;  // e.g. "1ª dosis"
  ageMonths: number;  // recommended age
  group: string;      // grouping label e.g. "2 meses"
}

export interface SymptomLog {
  id: string;
  date: string;         // ISO date
  symptoms: string[];   // symptom ids
  fever?: number;       // °C, if present
  notes?: string;
  resolved: boolean;
}

export interface DiagnosisResult {
  condition: string;
  description: string;
  urgency: 'routine' | 'soon' | 'urgent';
  advice: string;
}
