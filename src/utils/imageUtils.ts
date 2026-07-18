/**
 * Generates a recipe image URL based on the dish name for consistency and reliability.
 * Uses specific seeds to ensure the same dish always gets the same high-quality image.
 */
export const getRecipeImageUrl = (dishName: string, subFlavor?: string): string => {
  const seed = encodeURIComponent(dishName.toLowerCase().trim());
  
  // Use a flavor-specific seed if provided (e.g., for variations)
  const finalSeed = subFlavor ? `${seed}-${subFlavor.toLowerCase()}` : seed;
  
  // High quality Unsplash source via source.unsplash (deprecated but sometimes works)
  // or use picsum with descriptive keywords if we want reliability
  // However, Pollinations (used in generator) is good for AI recipes.
  // For static ones, a reliable keyword-based Unsplash redirect or picsum is better.
  
  return `https://picsum.photos/seed/${finalSeed}/800/600`;
};
