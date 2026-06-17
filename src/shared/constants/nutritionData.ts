import type { FoodItem, FoodIntroduction, DiaryEntry } from '@/entities/nutrition/model/types';

// ─── Food introduction checklist (AEP 2023 recommendations) ──────────────────────

export const FOOD_CHECKLIST: FoodItem[] = [
  // 4-6 months
  { id: 'fruit-puree',    name: 'Puré de fruta (manzana/pera)', emoji: '🍎', category: 'Frutas',    recommendedAgeMonths: 4,  ageGroup: '4-6 meses',   allergenRisk: false },
  { id: 'veg-puree',      name: 'Puré de verduras',              emoji: '🥕', category: 'Verduras',  recommendedAgeMonths: 4,  ageGroup: '4-6 meses',   allergenRisk: false },
  { id: 'cereal-nogl',    name: 'Cereal sin gluten (arroz)',     emoji: '🌾', category: 'Cereales',  recommendedAgeMonths: 4,  ageGroup: '4-6 meses',   allergenRisk: false },
  // 6-8 months
  { id: 'potato',         name: 'Patata',                        emoji: '🥔', category: 'Verduras',  recommendedAgeMonths: 6,  ageGroup: '6-8 meses',   allergenRisk: false },
  { id: 'zucchini',       name: 'Calabacín',                     emoji: '🥒', category: 'Verduras',  recommendedAgeMonths: 6,  ageGroup: '6-8 meses',   allergenRisk: false },
  { id: 'carrot',         name: 'Zanahoria',                     emoji: '🥕', category: 'Verduras',  recommendedAgeMonths: 6,  ageGroup: '6-8 meses',   allergenRisk: false },
  { id: 'broccoli',       name: 'Brócoli',                       emoji: '🥦', category: 'Verduras',  recommendedAgeMonths: 6,  ageGroup: '6-8 meses',   allergenRisk: false },
  { id: 'chicken',        name: 'Pollo triturado',               emoji: '🍗', category: 'Proteínas', recommendedAgeMonths: 6,  ageGroup: '6-8 meses',   allergenRisk: false },
  { id: 'beef',           name: 'Ternera',                       emoji: '🥩', category: 'Proteínas', recommendedAgeMonths: 6,  ageGroup: '6-8 meses',   allergenRisk: false },
  { id: 'cereal-gl',      name: 'Cereal con gluten',             emoji: '🌾', category: 'Cereales',  recommendedAgeMonths: 6,  ageGroup: '6-8 meses',   allergenRisk: true  },
  { id: 'spinach',        name: 'Espinacas',                     emoji: '🌿', category: 'Verduras',  recommendedAgeMonths: 8,  ageGroup: '6-8 meses',   allergenRisk: false },
  // 8-10 months
  { id: 'white-fish',     name: 'Pescado blanco',                emoji: '🐟', category: 'Proteínas', recommendedAgeMonths: 8,  ageGroup: '8-10 meses',  allergenRisk: true  },
  { id: 'egg-yolk',       name: 'Yema de huevo',                 emoji: '🥚', category: 'Proteínas', recommendedAgeMonths: 8,  ageGroup: '8-10 meses',  allergenRisk: true  },
  { id: 'lentils',        name: 'Lentejas',                      emoji: '🪸', category: 'Legumbres', recommendedAgeMonths: 8,  ageGroup: '8-10 meses',  allergenRisk: true  },
  { id: 'rice',           name: 'Arroz en grano',                emoji: '🍚', category: 'Cereales',  recommendedAgeMonths: 8,  ageGroup: '8-10 meses',  allergenRisk: false },
  { id: 'pasta',          name: 'Pasta',                         emoji: '🍝', category: 'Cereales',  recommendedAgeMonths: 8,  ageGroup: '8-10 meses',  allergenRisk: true  },
  { id: 'white-bread',    name: 'Pan blanco',                    emoji: '🍞', category: 'Cereales',  recommendedAgeMonths: 8,  ageGroup: '8-10 meses',  allergenRisk: true  },
  // 10-12 months
  { id: 'egg-whole',      name: 'Huevo entero',                  emoji: '🍳', category: 'Proteínas', recommendedAgeMonths: 10, ageGroup: '10-12 meses', allergenRisk: true  },
  { id: 'yogurt',         name: 'Yogur natural',                 emoji: '🥛', category: 'Lácteos',   recommendedAgeMonths: 10, ageGroup: '10-12 meses', allergenRisk: true  },
  { id: 'fresh-cheese',   name: 'Queso fresco',                  emoji: '🧀', category: 'Lácteos',   recommendedAgeMonths: 10, ageGroup: '10-12 meses', allergenRisk: true  },
  { id: 'tomato',         name: 'Tomate',                        emoji: '🍅', category: 'Verduras',  recommendedAgeMonths: 10, ageGroup: '10-12 meses', allergenRisk: false },
  { id: 'sardine',        name: 'Sardinas',                      emoji: '🐠', category: 'Proteínas', recommendedAgeMonths: 10, ageGroup: '10-12 meses', allergenRisk: true  },
  // 12+ months
  { id: 'cow-milk',       name: 'Leche de vaca',                 emoji: '🥛', category: 'Lácteos',   recommendedAgeMonths: 12, ageGroup: '12+ meses',   allergenRisk: true  },
  { id: 'strawberry',     name: 'Fresas',                        emoji: '🍓', category: 'Frutas',    recommendedAgeMonths: 12, ageGroup: '12+ meses',   allergenRisk: true  },
  { id: 'kiwi',           name: 'Kiwi',                          emoji: '🥝', category: 'Frutas',    recommendedAgeMonths: 12, ageGroup: '12+ meses',   allergenRisk: false },
  { id: 'legumes-all',    name: 'Legumbres variadas',            emoji: '🪸', category: 'Legumbres', recommendedAgeMonths: 12, ageGroup: '12+ meses',   allergenRisk: false },
  { id: 'nuts-ground',    name: 'Frutos secos (triturados)',     emoji: '🥜', category: 'Proteínas', recommendedAgeMonths: 12, ageGroup: '12+ meses',   allergenRisk: true  },
  { id: 'shellfish',      name: 'Mariscos',                      emoji: '🦐', category: 'Proteínas', recommendedAgeMonths: 24, ageGroup: '12+ meses',   allergenRisk: true  },
];

