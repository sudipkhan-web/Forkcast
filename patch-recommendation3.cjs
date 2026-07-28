const fs = require('fs');
let content = fs.readFileSync('src/services/recommendationEngine.ts', 'utf8');

const insertActiveMembers1 = `  const activeMembers = household.filter(p => memberIds.includes(p.id));
  const maxCookingTime = activeMembers.length > 0 ? Math.max(...activeMembers.map(m => m.maxCookingTime || 60)) : 60;
  const skillLevel = activeMembers.some(m => m.skillLevel === 'Beginner') ? 'Beginner' : 
                     activeMembers.some(m => m.skillLevel === 'Intermediate') ? 'Intermediate' : 'Advanced';`;

const topMealsStart = `export const getTopMeals = (`;
const topMealsEnd = `): Meal[] => {`;
const explorationStart = `export const getExplorationMeals = (`;
const explorationEnd = `): Meal[] => {`;

content = content.replace(
  `  const { dietary, dislikedIngredients, favoriteCuisines } = getActiveConstraints(memberIds, household);`,
  `  const { dietary, dislikedIngredients, favoriteCuisines } = getActiveConstraints(memberIds, household);\n${insertActiveMembers1}`
);

content = content.replace(
  `  const { dietary } = getActiveConstraints(memberIds, household);`,
  `  const { dietary } = getActiveConstraints(memberIds, household);\n${insertActiveMembers1}`
);

fs.writeFileSync('src/services/recommendationEngine.ts', content);
