import type { VaccineEntry, GrowthRecord, SymptomLog } from '@/entities/health/model/types';

// ─── Spanish Childhood Vaccination Calendar (2024) ───────────────────────────

export const VACCINE_CALENDAR: VaccineEntry[] = [
  // 0 months
  { id: 'hb-1',     name: 'Hepatitis B',           doseLabel: '1ª dosis',  ageMonths: 0,   group: 'Nacimiento' },
  // 2 months
  { id: 'hex-1',    name: 'Hexavalente (DTPa-VPI-Hib-HB)', doseLabel: '1ª dosis', ageMonths: 2, group: '2 meses' },
  { id: 'pnc-1',    name: 'Neumococo conjugada',   doseLabel: '1ª dosis',  ageMonths: 2,   group: '2 meses' },
  { id: 'menb-1',   name: 'Meningococo B',          doseLabel: '1ª dosis',  ageMonths: 2,   group: '2 meses' },
  { id: 'rv-1',     name: 'Rotavirus',              doseLabel: '1ª dosis',  ageMonths: 2,   group: '2 meses' },
  // 4 months
  { id: 'hex-2',    name: 'Hexavalente',            doseLabel: '2ª dosis',  ageMonths: 4,   group: '4 meses' },
  { id: 'pnc-2',    name: 'Neumococo conjugada',    doseLabel: '2ª dosis',  ageMonths: 4,   group: '4 meses' },
  { id: 'menb-2',   name: 'Meningococo B',          doseLabel: '2ª dosis',  ageMonths: 4,   group: '4 meses' },
  { id: 'rv-2',     name: 'Rotavirus',              doseLabel: '2ª dosis',  ageMonths: 4,   group: '4 meses' },
  // 6 months
  { id: 'hex-3',    name: 'Hexavalente',            doseLabel: '3ª dosis',  ageMonths: 6,   group: '6 meses' },
  // 11 months
  { id: 'menc-1',   name: 'Meningococo C',          doseLabel: '1ª dosis',  ageMonths: 11,  group: '11-12 meses' },
  { id: 'pnc-3',    name: 'Neumococo conjugada',    doseLabel: '3ª dosis',  ageMonths: 11,  group: '11-12 meses' },
  { id: 'menb-3',   name: 'Meningococo B',          doseLabel: '3ª dosis',  ageMonths: 11,  group: '11-12 meses' },
  // 12 months
  { id: 'tv-1',     name: 'Triple vírica (SRP)',    doseLabel: '1ª dosis',  ageMonths: 12,  group: '12 meses' },
  { id: 'var-1',    name: 'Varicela',               doseLabel: '1ª dosis',  ageMonths: 12,  group: '12 meses' },
  { id: 'hepa-1',   name: 'Hepatitis A',            doseLabel: '1ª dosis',  ageMonths: 12,  group: '12 meses' },
  // 15-18 months
  { id: 'dtpa-ref', name: 'DTPa (refuerzo)',         doseLabel: 'Refuerzo',  ageMonths: 18,  group: '15-18 meses' },
  { id: 'hepa-2',   name: 'Hepatitis A',            doseLabel: '2ª dosis',  ageMonths: 18,  group: '15-18 meses' },
  // 3 años
  { id: 'var-2',    name: 'Varicela',               doseLabel: '2ª dosis',  ageMonths: 36,  group: '3 años' },
  // 4 años
  { id: 'tv-2',     name: 'Triple vírica (SRP)',    doseLabel: '2ª dosis',  ageMonths: 48,  group: '4 años' },
  { id: 'dtpa-vpi', name: 'DTPa-VPI (refuerzo)',    doseLabel: 'Refuerzo',  ageMonths: 48,  group: '4 años' },
  // 6 años
  { id: 'dtpa-6',   name: 'DTPa (refuerzo)',        doseLabel: 'Refuerzo',  ageMonths: 72,  group: '6 años' },
  // 12 años
  { id: 'vph',      name: 'VPH (Virus Papiloma)',   doseLabel: '1ª-2ª dosis', ageMonths: 144, group: '12 años' },
  { id: 'menacwy',  name: 'Meningococo ACWY',       doseLabel: '1ª dosis',  ageMonths: 144, group: '12 años' },
  // 14 años
  { id: 'dtpa-14',  name: 'dTpa',                  doseLabel: 'Refuerzo',  ageMonths: 168, group: '14 años' },
];

