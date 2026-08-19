import { RecipeIngredient } from './data/recipes';

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  expiresAt?: string; // YYYY-MM-DD format
  location: 'fridge' | 'pantry';
  category: string;
  uid?: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  amount?: string;
  uid?: string;
  isStaple?: boolean;
};

export type PersonProfile = {
  id: string;
  name: string;
  dietary: string[];
  dislikedIngredients: string[];
  favoriteCuisines: string[];
  healthConditions?: string[];
  uid?: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  maxCookingTime?: number;
  raceType?: string;
  raceDate?: string;
  weeklyTrainingDays?: number;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  biologicalSex?: 'male' | 'female';
  trackedSupplements?: string[];
};

export type Group = {
  id: string;
  name: string;
  memberIds: string[];
  uid?: string;
};

export type PlannedMeal = {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  recipeId?: string;
  recipeName: string;
  ingredients?: RecipeIngredient[];
  groupId?: string;
  uid?: string;
  cookedAt?: string;
};

export type UserProfile = {
  email?: string;
  favoriteCuisines: string[];
  healthConditions?: string[];
  hasCompletedOnboarding?: boolean;
  selectedGroupId?: string;
  hasAcceptedTerms?: boolean;
  termsAcceptedAt?: string;
  notifications?: {
    enabled: boolean;
    mealPlanningTime?: string; // HH:mm format
    shoppingReminder?: boolean;
    expiringReminder?: boolean;
    emailNotifications?: boolean;
  };
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  userId: string;
  type?: 'system' | 'expiring' | 'shopping' | 'meal';
};

export type PantryLog = {
  id: string;
  itemName: string;
  action: 'add' | 'subtract' | 'consume' | 'expire';
  quantityChange: number;
  timestamp: string;
  reason?: string;
  uid: string;
};
