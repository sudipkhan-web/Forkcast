import { Meal, ALL_MEALS } from '../data/recipes';
import { InventoryItem, PersonProfile, UserProfile } from '../types';

export interface Substitution {
  original: string;
  substitute: string;
  isPerishable?: boolean;
  expiresSoon?: boolean;
}

export const getSmartSubstitutions = (missingIngredients: string[], inventory: InventoryItem[], recipeIngredients: string[]): Substitution[] => {
  const substitutions: Substitution[] = [];
  const usedInventoryIds = new Set<string>();

  // Mark inventory items already used in the recipe so we don't suggest them as substitutes
  const recipeLower = recipeIngredients.map(i => i.toLowerCase());
  inventory.forEach(item => {
    if (recipeLower.some(r => r.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(r))) {
      usedInventoryIds.add(item.id);
    }
  });

  const substitutionMap: Record<string, string[]> = {
    'chicken': ['turkey', 'tofu', 'pork'],
    'beef': ['pork', 'lamb', 'mushrooms'],
    'rice': ['quinoa', 'cauliflower rice', 'couscous'],
    'pasta': ['zucchini noodles', 'rice noodles', 'spaghetti squash'],
    'milk': ['almond milk', 'oat milk', 'soy milk'],
    'butter': ['olive oil', 'coconut oil', 'margarine'],
    'sugar': ['honey', 'maple syrup', 'agave'],
    'eggs': ['flax egg', 'applesauce', 'mashed banana'],
    'flour': ['almond flour', 'oat flour', 'coconut flour'],
    'soy sauce': ['tamari', 'coconut aminos', 'liquid aminos'],
    'sour cream': ['greek yogurt', 'creme fraiche'],
    'heavy cream': ['coconut milk', 'half and half'],
    'breadcrumbs': ['crushed crackers', 'panko', 'rolled oats'],
    'lemon juice': ['lime juice', 'white wine vinegar', 'apple cider vinegar'],
    'garlic': ['garlic powder', 'shallots', 'onions'],
    'onion': ['shallots', 'leeks', 'onion powder'],
    'tomato paste': ['tomato sauce', 'ketchup (reduced)'],
    'broth': ['bouillon cube + water', 'water + soy sauce'],
    'wine': ['broth + vinegar', 'grape juice + vinegar'],
    'cheese': ['nutritional yeast', 'vegan cheese'],
    'parmesan': ['pecorino', 'nutritional yeast', 'asiago'],
    'cheddar': ['colby', 'monterey jack', 'gouda'],
    'mozzarella': ['provolone', 'swiss', 'gouda'],
    'spinach': ['kale', 'swiss chard', 'arugula'],
    'kale': ['spinach', 'collard greens', 'mustard greens'],
    'potato': ['sweet potato', 'cauliflower', 'turnips'],
    'sweet potato': ['butternut squash', 'pumpkin', 'carrots'],
    'carrot': ['parsnips', 'sweet potato', 'squash'],
    'bell pepper': ['poblano', 'jalapeno', 'zucchini'],
    'zucchini': ['yellow squash', 'eggplant', 'cucumber'],
    'mushroom': ['eggplant', 'tofu', 'tempeh'],
    'tofu': ['tempeh', 'seitan', 'beans'],
    'beans': ['lentils', 'chickpeas', 'peas'],
    'lentils': ['beans', 'split peas', 'quinoa'],
    'quinoa': ['rice', 'couscous', 'bulgur'],
    'couscous': ['quinoa', 'rice', 'bulgur'],
    'bulgur': ['quinoa', 'rice', 'couscous'],
    'oats': ['quinoa flakes', 'buckwheat', 'amaranth'],
    'honey': ['maple syrup', 'agave', 'sugar'],
    'maple syrup': ['honey', 'agave', 'sugar'],
    'agave': ['honey', 'maple syrup', 'sugar'],
    'peanut butter': ['almond butter', 'sunflower seed butter', 'cashew butter'],
    'almond butter': ['peanut butter', 'sunflower seed butter', 'cashew butter'],
    'walnuts': ['pecans', 'almonds', 'cashews'],
    'pecans': ['walnuts', 'almonds', 'cashews'],
    'almonds': ['walnuts', 'pecans', 'cashews'],
    'cashews': ['almonds', 'walnuts', 'pecans'],
    'olive oil': ['avocado oil', 'canola oil', 'vegetable oil'],
    'avocado oil': ['olive oil', 'canola oil', 'vegetable oil'],
    'canola oil': ['vegetable oil', 'olive oil', 'avocado oil'],
    'vegetable oil': ['canola oil', 'olive oil', 'avocado oil'],
    'balsamic vinegar': ['red wine vinegar', 'apple cider vinegar', 'white wine vinegar'],
    'red wine vinegar': ['balsamic vinegar', 'apple cider vinegar', 'white wine vinegar'],
    'apple cider vinegar': ['white wine vinegar', 'red wine vinegar', 'balsamic vinegar'],
    'white wine vinegar': ['apple cider vinegar', 'red wine vinegar', 'balsamic vinegar'],
    'mustard': ['horseradish', 'wasabi', 'mayonnaise'],
    'mayonnaise': ['greek yogurt', 'sour cream', 'avocado'],
    'ketchup': ['tomato paste + sugar + vinegar', 'bbq sauce', 'salsa'],
    'bbq sauce': ['ketchup + brown sugar + vinegar', 'teriyaki sauce', 'hoisin sauce'],
    'salsa': ['pico de gallo', 'hot sauce', 'diced tomatoes + onions + jalapenos'],
    'hot sauce': ['salsa', 'chili powder', 'cayenne pepper'],
    'chili powder': ['paprika + cumin + oregano', 'cayenne pepper', 'hot sauce'],
    'cayenne pepper': ['chili powder', 'hot sauce', 'red pepper flakes'],
    'paprika': ['smoked paprika', 'chili powder', 'cayenne pepper'],
    'cumin': ['coriander', 'chili powder', 'garam masala'],
    'coriander': ['cumin', 'caraway seeds', 'fennel seeds'],
    'oregano': ['marjoram', 'thyme', 'basil'],
    'thyme': ['oregano', 'marjoram', 'rosemary'],
    'rosemary': ['thyme', 'tarragon', 'savory'],
    'basil': ['oregano', 'thyme', 'mint'],
    'mint': ['basil', 'cilantro', 'parsley'],
    'cilantro': ['parsley', 'mint', 'basil'],
    'parsley': ['cilantro', 'chervil', 'tarragon'],
    'cinnamon': ['nutmeg', 'allspice', 'cloves'],
    'nutmeg': ['cinnamon', 'mace', 'allspice'],
    'allspice': ['cinnamon', 'nutmeg', 'cloves'],
    'cloves': ['allspice', 'cinnamon', 'nutmeg'],
    'ginger': ['allspice', 'cinnamon', 'mace'],
    'vanilla extract': ['almond extract', 'maple syrup', 'bourbon'],
    'baking powder': ['baking soda + cream of tartar', 'baking soda + yogurt'],
    'baking soda': ['baking powder (use 3x amount)', 'potassium bicarbonate'],
    'yeast': ['baking powder', 'baking soda + acid'],
    'cornstarch': ['arrowroot powder', 'tapioca flour', 'potato starch'],
    'arrowroot powder': ['cornstarch', 'tapioca flour', 'potato starch'],
    'tapioca flour': ['cornstarch', 'arrowroot powder', 'potato starch'],
    'potato starch': ['cornstarch', 'arrowroot powder', 'tapioca flour'],
    'cocoa powder': ['carob powder', 'melted chocolate'],
    'chocolate chips': ['chopped chocolate', 'carob chips', 'cacao nibs'],
    'graham crackers': ['digestive biscuits', 'vanilla wafers', 'shortbread cookies'],
    'marshmallows': ['marshmallow fluff', 'meringue'],
    'coconut milk': ['almond milk', 'soy milk', 'heavy cream'],
    'coconut oil': ['butter', 'olive oil', 'canola oil'],
    'sesame oil': ['peanut oil', 'walnut oil', 'canola oil'],
    'fish sauce': ['soy sauce', 'tamari', 'coconut aminos'],
    'oyster sauce': ['hoisin sauce', 'soy sauce + sugar', 'mushroom sauce'],
    'hoisin sauce': ['oyster sauce', 'plum sauce', 'bbq sauce'],
    'sriracha': ['chili garlic sauce', 'sambal oelek', 'hot sauce'],
    'tahini': ['peanut butter', 'almond butter', 'sunflower seed butter'],
    'pesto': ['chimichurri', 'salsa verde', 'tapenade'],
    'capers': ['green olives', 'kalamata olives', 'pickles'],
    'olives': ['capers', 'pickles', 'artichoke hearts'],
    'artichoke hearts': ['hearts of palm', 'asparagus', 'broccoli stems'],
    'asparagus': ['green beans', 'broccoli', 'zucchini'],
    'green beans': ['asparagus', 'peas', 'snow peas'],
    'peas': ['green beans', 'edamame', 'corn'],
    'corn': ['peas', 'carrots', 'bell peppers'],
    'broccoli': ['cauliflower', 'brussels sprouts', 'cabbage'],
    'cauliflower': ['broccoli', 'cabbage', 'turnips'],
    'cabbage': ['brussels sprouts', 'kale', 'spinach'],
    'brussels sprouts': ['cabbage', 'broccoli', 'kale'],
    'celery': ['fennel', 'bok choy', 'jicama'],
    'cucumber': ['zucchini', 'celery', 'jicama'],
    'radish': ['jicama', 'turnips', 'kohlrabi'],
    'turnip': ['rutabaga', 'parsnips', 'potatoes'],
    'parsnip': ['carrots', 'turnips', 'sweet potatoes'],
    'beet': ['carrots', 'sweet potatoes', 'turnips'],
    'apple': ['pear', 'peach', 'plum'],
    'pear': ['apple', 'peach', 'plum'],
    'peach': ['nectarine', 'apricot', 'plum'],
    'plum': ['peach', 'nectarine', 'apricot'],
    'cherry': ['cranberry', 'raspberry', 'strawberry'],
    'strawberry': ['raspberry', 'blackberry', 'blueberry'],
    'raspberry': ['strawberry', 'blackberry', 'blueberry'],
    'blueberry': ['blackberry', 'raspberry', 'strawberry'],
    'blackberry': ['blueberry', 'raspberry', 'strawberry'],
    'cranberry': ['cherry', 'pomegranate seeds', 'raisins'],
    'raisins': ['dried cranberries', 'currants', 'chopped dates'],
    'dates': ['figs', 'raisins', 'prunes'],
    'figs': ['dates', 'prunes', 'raisins'],
    'prunes': ['dates', 'figs', 'raisins'],
    'apricot': ['peach', 'nectarine', 'plum'],
    'pineapple': ['mango', 'papaya', 'peach'],
    'mango': ['pineapple', 'papaya', 'peach'],
    'papaya': ['mango', 'pineapple', 'peach'],
    'banana': ['applesauce', 'plantain', 'avocado'],
    'avocado': ['banana', 'greek yogurt', 'silken tofu'],
    'lemon': ['lime', 'orange', 'grapefruit'],
    'lime': ['lemon', 'orange', 'grapefruit'],
    'orange': ['tangerine', 'clementine', 'grapefruit'],
    'grapefruit': ['orange', 'pomelo', 'lemon'],
    'watermelon': ['cantaloupe', 'honeydew', 'pineapple'],
    'cantaloupe': ['honeydew', 'watermelon', 'papaya'],
    'honeydew': ['cantaloupe', 'watermelon', 'papaya'],
    'grape': ['cherry', 'blueberry', 'cranberry'],
    'pomegranate': ['cranberry', 'cherry', 'raspberry'],
    'kiwi': ['strawberry', 'pineapple', 'mango']
  };

  missingIngredients.forEach(missing => {
    const missingLower = missing.toLowerCase();
    
    // Find potential substitutes for this missing ingredient
    let potentialSubs: string[] = [];
    for (const [key, subs] of Object.entries(substitutionMap)) {
      if (missingLower.includes(key)) {
        potentialSubs = [...potentialSubs, ...subs];
      }
    }

    // Check if we have any of these substitutes in inventory
    for (const sub of potentialSubs) {
      const availableItem = inventory.find(item => 
        !usedInventoryIds.has(item.id) && 
        (item.name.toLowerCase().includes(sub) || sub.includes(item.name.toLowerCase()))
      );

      if (availableItem) {
        substitutions.push({
          original: missing,
          substitute: availableItem.name
        });
        usedInventoryIds.add(availableItem.id);
        break; // Only suggest one substitute per missing ingredient
      }
    }
  });

  return substitutions;
};

