const fs = require('fs');
let content = fs.readFileSync('src/services/recommendationEngine.ts', 'utf8');

const setupCodeOld = `  const { dietary, dislikedIngredients, favoriteCuisines, healthConditions } = getActiveConstraints(memberIds, household);`;

const setupCodeNew = `  const { dietary, dislikedIngredients, favoriteCuisines, healthConditions } = getActiveConstraints(memberIds, household);
  const activeMembers = household.filter(p => memberIds.includes(p.id));
  const maxCookingTime = activeMembers.length > 0 ? Math.max(...activeMembers.map(m => m.maxCookingTime || 60)) : 60;
  const skillLevel = activeMembers.some(m => m.skillLevel === 'Beginner') ? 'Beginner' : 
                     activeMembers.some(m => m.skillLevel === 'Intermediate') ? 'Intermediate' : 'Advanced';`;

// Revert previous global replace failures
content = content.replace(/profile\.maxCookingTime/g, 'maxCookingTime');
content = content.replace(/profile\.skillLevel/g, 'skillLevel');

content = content.replaceAll(setupCodeOld, setupCodeNew);

fs.writeFileSync('src/services/recommendationEngine.ts', content);
