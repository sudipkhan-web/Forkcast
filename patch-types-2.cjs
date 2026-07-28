const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

const personProfileOld = `export type PersonProfile = {
  id: string;
  name: string;
  dietary: string[];
  dislikedIngredients: string[];
  favoriteCuisines: string[];
  healthConditions?: string[];
  uid?: string;
};`;

const personProfileNew = `export type PersonProfile = {
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
};`;
content = content.replace(personProfileOld, personProfileNew);

const userProfileOld = `export type UserProfile = {
  email?: string;
  favoriteCuisines: string[];
  healthConditions?: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  maxCookingTime: number;
  hasCompletedOnboarding?: boolean;
  selectedGroupId?: string;
  notifications?: {
    enabled: boolean;
    mealPlanningTime?: string; // HH:mm format
    shoppingReminder?: boolean;
    expiringReminder?: boolean;
    emailNotifications?: boolean;
  };
  raceType?: string;
  raceDate?: string; // ISO date string
  weeklyTrainingDays?: number;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  biologicalSex?: 'male' | 'female';
};`;

const userProfileNew = `export type UserProfile = {
  email?: string;
  favoriteCuisines: string[];
  healthConditions?: string[];
  hasCompletedOnboarding?: boolean;
  selectedGroupId?: string;
  notifications?: {
    enabled: boolean;
    mealPlanningTime?: string; // HH:mm format
    shoppingReminder?: boolean;
    expiringReminder?: boolean;
    emailNotifications?: boolean;
  };
};`;
content = content.replace(userProfileOld, userProfileNew);

fs.writeFileSync('src/types.ts', content);