export const getActiveConstraints = (memberIds: string[], household: PersonProfile[]) => {
  const selectedMembers = household.filter(m => memberIds.includes(m.id));
  
  const dietary = Array.from(new Set(selectedMembers.flatMap(m => m.dietary || [])));
  const dislikedIngredients = Array.from(new Set(selectedMembers.flatMap(m => m.dislikedIngredients || [])));
  const favoriteCuisines = Array.from(new Set(selectedMembers.flatMap(m => m.favoriteCuisines || [])));
  const goals = Array.from(new Set(selectedMembers.flatMap(m => m.goals || [])));
  const healthConditions = Array.from(new Set(selectedMembers.flatMap(m => m.healthConditions || [])));

  return { dietary, dislikedIngredients, favoriteCuisines, goals, healthConditions };
};

export const generateDynamicReason = (meal: Meal, currentProfile: UserProfile, currentLikedTags: Record<string, number>, household: PersonProfile[], memberIds: string[], inventory: InventoryItem[]) => {
  const expiringIngredients = getExpiringIngredients(inventory);
  const expiringInMeal = expiringIngredients.filter(item => 
    meal.ingredients?.some(i => i.name.toLowerCase() === item.name.toLowerCase())
  );

  if (expiringInMeal.length > 0) {
    return `Uses ${expiringInMeal[0].name} which needs to be used soon!`;
  }

  const availableCount = meal.ingredients?.filter(i => hasIngredient(i.name, inventory)).length || 0;
  const missingCount = meal.ingredients?.filter(i => !hasIngredient(i.name, inventory)).length || 0;
  
  if (missingCount === 0 && availableCount > 0) {
    return "Uses ingredients you already have";
  } else if (missingCount <= 2 && missingCount > 0) {
    const numWord = missingCount === 1 ? 'one' : 'two';
    return `Only ${numWord} ingredient${missingCount > 1 ? 's' : ''} missing`;
  } else if (availableCount > 0) {
    return "Uses ingredients you already have";
  }

  const selectedMembers = household.filter(m => memberIds.includes(m.id));
  const favoriteCuisines = Array.from(new Set(selectedMembers.flatMap(m => m.favoriteCuisines || [])));
  if (favoriteCuisines.includes(meal.cuisine)) {
    return "Matches your group preferences";
  }

  const dietary = Array.from(new Set(selectedMembers.flatMap(m => m.dietary || [])));

  if (dietary.length > 0) {
    const matchedDiet = dietary.find(d => meal.tags?.includes(d.toLowerCase()));
    if (matchedDiet) {
      const membersWithDiet = selectedMembers.filter(m => m.dietary?.includes(matchedDiet)).map(m => m.name);
      if (membersWithDiet.length > 0) {
        if (membersWithDiet.length === 1) {
          return `Perfect for ${membersWithDiet[0]}'s ${matchedDiet} diet`;
        } else {
          return `Matches your group preferences`;
        }
      }
    }
  }

  const membersWhoLikeIt = selectedMembers.filter(m => (m.favoriteCuisines || []).includes(meal.cuisine)).map(m => m.name);
  if (membersWhoLikeIt.length > 0) {
    if (membersWhoLikeIt.length === 1) {
      return `${meal.cuisine} food, which ${membersWhoLikeIt[0]} loves`;
    } else if (membersWhoLikeIt.length === 2) {
      return `${meal.cuisine} food, which ${membersWhoLikeIt.join(' and ')} love`;
    } else {
      return `Matches your group preferences`;
    }
  }

  if (meal.timeMinutes <= 20) {
    return "Quick option for tonight";
  }

  if (meal.tags?.includes('healthy') || meal.tags?.includes('light') || meal.tags?.includes('low-carb')) {
    return "Healthy option";
  }

  let likedTagMatch = false;
  if (meal.tags) {
    for (const tag of meal.tags) {
      if (currentLikedTags[tag] && currentLikedTags[tag] > 0) {
        likedTagMatch = true;
        break;
      }
    }
  }
  if (likedTagMatch) {
    return "Similar to meals you liked before";
  }

  return meal.reason; // Fallback to default reason
};