export const MEAL_TYPE_LABELS: Record<string, string> = {
  desayuno: '🌅 Desayuno',
  almuerzo: '☀️ Almuerzo',
  merienda: '🍌 Merienda',
  cena:     '🌙 Cena',
  otro:     '🍽️ Otro',
};

// ─── Mock data — Sofía (36 months) ───────────────────────────────────────────────

const SOFIA_TOLERATED: string[] = [
  'fruit-puree', 'veg-puree', 'cereal-nogl', 'potato', 'zucchini', 'carrot',
  'broccoli', 'chicken', 'beef', 'cereal-gl', 'spinach', 'white-fish',
  'lentils', 'rice', 'pasta', 'white-bread', 'yogurt', 'fresh-cheese',
  'tomato', 'cow-milk', 'kiwi', 'legumes-all',
];

export const MOCK_FOOD_SOFIA: Record<string, FoodIntroduction> = {
  ...Object.fromEntries(SOFIA_TOLERATED.map((id) => [
    id,
    { foodId: id, status: 'tolerated' as const, dateIntroduced: '2024-01-01' },
  ])),
  'egg-yolk':  { foodId: 'egg-yolk',  status: 'reaction',  dateIntroduced: '2024-03-10', notes: 'Reacción cutánea tras primera toma.' },
  'egg-whole': { foodId: 'egg-whole', status: 'reaction',  dateIntroduced: '2024-03-15', notes: 'Confirmada alergia al huevo.' },
  'sardine':   { foodId: 'sardine',   status: 'introduced', dateIntroduced: '2025-01-20' },
  'strawberry':{ foodId: 'strawberry',status: 'tolerated',  dateIntroduced: '2025-04-01' },
};

export const MOCK_DIARY_SOFIA: DiaryEntry[] = [
  {
    id: 'ds-1', date: '2026-06-16', mealType: 'almuerzo',
    foods: ['Puré de zanahoria y patata', 'Pollo triturado', 'Fruta de postre'],
    notes: 'Comió muy bien hoy.', hadReaction: false,
  },
  {
    id: 'ds-2', date: '2026-06-15', mealType: 'cena',
    foods: ['Crema de brócoli', 'Pan con queso fresco'],
    notes: '', hadReaction: false,
  },
  {
    id: 'ds-3', date: '2026-06-12', mealType: 'almuerzo',
    foods: ['Tortilla de patata (con huevo)'],
    notes: 'Reacción: urticaria leve en mejillas a los 20 min.',
    hadReaction: true,
    reactionDescription: 'Urticaria leve en cara. Administrado antihistamínico oral.',
  },
  {
    id: 'ds-4', date: '2026-06-10', mealType: 'desayuno',
    foods: ['Yogur natural', 'Fresas troceadas', 'Cereales sin gluten'],
    notes: '', hadReaction: false,
  },
  {
    id: 'ds-5', date: '2026-06-08', mealType: 'merienda',
    foods: ['Galletas de arroz', 'Kiwi'],
    notes: 'Primera vez con kiwi. Sin incidencias.', hadReaction: false,
  },
];

// ─── Mock data — Lucas (58 months) ───────────────────────────────────────────────

export const MOCK_FOOD_LUCAS: Record<string, FoodIntroduction> = Object.fromEntries(
  FOOD_CHECKLIST.filter((f) => f.recommendedAgeMonths <= 24).map((f) => [
    f.id,
    { foodId: f.id, status: 'tolerated' as const, dateIntroduced: '2022-06-01' },
  ])
);

export const MOCK_DIARY_LUCAS: DiaryEntry[] = [
  {
    id: 'dl-1', date: '2026-06-16', mealType: 'almuerzo',
    foods: ['Lentejas con arroz', 'Pan integral', 'Naranja de postre'],
    notes: '', hadReaction: false,
  },
  {
    id: 'dl-2', date: '2026-06-14', mealType: 'cena',
    foods: ['Filete de merluza', 'Patatas al horno', 'Yogur'],
    notes: '', hadReaction: false,
  },
  {
    id: 'dl-3', date: '2026-06-11', mealType: 'almuerzo',
    foods: ['Macarrones con tomate', 'Pollo a la plancha'],
    notes: '', hadReaction: false,
  },
];