// ─── Common pediatric symptoms ────────────────────────────────────────────────

export interface SymptomOption {
  id: string;
  label: string;
  emoji: string;
}

export const SYMPTOM_OPTIONS: SymptomOption[] = [
  { id: 'fever',           label: 'Fiebre',                 emoji: '🌡️' },
  { id: 'cough',           label: 'Tos',                    emoji: '😮‍💨' },
  { id: 'runny_nose',      label: 'Mocos / Congestión',     emoji: '🤧' },
  { id: 'sore_throat',     label: 'Dolor de garganta',      emoji: '🫁' },
  { id: 'vomiting',        label: 'Vómitos',                emoji: '🤢' },
  { id: 'diarrhea',        label: 'Diarrea',                emoji: '💧' },
  { id: 'abdominal_pain',  label: 'Dolor abdominal',        emoji: '🫃' },
  { id: 'rash',            label: 'Sarpullido / Manchas',   emoji: '🔴' },
  { id: 'ear_pain',        label: 'Dolor de oído',          emoji: '👂' },
  { id: 'crying',          label: 'Llanto inconsolable',    emoji: '😭' },
  { id: 'loss_appetite',   label: 'Falta de apetito',       emoji: '🍽️' },
  { id: 'breathing_diff',  label: 'Dificultad respiratoria',emoji: '😮‍💨' },
  { id: 'eye_discharge',   label: 'Legañas / Ojo rojo',     emoji: '👁️' },
  { id: 'fatigue',         label: 'Cansancio / Decaimiento',emoji: '😴' },
];

// ─── Pre-diagnosis rules (non-binding, orientative) ──────────────────────────

export interface DiagnosisRule {
  matchSymptoms: string[];
  minMatch: number;
  condition: string;
  description: string;
  urgency: 'routine' | 'soon' | 'urgent';
  advice: string;
}