export const generateGroupReason = (meal: Meal, groupName: string) => {
  const lowerGroup = groupName.toLowerCase();
  
  if (lowerGroup.includes('family') || lowerGroup.includes('kids')) {
    if (meal.tags?.includes('comfort') || meal.tags?.includes('fun') || meal.tags?.includes('pizza') || meal.tags?.includes('pasta')) {
      return "Kid-friendly option";
    }
    return "Works well for your family";
  }

  if (lowerGroup.includes('guest') || lowerGroup.includes('friend')) {
    if (meal.difficulty === 'Advanced' || meal.tags?.includes('fancy')) {
      return "Impressive meal for guests";
    }
    return "Good for guests";
  }
  
  if (lowerGroup.includes('me') || lowerGroup.includes('myself')) {
    if (meal.timeMinutes <= 20) {
      return "Quick and easy for one";
    }
    return "Perfect for just you";
  }

  return `Fits ${groupName} well`;
};

export const getExpiringIngredients = (inventory: InventoryItem[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);

  return inventory.filter(item => {
    if (!item.expiresAt || item.quantity <= 0) return false;
    const [year, month, day] = item.expiresAt.split('-').map(Number);
    const expDate = new Date(year, month - 1, day);
    return expDate <= threeDaysFromNow;
  });
};

