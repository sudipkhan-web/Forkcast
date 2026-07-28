import { RecipeIngredient, Meal } from '../data/recipes';
import { InventoryItem, PersonProfile } from '../types';
import { getActiveConstraints, getExpiringIngredients, Substitution } from '../services/recommendationEngine';

export const getPrimaryPerson = (household: PersonProfile[]) => household[0];

/**
 * Generates an array of Date objects for the next `numDays` days.
 * @param {number} numDays - The number of days to generate.
 * @returns {Date[]} An array of Date objects starting from today.
 */
export const getNextDays = (numDays: number) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < numDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

/**
 * Adjusts ingredient amounts and names based on the group size and dietary constraints.
 * Scales quantities mathematically and applies text replacements for specific dietary needs.
 * @param {RecipeIngredient[]} ingredients - The original recipe ingredients.
 * @param {string[]} memberIds - The IDs of the members the meal is being planned for.
 * @param {PersonProfile[]} household - The household members.
 * @returns {RecipeIngredient[]} An array of adjusted ingredients.
 */
export const getAdjustedIngredients = (ingredients: RecipeIngredient[], memberIds: string[], household: PersonProfile[]) => {
  if (!ingredients) return [];
  const numPeople = memberIds.length || 1;
  const { dietary, dislikedIngredients } = getActiveConstraints(memberIds, household);

  return ingredients.map(ing => {
    let name = ing.name;
    let amount = ing.amount;

    // Adjust amount based on numPeople
    const match = amount.match(/^([\d.]+)\s*(.*)$/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2];
      if (!isNaN(num)) {
        amount = `${(num * numPeople).toFixed(1).replace(/\.0$/, '')} ${unit}`.trim();
      }
    } else {
      const fractionMatch = amount.match(/^(\d+)\/(\d+)\s*(.*)$/);
      if (fractionMatch) {
        const num = parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
        const unit = fractionMatch[3];
        amount = `${(num * numPeople).toFixed(1).replace(/\.0$/, '')} ${unit}`.trim();
      }
    }

    // Adjust name based on dietary preferences
    if (dietary.includes('Vegetarian') || dietary.includes('Vegan')) {
      if (name.toLowerCase().includes('chicken')) name = name.replace(/chicken/i, 'Tofu');
      if (name.toLowerCase().includes('beef')) name = name.replace(/beef/i, 'Tempeh');
      if (name.toLowerCase().includes('pork')) name = name.replace(/pork/i, 'Seitan');
      if (name.toLowerCase().includes('bacon')) name = name.replace(/bacon/i, 'Vegan Bacon');
    }
    if (dietary.includes('Vegan')) {
      if (name.toLowerCase().includes('cheese')) name = name.replace(/cheese/i, 'Vegan Cheese');
      if (name.toLowerCase().includes('butter')) name = name.replace(/butter/i, 'Vegan Butter');
      if (name.toLowerCase().includes('milk')) name = name.replace(/milk/i, 'Almond Milk');
      if (name.toLowerCase().includes('egg')) name = name.replace(/egg/i, 'Flax Egg');
    }
    if (dietary.includes('Gluten-Free')) {
      if (name.toLowerCase().includes('pasta')) name = name.replace(/pasta/i, 'Gluten-Free Pasta');
      if (name.toLowerCase().includes('bread')) name = name.replace(/bread/i, 'Gluten-Free Bread');
      if (name.toLowerCase().includes('flour')) name = name.replace(/flour/i, 'Almond Flour');
      if (name.toLowerCase().includes('soy sauce')) name = name.replace(/soy sauce/i, 'Tamari');
    }

    const isDisliked = dislikedIngredients.some(d => name.toLowerCase().includes(d.toLowerCase()));
    if (isDisliked) {
      name = `${name} (Substitute)`;
    }

    return { name, amount, originalName: ing.name };
  });
};

/**
 * Calculates a confidence score (0-99) indicating how well a meal fits the current context.
 * Factors include available ingredients, expiring items, dietary preferences, and liked tags.
 * @param {Meal} meal - The meal to evaluate.
 * @param {number} availableCount - The number of ingredients the user already has.
 * @param {number} totalCount - The total number of ingredients required.
 * @param {Substitution[]} substitutions - An array of applied substitutions.
 * @param {InventoryItem[]} inventory - The user's inventory.
 * @param {string[]} activeMemberIds - The IDs of the active members.
 * @param {PersonProfile[]} household - The household members.
 * @param {Record<string, number>} likedTags - The user's liked tags.
 * @returns {number} The calculated confidence score.
 */
export const calculateConfidence = (
  meal: Meal, 
  availableCount: number, 
  totalCount: number, 
  substitutions: Substitution[] = [],
  inventory: InventoryItem[],
  activeMemberIds: string[],
  household: PersonProfile[],
  likedTags: Record<string, number>
) => {
  let confidence = 50; // Base confidence
  
  // Ingredients factor (up to 30%)
  if (totalCount > 0) {
    confidence += Math.round(((availableCount + substitutions.length) / totalCount) * 30);
  }
  
  // Expiring ingredients factor (up to 10%)
  const expiringIngredients = getExpiringIngredients(inventory);
  const usesExpiring = expiringIngredients.some(item => 
    meal.ingredients?.some(i => i.name.toLowerCase() === item.name.toLowerCase()) ||
    substitutions.some(sub => sub.substitute.toLowerCase() === item.name.toLowerCase())
  );
  if (usesExpiring) confidence += 10;
  
  // Preferences factor (up to 10%)
  const { dietary, dislikedIngredients, favoriteCuisines } = getActiveConstraints(activeMemberIds, household);
  if (favoriteCuisines.includes(meal.cuisine)) confidence += 5;
  
  // Liked tags factor
  let tagScore = 0;
  meal.tags?.forEach(tag => {
    if (likedTags[tag]) tagScore += 1;
  });
  confidence += Math.min(5, tagScore);
  
  // Penalize for violating restrictions
  if (dietary.includes('Vegetarian') && !meal.tags?.includes('vegetarian')) confidence -= 50;
  if (dietary.includes('Vegan') && !meal.tags?.includes('vegan')) confidence -= 50;
  if (dietary.includes('Gluten-Free') && !meal.tags?.includes('gluten-free')) confidence -= 50;
  if (dietary.includes('Keto') && !meal.tags?.includes('keto')) confidence -= 50;
  
  const hasDisliked = meal.ingredients?.some(ing => 
    dislikedIngredients.some(disliked => ing.name.toLowerCase().includes(disliked.toLowerCase()))
  );
  if (hasDisliked) confidence -= 50;
  
  return Math.max(0, Math.min(99, confidence)); // Cap between 0 and 99%
};
