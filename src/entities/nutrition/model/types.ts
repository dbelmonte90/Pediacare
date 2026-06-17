export type FoodStatus = 'not_started' | 'introduced' | 'tolerated' | 'reaction';

export type MealType = 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'otro';

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  recommendedAgeMonths: number;
  ageGroup: string;
  allergenRisk: boolean;
}

export interface FoodIntroduction {
  foodId: string;
  status: FoodStatus;
  dateIntroduced?: string;  // ISO date
  notes?: string;
}

export interface DiaryEntry {
  id: string;
  date: string;        // ISO date
  mealType: MealType;
  foods: string[];     // free-text food names
  notes?: string;
  hadReaction: boolean;
  reactionDescription?: string;
}