export const hasIngredient = (ingredientName: string, inventory: InventoryItem[]) => {
  const searchLower = ingredientName.toLowerCase();
  return inventory.some(item => {
    const itemLower = item.name.toLowerCase();
    // Check for exact match or if one contains the other (e.g., "chicken breast" contains "chicken")
    return (itemLower.includes(searchLower) || searchLower.includes(itemLower)) && item.quantity > 0;
  });
};

/**
 * Generates virtual variations of base recipes to expand the searchable space.
 * This effectively multiplies the recipe universe without manual data entry.
 */
export const generateVirtualVariations = (baseMeals: Meal[]): Meal[] => {
  const variations: Meal[] = [];
  
  const dietSwaps: Record<string, Record<string, string>> = {
    'Vegan': { 'chicken': 'tofu', 'beef': 'mushrooms', 'pork': 'tempeh', 'milk': 'oat milk', 'butter': 'olive oil', 'eggs': 'flax egg', 'cheese': 'vegan cheese' },
    'Vegetarian': { 'chicken': 'halloumi', 'beef': 'eggplant', 'pork': 'beans' },
    'Gluten-Free': { 'pasta': 'rice noodles', 'bread': 'GF bread', 'flour': 'almond flour', 'soy sauce': 'tamari' },
    'Keto': { 'rice': 'cauliflower rice', 'pasta': 'zucchini noodles', 'potato': 'broccoli', 'bread': 'lettuce wraps', 'honey': 'stevia' }
  };

  const cuisineSwaps: Record<string, { tags: string[], flavors: string[] }> = {
    'Mexican': { tags: ['mexican', 'spicy'], flavors: ['cumin', 'lime', 'chili', 'cilantro'] },
    'Asian': { tags: ['asian', 'umami'], flavors: ['soy sauce', 'ginger', 'sesame', 'garlic'] },
    'Mediterranean': { tags: ['mediterranean', 'fresh'], flavors: ['olive oil', 'lemon', 'oregano', 'feta'] }
  };

  baseMeals.forEach(meal => {
    // 1. Dietary Variations
    Object.entries(dietSwaps).forEach(([diet, swaps]) => {
      // Only create if relevant (e.g., don't create a Vegan version of a Vegan dish)
      const currentTags = meal.tags?.map(t => t.toLowerCase()) || [];
      if (currentTags.includes(diet.toLowerCase())) return;

      const hasSwappable = meal.ingredients?.some(ing => 
        Object.keys(swaps).some(key => ing.name.toLowerCase().includes(key))
      );

      if (hasSwappable) {
        const newIngredients = meal.ingredients?.map(ing => {
          const swapKey = Object.keys(swaps).find(key => ing.name.toLowerCase().includes(key));
          if (swapKey) {
            return { ...ing, name: swaps[swapKey] };
          }
          return ing;
        });

        variations.push({
          ...meal,
          id: `${meal.id}-var-${diet.toLowerCase()}`,
          name: `${diet} ${meal.name}`,
          ingredients: newIngredients || meal.ingredients,
          tags: [...(meal.tags || []), diet.toLowerCase()],
          dynamicReason: `A ${diet.toLowerCase()} twist on ${meal.name}`,
          isVariation: true,
          baseId: meal.id
        });
      }
    });

    // 2. Time Variations (Express)
    if (meal.timeMinutes > 20) {
      variations.push({
        ...meal,
        id: `${meal.id}-var-express`,
        name: `Express ${meal.name}`,
        time: `${Math.round(meal.timeMinutes * 0.6)} mins`,
        timeMinutes: Math.round(meal.timeMinutes * 0.6),
        tags: [...(meal.tags || []), 'express', 'quick'],
        steps: meal.steps?.filter((_, i) => i < 4) || [], // Simplify steps
        dynamicReason: `Ready in under ${Math.round(meal.timeMinutes * 0.6)} minutes`,
        isVariation: true,
        baseId: meal.id
      });
    }

    // 3. Cuisine Swaps
    Object.entries(cuisineSwaps).forEach(([cuisine, config]) => {
      if (meal.cuisine?.toLowerCase() === cuisine.toLowerCase()) return;
      
      variations.push({
        ...meal,
        id: `${meal.id}-var-${cuisine.toLowerCase()}`,
        name: `${cuisine}-Inspired ${meal.name}`,
        cuisine,
        tags: [...(meal.tags || []), ...config.tags],
        dynamicReason: `Infused with ${config.flavors.join(', ')} for a ${cuisine} flavor`,
        isVariation: true,
        baseId: meal.id
      });
    });
  });

  return variations;
};

