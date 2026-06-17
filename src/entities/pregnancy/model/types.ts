export type ChecklistCategory =
  | 'blood_tests'
  | 'ultrasounds'
  | 'vaccines'
  | 'supplements'
  | 'birth_plan'
  | 'hospital_bag';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  label: string;
  weekRange?: string;
}

export interface WeightEntry {
  date: string; // ISO date
  weight: number; // kg
}

export type SymptomUrgency = 'info' | 'warning' | 'urgent';

export interface Symptom {
  id: string;
  trimester: 1 | 2 | 3;
  label: string;
  advice: string;
  urgency: SymptomUrgency;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
