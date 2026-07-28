const fs = require('fs');
let content = fs.readFileSync('src/services/geminiServer.ts', 'utf8');

const signatureOld = `export async function serverGenerateRecipes(
  count: number,
  likedTags: string[],
  dislikedTags: string[],
  dietary: string[],
  dislikedIngredients: string[],
  favoriteCuisines: string[],
  goals: string[],
  seenMealNames: string[] = [],
  favoriteMealNamesStr: string = "",
  inventoryItems: string[] = [],
  healthConditions: string[] = [],
  specificMealType?: string,
  trainingDayType?: string
) {`;

const signatureNew = `export async function serverGenerateRecipes(
  count: number,
  likedTags: string[],
  dislikedTags: string[],
  dietary: string[],
  dislikedIngredients: string[],
  favoriteCuisines: string[],
  goals: string[],
  seenMealNames: string[] = [],
  favoriteMealNamesStr: string = "",
  inventoryItems: string[] = [],
  healthConditions: string[] = [],
  specificMealType?: string,
  trainingDayType?: string,
  weightKg?: number
) {`;

content = content.replace(signatureOld, signatureNew);

// Add the weightKg calculation
const trainingDayPromptOld = "      ${trainingDayType ? `\\n    The user is doing a **${trainingDayType}** training day. Provide meals suitable for this. Rest/Easy days need fewer carbs. Long/Race days need HIGH carbs.` : ''}";

const trainingDayPromptNew = "      ${trainingDayType ? (weightKg ? `\\n    The user is doing a **${trainingDayType}** training day, and weighs ${weightKg}kg. Focus strictly on achieving the recommended carbohydrate target of roughly ${trainingDayType === 'Rest' ? '2-3g' : trainingDayType === 'Easy' ? '3-5g' : trainingDayType === 'Speed/Interval' ? '4-6g' : trainingDayType === 'Long' ? '6-8g' : trainingDayType === 'Brick' ? '7-9g' : '8-10g'} of carbs per kg of bodyweight per day (total daily goal ~${Math.round(weightKg * (trainingDayType === 'Rest' ? 2 : trainingDayType === 'Easy' ? 3 : trainingDayType === 'Speed/Interval' ? 4 : trainingDayType === 'Long' ? 6 : trainingDayType === 'Brick' ? 7 : 8))}-${Math.round(weightKg * (trainingDayType === 'Rest' ? 3 : trainingDayType === 'Easy' ? 5 : trainingDayType === 'Speed/Interval' ? 6 : trainingDayType === 'Long' ? 8 : trainingDayType === 'Brick' ? 9 : 10))}g). Provide meals suitable to help reach this goal.` : `\\n    The user is doing a **${trainingDayType}** training day. Provide meals suitable for this. Rest/Easy days need fewer carbs. Long/Race days need HIGH carbs.`) : ''}";

content = content.replace(trainingDayPromptOld, trainingDayPromptNew);

fs.writeFileSync('src/services/geminiServer.ts', content);
