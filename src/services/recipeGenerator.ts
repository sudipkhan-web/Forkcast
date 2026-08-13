import { Meal } from "../data/recipes";
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getOrGenerateRecipeImage } from "./imageGenerator";

export const generateSmartStaples = async (
  inventoryItems: string[],
  favoriteCuisines: string[],
  likedTags: string[]
): Promise<string[]> => {
  try {
    const res = await fetch("/api/recipes/generate-staples", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inventoryItems, favoriteCuisines, likedTags })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server returned status ${res.status}`);
    }

    const items = await res.json();
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Failed to generate smart staples:", error);
    return [];
  }
};

export const generateRecipes = async (
  count: number,
  likedTags: string[],
  dislikedTags: string[],
  dietary: string[],
  dislikedIngredients: string[],
  favoriteCuisines: string[],
  goals: string[],
  seenMealNames: string[] = [],
  favoriteMeals: Meal[] = [],
  inventoryItems: string[] = [],
  healthConditions: string[] = [],
  specificMealType?: string,
  trainingDayType?: string,
  weightKg?: number,
  remainingCarbsGrams?: number,
  remainingProteinGrams?: number,
  remainingFatGrams?: number
): Promise<Meal[]> => {
  const favoriteMealNamesStr = favoriteMeals.map(m => m.name).join(", ");

  try {
    const res = await fetch("/api/recipes/generate-recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        count,
        likedTags,
        dislikedTags,
        dietary,
        dislikedIngredients,
        favoriteCuisines,
        goals,
        seenMealNames,
        favoriteMealNamesStr,
        inventoryItems,
        healthConditions,
        specificMealType,
        trainingDayType,
        weightKg,
        remainingCarbsGrams,
        remainingProteinGrams,
        remainingFatGrams
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server returned status ${res.status}`);
    }

    const fetchedRecipes = await res.json();
    if (!Array.isArray(fetchedRecipes)) {
      return [];
    }

    const recipes: Meal[] = fetchedRecipes.map((r: any) => ({
      ...r,
      id: r.id || crypto.randomUUID(),
      timeMinutes: typeof r.timeMinutes === 'number' ? r.timeMinutes : parseInt(r.timeMinutes) || 30,
      difficulty: typeof r.difficulty === 'string' ? r.difficulty : 'Intermediate',
      mealType: typeof r.mealType === 'string' && ['Breakfast', 'Lunch', 'Dinner', 'Snack'].includes(r.mealType) ? r.mealType : 'Dinner'
    }));

    // Pre-generate images and assign them to the recipe objects
    for (const recipe of recipes) {
      try {
        const imageUrl = await getOrGenerateRecipeImage(recipe.id, recipe.name, recipe.cuisine || "", recipe.details || "");
        if (imageUrl) {
          recipe.image = imageUrl;
        }
      } catch (imgError) {
        console.error("Failed to pre-generate image for recipe:", recipe.name, imgError);
      }
    }

    if (auth.currentUser) {
      for (const recipe of recipes) {
        try {
          await setDoc(doc(db, 'recipes', recipe.id), {
            ...recipe,
            uid: auth.currentUser.uid
          });
        } catch (e) {
          console.error("Failed to save generated recipe to global collection", e);
        }
      }
    }

    return recipes;
  } catch (error) {
    console.error("Error generating recipes:", error);
    return [];
  }
};