export const DIAGNOSIS_RULES: DiagnosisRule[] = [
  {
    matchSymptoms: ['fever', 'cough', 'runny_nose'],
    minMatch: 2,
    condition: 'Resfriado común o gripe',
    description: 'La combinación de fiebre, tos y mocos es muy característica de infecciones respiratorias virales.',
    urgency: 'routine',
    advice: 'Reposo, hidratación y temperatura controlada. Consulta a tu pediatra si la fiebre supera 39°C o dura más de 3 días.',
  },
  {
    matchSymptoms: ['fever', 'sore_throat'],
    minMatch: 2,
    condition: 'Posible faringitis o amigdalitis',
    description: 'Fiebre con dolor de garganta puede indicar infección por virus o bacterias (estreptococo).',
    urgency: 'soon',
    advice: 'Consulta al pediatra en las próximas 24-48h para descartar infección bacteriana que requiera antibiótico.',
  },
  {
    matchSymptoms: ['vomiting', 'diarrhea'],
    minMatch: 1,
    condition: 'Posible gastroenteritis viral',
    description: 'Vómitos y/o diarrea son los síntomas principales de la gastroenteritis. Muy frecuente en niños.',
    urgency: 'routine',
    advice: 'Mantén buena hidratación con suero oral. Si los vómitos son muy frecuentes o hay signos de deshidratación, consulta al pediatra.',
  },
  {
    matchSymptoms: ['abdominal_pain', 'vomiting', 'loss_appetite'],
    minMatch: 2,
    condition: 'Posible gastroenteritis o trastorno digestivo',
    description: 'Dolor abdominal acompañado de vómitos o falta de apetito suele indicar una causa digestiva.',
    urgency: 'routine',
    advice: 'Si el dolor es intenso, continuo o en fosa ilíaca derecha, consulta urgente para descartar apendicitis.',
  },
  {
    matchSymptoms: ['rash', 'fever'],
    minMatch: 2,
    condition: 'Posible exantema vírico',
    description: 'La fiebre con sarpullido puede corresponder a diversas infecciones víricas como roséola, escarlatina o varicela.',
    urgency: 'soon',
    advice: 'Consulta al pediatra para identificar el tipo de exantema y descartar causas bacterianas.',
  },
  {
    matchSymptoms: ['rash'],
    minMatch: 1,
    condition: 'Posible reacción alérgica o exantema',
    description: 'Un sarpullido sin fiebre puede deberse a alergia, picadura de insecto o infección vírica leve.',
    urgency: 'routine',
    advice: 'Observa si se extiende o aparece dificultad respiratoria. En ese caso, acude a urgencias.',
  },
  {
    matchSymptoms: ['ear_pain', 'fever', 'crying'],
    minMatch: 2,
    condition: 'Posible otitis media aguda',
    description: 'El dolor de oído con fiebre e irritabilidad es muy sugestivo de otitis, especialmente en niños pequeños.',
    urgency: 'soon',
    advice: 'Consulta al pediatra en las próximas 24h. La otitis bacteriana puede requerir tratamiento antibiótico.',
  },
  {
    matchSymptoms: ['breathing_diff'],
    minMatch: 1,
    condition: '⚠️ Consulta urgente — posible bronquiolitis, asma o laringitis',
    description: 'La dificultad para respirar en niños siempre requiere evaluación médica inmediata.',
    urgency: 'urgent',
    advice: 'Acude a urgencias de inmediato. No esperes. La dificultad respiratoria en niños puede agravarse rápidamente.',
  },
  {
    matchSymptoms: ['eye_discharge', 'eye_discharge'],
    minMatch: 1,
    condition: 'Posible conjuntivitis',
    description: 'Legañas abundantes o ojo rojo suelen indicar conjuntivitis viral o bacteriana.',
    urgency: 'routine',
    advice: 'Limpia los ojos con suero fisiológico. Consulta al pediatra si persiste más de 2-3 días o aparece dolor.',
  },
  {
    matchSymptoms: ['fever', 'crying', 'loss_appetite'],
    minMatch: 3,
    condition: 'Niño con malestar general febril',
    description: 'Fiebre con irritabilidad y falta de apetito puede indicar inicio de infección de cualquier tipo.',
    urgency: 'routine',
    advice: 'Controla la fiebre con antitérmico si supera 38.5°C. Si en 48h no mejora o empeora, consulta al pediatra.',
  },
];

// ─── WHO-like percentile reference (simplified mock) ─────────────────────────
// Weight-for-age (kg) by months: [P3, P15, P50, P85, P97]

export const WHO_WEIGHT_BOYS: Record<number, [number, number, number, number, number]> = {
  0: [2.5, 2.9, 3.3, 3.9, 4.3],
  2: [4.3, 4.9, 5.6, 6.3, 7.1],
  4: [5.6, 6.3, 7.0, 7.9, 8.7],
  6: [6.4, 7.1, 7.9, 8.9, 9.8],
  9: [7.2, 8.0, 9.0, 10.0, 11.0],
  12: [7.8, 8.7, 9.6, 10.8, 11.8],
  18: [8.8, 9.8, 10.9, 12.2, 13.3],
  24: [9.7, 10.8, 12.1, 13.6, 14.8],
  36: [11.2, 12.5, 14.0, 15.7, 17.1],
  48: [12.7, 14.2, 15.9, 17.9, 19.6],
  60: [14.1, 15.8, 17.7, 20.1, 22.1],
};