export const getTopMeals = (
  count: number,
  excludeIds: string[],
  memberIds: string[],
  globalRecipes: Meal[],
  household: PersonProfile[],
  dislikedTags: Record<string, number>,
  likedTags: Record<string, number>,
  profile: UserProfile,
  inventory: InventoryItem[],
  favorites: Meal[]
): Meal[] => {
  // Combine static meals with globally available meals
  const baseMeals = [...ALL_MEALS, ...globalRecipes];
  
  // Expand the recipe universe with virtual variations
  const variations = generateVirtualVariations(baseMeals);
  const allAvailableMeals = [...baseMeals, ...variations];
  
  let availableMeals = allAvailableMeals.filter(m => !excludeIds.includes(m.id));
  
  const { dietary, dislikedIngredients, favoriteCuisines, goals } = getActiveConstraints(memberIds, household);

  // Identity heavily disliked tags
  const heavilyDislikedTags = Object.keys(dislikedTags).map(t => t.toLowerCase());

  const allDislikedIngredients = household
    .filter(member => memberIds.includes(member.id))
    .flatMap(m => m.dislikedIngredients || [])
    .map(i => i.toLowerCase());

  // Apply Profile Hard Filters
  availableMeals = availableMeals.filter(m => {
    // Hard filter max cooking time
    if (m.timeMinutes > profile.maxCookingTime + 30) return false;
    // Hard filter skill level
    if (profile.skillLevel === 'Beginner' && m.difficulty === 'Advanced') return false;

    const mTags = m.tags?.map(t => t.toLowerCase()) || [];
    const mIngredients = m.ingredients?.map(i => i.name.toLowerCase()) || [];

    // 1. HARD Filter Dietary Defaults (e.g. no chicken/beef in vegetarian)
    if (dietary.includes('Vegetarian')) {
      if (!mTags.includes('vegetarian') && mIngredients.some(i => i.includes('chicken') || i.includes('beef') || i.includes('pork') || i.includes('fish') || i.includes('shrimp'))) return false;
    }
    if (dietary.includes('Vegan')) {
      if (!mTags.includes('vegan') && mIngredients.some(i => i.includes('chicken') || i.includes('beef') || i.includes('pork') || i.includes('fish') || i.includes('milk') || i.includes('cheese') || i.includes('egg') || i.includes('butter'))) return false;
    }

    // 2. HARD Filter Disliked Tags
    // If the meal has a tag, cuisine, or name that matches a disliked tag, filter it out completely
    if (heavilyDislikedTags.some(dt => 
      mTags.includes(dt) || 
      m.cuisine?.toLowerCase() === dt ||
      m.name.toLowerCase().includes(dt) ||
      mIngredients.some(i => i.includes(dt) || dt.includes(i))
    )) {
      return false;
    }

    // 3. HARD Filter Disliked Ingredients
    if (allDislikedIngredients.some(di => 
      mIngredients.some(ing => ing.includes(di) || di.includes(ing)) ||
      m.name.toLowerCase().includes(di)
    )) {
      return false;
    }

    return true;
  });

  const scoredMeals = availableMeals.map(m => {
    let score = 0;
    
    // Group satisfaction scoring
    const selectedMembers = household.filter(member => memberIds.includes(member.id));
    let membersSatisfied = 0;
    
    selectedMembers.forEach(member => {
      let memberSatisfied = true;
      let memberScore = 0;
      
      // Check dietary constraints for this member
      const memberDietary = member.dietary || [];
      if (memberDietary.includes('Vegetarian') && !m.tags?.includes('vegetarian')) memberSatisfied = false;
      if (memberDietary.includes('Vegan') && !m.tags?.includes('vegan')) memberSatisfied = false;
      if (memberDietary.includes('Gluten-Free') && !m.tags?.includes('gluten-free')) memberSatisfied = false;
      if (memberDietary.includes('Keto') && !m.tags?.includes('keto')) memberSatisfied = false;
      if (memberDietary.includes('Pescatarian') && !m.tags?.includes('pescatarian') && !m.tags?.includes('vegetarian') && !m.tags?.includes('vegan')) memberSatisfied = false;
      if (memberDietary.includes('Dairy-Free') && !m.tags?.includes('dairy-free') && !m.tags?.includes('vegan')) memberSatisfied = false;
      if (memberDietary.includes('Nut-Free') && !m.tags?.includes('nut-free')) memberSatisfied = false;
      if (memberDietary.includes('Halal') && !m.tags?.includes('halal') && !m.tags?.includes('vegetarian') && !m.tags?.includes('vegan')) memberSatisfied = false;
      if (memberDietary.includes('Kosher') && !m.tags?.includes('kosher') && !m.tags?.includes('vegetarian') && !m.tags?.includes('vegan')) memberSatisfied = false;
      
      // Check disliked ingredients for this member
      const memberDisliked = member.dislikedIngredients || [];
      const hasDisliked = m.ingredients?.some(ing => 
        memberDisliked.some(disliked => ing.name.toLowerCase().includes(disliked.toLowerCase()))
      );
      if (hasDisliked) memberSatisfied = false;
      
      if (memberSatisfied) {
        membersSatisfied++;
        memberScore += 50; // Bonus for satisfying a member completely
      } else {
        memberScore -= 100; // Heavy penalty for violating a member's constraints
      }
      
      // Preferences
      if ((member.favoriteCuisines || []).includes(m.cuisine)) memberScore += 10;
      
      // Goal scoring
      const memberGoals = member.goals || [];
      if (memberGoals.includes('Lose weight') && m.tags?.includes('low-calorie')) memberScore += 5;
      if (memberGoals.includes('Gain muscle') && m.tags?.includes('high-protein')) memberScore += 5;
      if (memberGoals.includes('Eat less processed food') && m.tags?.includes('whole-foods')) memberScore += 5;
      if (memberGoals.includes('Eat more vegetables') && m.tags?.includes('vegetable-heavy')) memberScore += 5;
      if (memberGoals.includes('High protein') && m.tags?.includes('high-protein')) memberScore += 5;
      if (memberGoals.includes('Low carb') && m.tags?.includes('low-carb')) memberScore += 5;
      if (memberGoals.includes('Heart healthy') && m.tags?.includes('heart-healthy')) memberScore += 5;
      
      score += memberScore;
    });
    
    // If it satisfies EVERYONE, give a massive bonus to prioritize it
    if (membersSatisfied === selectedMembers.length && selectedMembers.length > 0) {
      score += 200;
    }

    // Prioritize expiring ingredients and available ingredients
    const expiringIngredients = getExpiringIngredients(inventory);
    const missingIngredients = m.ingredients?.filter(i => !hasIngredient(i.name, inventory)).map(i => i.name) || [];
    const substitutions = getSmartSubstitutions(missingIngredients, inventory, m.ingredients?.map(i => i.name) || []);
    
    const usesExpiring = expiringIngredients.some(item => 
      m.ingredients?.some(i => i.name.toLowerCase() === item.name.toLowerCase()) ||
      substitutions.some(sub => sub.substitute.toLowerCase() === item.name.toLowerCase())
    );
    if (usesExpiring) score += 20; // High priority for expiring ingredients
    
    // Bonus for having ingredients or substitutions
    const availableCount = (m.ingredients?.length || 0) - missingIngredients.length;
    
    // Slight bonus for having ingredients, but we don't want to dominate the score. They can go shopping!
    score += (availableCount + substitutions.length) * 1;
    
    // Recipes should not be heavily penalized for missing ingredients. 
    // This app helps them plan shopping.
    const effectiveMissingCount = missingIngredients.length - substitutions.length;
    if (effectiveMissingCount <= 0) {
      score += 5;
    } else if (m.timeMinutes <= 20) {
      // Small penalty only if it's meant to be a quick meal and we're missing lots of things
      score -= effectiveMissingCount * 1;
    }

    // Swipe preferences - Boosted heavily to ensure suggestions match what they like
    m.tags?.forEach(tag => {
      const lowerTag = tag.toLowerCase();
      if (likedTags[lowerTag]) score += likedTags[lowerTag] * 5;
      if (dislikedTags[lowerTag]) score -= dislikedTags[lowerTag] * 10; // Heavy penalty for disliked tags
    });
    
    if (m.cuisine) {
      const cuisineTag = `cuisine:${m.cuisine.toLowerCase()}`;
      if (likedTags[cuisineTag]) score += likedTags[cuisineTag] * 5;
      if (dislikedTags[cuisineTag]) score -= dislikedTags[cuisineTag] * 10;
    }
    
    m.ingredients?.forEach(ing => {
      const ingTag = `ingredient:${ing.name.toLowerCase()}`;
      if (likedTags[ingTag]) score += likedTags[ingTag] * 3;
      if (dislikedTags[ingTag]) score -= dislikedTags[ingTag] * 5;
    });
    
    if (m.difficulty === profile.skillLevel) score += 2;
    
    // Preparation time suitability
    if (m.timeMinutes <= profile.maxCookingTime) {
      score += 5; // Bonus for fitting within time
      // Extra bonus for being quick if they have a short max time
      if (profile.maxCookingTime <= 30 && m.timeMinutes <= 20) {
        score += 5;
      }
    } else {
      score -= 10; // Penalty for taking too long
    }

    return { meal: m, score };
  });

  // Sort by score descending
  scoredMeals.sort((a, b) => b.score - a.score);

  // Return top N, but limit favorites and ensure variety
  const finalSelection: Meal[] = [];
  let favoriteCount = 0;
  
  // Categorize for diversity
  const getType = (m: Meal) => {
    if (m.tags?.some(t => ['snack', 'breakfast'].includes(t.toLowerCase()))) return 'snack';
    if (m.tags?.some(t => ['lunch', 'salad', 'soup', 'light'].includes(t.toLowerCase()))) return 'light';
    if (m.timeMinutes <= 20) return 'quick';
    if (m.timeMinutes >= 45 || m.difficulty === 'Advanced') return 'elaborate';
    return 'dinner';
  };

  const typeCounts: Record<string, number> = { snack: 0, light: 0, quick: 0, elaborate: 0, dinner: 0 };
  
  // For variety, we don't want the same type back-to-back if we can help it
  let lastType = '';

  let candidates = [...scoredMeals];
  
  while (finalSelection.length < count && candidates.length > 0) {
    // Score remaining candidates based on diversity penalty
    // The goal is to pick the highest scoring meal that is DIFFERENT from `lastType` OR we are desperate
    
    let bestIdx = 0;
    let bestAdjustedScore = -999999;
    
    for (let i = 0; i < Math.min(candidates.length, 30); i++) { // only look at the top 30 remaining to keep relevance high
      const c = candidates[i];
      let adjScore = c.score;
      const type = getType(c.meal);
      
      // Penalize if it's the exact same type as the last one
      if (type === lastType) {
        adjScore -= 50; 
      }
      
      // Penalize if we have too many of this type proportionally
      // e.g. if we have 5 dinners and 0 snacks, penalize dinner.
      const proportion = typeCounts[type] / (finalSelection.length || 1);
      if (proportion > 0.4) { // if more than 40% are this type
        adjScore -= 20; 
      }

      const isFavorite = favorites.some(f => f.id === c.meal.id);
      if (isFavorite && favoriteCount >= 1) {
        adjScore -= 1000; // soft exclude
      }

      if (adjScore > bestAdjustedScore) {
        bestAdjustedScore = adjScore;
        bestIdx = i;
      }
    }
    
    const selected = candidates[bestIdx];
    candidates.splice(bestIdx, 1); // remove from candidates
    
    const isFavorite = favorites.some(f => f.id === selected.meal.id);
    if (isFavorite && favoriteCount >= 1) {
      continue; // Skip because we hit the max favorite threshold and we hard skip it now
    }
    if (isFavorite) {
      favoriteCount++;
    }
    
    const selectedType = getType(selected.meal);
    typeCounts[selectedType]++;
    lastType = selectedType;
    
    finalSelection.push(selected.meal);
  }

  return finalSelection;
};

