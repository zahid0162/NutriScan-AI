
export interface Nutrient {
  name: string;
  amount: string;
}

export interface FoodNutrition {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  servingSize: string;
  additionalNutrients: Nutrient[];
  timestamp: number;
  image?: string;
}

export interface DailyGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