export const WHO_WEIGHT_GIRLS: Record<number, [number, number, number, number, number]> = {
  0: [2.4, 2.8, 3.2, 3.7, 4.2],
  2: [4.0, 4.6, 5.1, 5.8, 6.6],
  4: [5.1, 5.8, 6.4, 7.3, 8.2],
  6: [5.8, 6.5, 7.3, 8.2, 9.3],
  9: [6.6, 7.3, 8.2, 9.3, 10.6],
  12: [7.1, 8.0, 8.9, 10.1, 11.5],
  18: [8.1, 9.1, 10.2, 11.5, 13.2],
  24: [9.0, 10.1, 11.5, 13.0, 14.9],
  36: [10.4, 11.7, 13.3, 15.1, 17.3],
  48: [11.8, 13.3, 15.2, 17.4, 20.1],
  60: [13.2, 14.9, 17.2, 19.9, 23.1],
};

// Height-for-age (cm) by months: [P3, P15, P50, P85, P97]
export const WHO_HEIGHT_BOYS: Record<number, [number, number, number, number, number]> = {
  0: [46.3, 47.9, 49.9, 51.8, 53.4],
  2: [54.7, 56.4, 58.4, 60.4, 62.1],
  4: [60.0, 61.8, 63.9, 66.0, 67.8],
  6: [63.6, 65.5, 67.6, 69.8, 71.6],
  9: [68.0, 70.1, 72.3, 74.5, 76.5],
  12: [71.7, 73.9, 76.1, 78.4, 80.5],
  18: [77.8, 80.2, 82.7, 85.2, 87.5],
  24: [82.5, 85.1, 87.8, 90.5, 93.0],
  36: [89.4, 92.2, 95.3, 98.3, 101.0],
  48: [95.0, 98.2, 101.7, 105.2, 108.4],
  60: [100.0, 103.5, 107.4, 111.2, 114.6],
};

export const WHO_HEIGHT_GIRLS: Record<number, [number, number, number, number, number]> = {
  0: [45.6, 47.2, 49.1, 51.0, 52.5],
  2: [53.2, 55.0, 57.1, 59.1, 61.0],
  4: [58.4, 60.3, 62.1, 64.3, 66.2],
  6: [62.0, 63.9, 65.7, 67.8, 69.8],
  9: [66.3, 68.3, 70.1, 72.3, 74.3],
  12: [70.0, 72.0, 74.0, 76.1, 78.1],
  18: [76.0, 78.2, 80.7, 83.1, 85.4],
  24: [80.8, 83.2, 86.0, 88.7, 91.2],
  36: [87.6, 90.4, 93.5, 96.6, 99.3],
  48: [93.2, 96.3, 99.9, 103.4, 106.4],
  60: [98.4, 101.8, 105.9, 109.8, 113.2],
};

export function calcPercentile(
  value: number,
  ageMonths: number,
  sex: 'male' | 'female',
  metric: 'weight' | 'height'
): number {
  const table = metric === 'weight'
    ? (sex === 'male' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS)
    : (sex === 'male' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS);

  const ages = Object.keys(table).map(Number).sort((a, b) => a - b);
  const nearestAge = ages.reduce((prev, cur) =>
    Math.abs(cur - ageMonths) < Math.abs(prev - ageMonths) ? cur : prev
  );
  const [p3, p15, p50, p85, p97] = table[nearestAge];

  if (value <= p3) return 3;
  if (value <= p15) return Math.round(3 + ((value - p3) / (p15 - p3)) * 12);
  if (value <= p50) return Math.round(15 + ((value - p15) / (p50 - p15)) * 35);
  if (value <= p85) return Math.round(50 + ((value - p50) / (p85 - p50)) * 35);
  if (value <= p97) return Math.round(85 + ((value - p85) / (p97 - p85)) * 12);
  return 97;
}

// ─── Mock growth records ──────────────────────────────────────────────────────