export const getExplorationMeals = (
  count: number,
  excludeIds: string[],
  memberIds: string[],
  globalRecipes: Meal[],
  household: PersonProfile[],
  dislikedTags: Record<string, number>,
  likedTags: Record<string, number>,
  profile: UserProfile,
  inventory: InventoryItem[],
  favorites: Meal[]
): Meal[] => {
  const baseMeals = [...ALL_MEALS, ...globalRecipes];
  const variations = generateVirtualVariations(baseMeals);
  const allAvailableMeals = [...baseMeals, ...variations];
  
  // NEVER suggest favorites in Discovery (Exploration), only use them for underlying tag matching learning
  let availableMeals = allAvailableMeals.filter(m => !excludeIds.includes(m.id) && !favorites.find(f => f.id === m.id));
  const { dietary } = getActiveConstraints(memberIds, household);
  const heavilyDislikedTags = Object.keys(dislikedTags).map(t => t.toLowerCase());
  const allDislikedIngredients = household
    .filter(member => memberIds.includes(member.id))
    .flatMap(m => m.dislikedIngredients || [])
    .map(i => i.toLowerCase());

  // Filter by strict dietary - exploration should still be safe
  availableMeals = availableMeals.filter(m => {
    const mTags = m.tags?.map(t => t.toLowerCase()) || [];
    const mIngredients = m.ingredients?.map(i => i.name.toLowerCase()) || [];
    
    // 1. HARD Filter Dietary Defaults
    if (dietary.includes('Vegetarian')) {
      if (!mTags.includes('vegetarian') && mIngredients.some(i => i.includes('chicken') || i.includes('beef') || i.includes('pork') || i.includes('fish') || i.includes('shrimp'))) return false;
    }
    if (dietary.includes('Vegan')) {
      if (!mTags.includes('vegan') && mIngredients.some(i => i.includes('chicken') || i.includes('beef') || i.includes('pork') || i.includes('fish') || i.includes('milk') || i.includes('cheese') || i.includes('egg') || i.includes('butter'))) return false;
    }
    if (dietary.includes('Gluten-Free') && !mTags.includes('gluten-free')) return false;

    // 2. HARD Filter Disliked Tags
    if (heavilyDislikedTags.some(dt => 
      mTags.includes(dt) || 
      m.cuisine?.toLowerCase() === dt ||
      m.name.toLowerCase().includes(dt) ||
      mIngredients.some(i => i.includes(dt) || dt.includes(i))
    )) {
      return false;
    }

    // 3. HARD Filter Disliked Ingredients
    if (allDislikedIngredients.some(di => 
      mIngredients.some(ing => ing.includes(di) || di.includes(ing)) ||
      m.name.toLowerCase().includes(di)
    )) {
      return false;
    }

    return true;
  });

  // Calculate scores but add excitement/novelty boost
  const scoredMeals = availableMeals.map(m => {
    // If it's a variation, give it a tiny novelty boost for discovery
    let score = m.isVariation ? 5 : 0;
    
    // Swipe preferences (Personalization based on what they like)
    m.tags?.forEach(tag => {
      const lowerTag = tag.toLowerCase();
      if (likedTags[lowerTag]) score += likedTags[lowerTag] * 5; // Heavy boost for liked tags in discovery
      if (dislikedTags[lowerTag]) score -= dislikedTags[lowerTag] * 10;
    });
    
    if (m.cuisine) {
      const cuisineTag = `cuisine:${m.cuisine.toLowerCase()}`;
      if (likedTags[cuisineTag]) score += likedTags[cuisineTag] * 5;
      if (dislikedTags[cuisineTag]) score -= dislikedTags[cuisineTag] * 10;
    }
    
    m.ingredients?.forEach(ing => {
      const ingTag = `ingredient:${ing.name.toLowerCase()}`;
      if (likedTags[ingTag]) score += likedTags[ingTag] * 3;
      if (dislikedTags[ingTag]) score -= dislikedTags[ingTag] * 5;
    });

    // Profile preferences
    if (m.difficulty === profile.skillLevel) score += 2;
    if (m.timeMinutes <= profile.maxCookingTime) {
      score += 5;
    }
    
    // Check household goals
    const selectedMembers = household.filter(member => memberIds.includes(member.id));
    selectedMembers.forEach(member => {
      const memberGoals = member.goals || [];
      if (memberGoals.includes('Weight loss') && m.tags?.includes('low-calorie')) score += 5;
      if (memberGoals.includes('Eat more vegetables') && m.tags?.includes('vegetable-heavy')) score += 5;
      if (memberGoals.includes('High protein') && m.tags?.includes('high-protein')) score += 5;
      if (memberGoals.includes('Low carb') && m.tags?.includes('low-carb')) score += 5;
      if (memberGoals.includes('Heart healthy') && m.tags?.includes('heart-healthy')) score += 5;
    });

    // Add randomness for exploration (allowing unexpected things to show up)
    score += Math.random() * 30;

    return { meal: m, score };
  });

  return scoredMeals.sort((a, b) => b.score - a.score).slice(0, count).map(sm => sm.meal);
};