export const MOCK_GROWTH_SOFIA: GrowthRecord[] = [
  { id: 'g-s-0',  date: '2023-03-15', ageMonths: 0,  weight: 3.2,  height: 49.5, weightPercentile: 50, heightPercentile: 50 },
  { id: 'g-s-3',  date: '2023-06-15', ageMonths: 3,  weight: 5.8,  height: 60.2, weightPercentile: 52, heightPercentile: 48 },
  { id: 'g-s-6',  date: '2023-09-15', ageMonths: 6,  weight: 7.4,  height: 66.8, weightPercentile: 58, heightPercentile: 55 },
  { id: 'g-s-12', date: '2024-03-15', ageMonths: 12, weight: 9.2,  height: 74.5, weightPercentile: 62, heightPercentile: 57 },
  { id: 'g-s-18', date: '2024-09-15', ageMonths: 18, weight: 10.9, height: 81.3, weightPercentile: 58, heightPercentile: 55 },
  { id: 'g-s-24', date: '2025-03-15', ageMonths: 24, weight: 12.4, height: 87.0, weightPercentile: 55, heightPercentile: 52 },
  { id: 'g-s-36', date: '2026-03-15', ageMonths: 36, weight: 14.1, height: 94.2, weightPercentile: 53, heightPercentile: 50 },
];

export const MOCK_GROWTH_LUCAS: GrowthRecord[] = [
  { id: 'g-l-0',  date: '2021-07-22', ageMonths: 0,  weight: 3.5,  height: 50.5, weightPercentile: 57, heightPercentile: 56 },
  { id: 'g-l-3',  date: '2021-10-22', ageMonths: 3,  weight: 6.2,  height: 62.0, weightPercentile: 53, heightPercentile: 52 },
  { id: 'g-l-6',  date: '2022-01-22', ageMonths: 6,  weight: 8.0,  height: 68.5, weightPercentile: 55, heightPercentile: 57 },
  { id: 'g-l-12', date: '2022-07-22', ageMonths: 12, weight: 10.1, height: 76.8, weightPercentile: 68, heightPercentile: 65 },
  { id: 'g-l-18', date: '2023-01-22', ageMonths: 18, weight: 12.3, height: 84.0, weightPercentile: 72, heightPercentile: 70 },
  { id: 'g-l-24', date: '2023-07-22', ageMonths: 24, weight: 14.0, height: 90.2, weightPercentile: 70, heightPercentile: 68 },
  { id: 'g-l-36', date: '2024-07-22', ageMonths: 36, weight: 16.2, height: 99.5, weightPercentile: 73, heightPercentile: 74 },
  { id: 'g-l-48', date: '2025-07-22', ageMonths: 48, weight: 18.4, height: 104.8, weightPercentile: 72, heightPercentile: 71 },
];

// ─── Mock symptom logs ────────────────────────────────────────────────────────

export const MOCK_SYMPTOMS_SOFIA: SymptomLog[] = [
  { id: 'sl-s-1', date: '2026-06-12', symptoms: ['fever', 'runny_nose', 'cough'], fever: 38.6, notes: 'Pediatra: resfriado común.', resolved: true },
  { id: 'sl-s-2', date: '2026-05-03', symptoms: ['cough', 'loss_appetite'], resolved: true },
  { id: 'sl-s-3', date: '2026-02-18', symptoms: ['fever', 'ear_pain', 'crying'], fever: 38.9, notes: 'Diagnosticada otitis. Antibiótico 7 días.', resolved: true },
];

export const MOCK_SYMPTOMS_LUCAS: SymptomLog[] = [
  { id: 'sl-l-1', date: '2026-05-20', symptoms: ['vomiting', 'diarrhea', 'loss_appetite'], notes: 'Gastroenteritis viral. Suero oral.', resolved: true },
  { id: 'sl-l-2', date: '2026-03-10', symptoms: ['fever', 'sore_throat'], fever: 39.1, notes: 'Faringitis estreptocócica. Amoxicilina.', resolved: true },
];
