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
    const contentType = res.headers.get("content-type");
    if (!contentType || contentType.indexOf("application/json") === -1) {
      throw new Error("Received non-JSON response from server. Please try again.");
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
    const contentType = res.headers.get("content-type");
    if (!contentType || contentType.indexOf("application/json") === -1) {
      throw new Error("Received non-JSON response from server. Please try again.");
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

    // Pre-generate images and assign them to the recipe objects in batches to avoid rate limits
    const CHUNK_SIZE = 4;
    for (let i = 0; i < recipes.length; i += CHUNK_SIZE) {
      const chunk = recipes.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(async (recipe) => {
        try {
          const imageUrl = await getOrGenerateRecipeImage(recipe.id, recipe.name, recipe.cuisine || "", recipe.details || "");
          if (imageUrl) {
            recipe.image = imageUrl;
          }
        } catch (imgError) {
          console.error("Failed to pre-generate image for recipe:", recipe.name, imgError);
        }
      }));
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
    // Fallback if API fails or quota is exceeded
    return [
      {
        id: crypto.randomUUID(),
        name: "Quick Quinoa Salad",
        cuisine: "Mediterranean",
        time: "15 min",
        timeMinutes: 15,
        difficulty: "Beginner",
        reason: "A fast, healthy quinoa salad with fresh veggies.",
        details: "Perfect for a quick lunch.",
        calories: 450,
        carbsGrams: 50, proteinGrams: 15, fatGrams: 20,
        ingredients: [
          { name: "Quinoa", amount: "1 cup" },
          { name: "Cucumber", amount: "1/2" },
          { name: "Tomatoes", amount: "1/2 cup" },
          { name: "Feta", amount: "1/4 cup" },
          { name: "Olive Oil", amount: "1 tbsp" }
        ],
        steps: ["Boil quinoa", "Chop veggies", "Mix and serve"],
        tags: ["Healthy", "Vegetarian", "Quick"],
        mealType: "Lunch",
        image: "https://image.pollinations.ai/prompt/Professional%20food%20photography%20of%20Quick%20Quinoa%20Salad%20Mediterranean?width=800&height=800&nologo=true"
      } as Meal,
      {
        id: crypto.randomUUID(),
        name: "Avocado Toast with Egg",
        cuisine: "American",
        time: "10 min",
        timeMinutes: 10,
        difficulty: "Beginner",
        reason: "Classic avocado toast topped with a sunny-side-up egg.",
        details: "Great for breakfast or a post-workout snack.",
        calories: 350,
        carbsGrams: 30, proteinGrams: 18, fatGrams: 22,
        ingredients: [
          { name: "Bread", amount: "2 slices" },
          { name: "Avocado", amount: "1/2" },
          { name: "Egg", amount: "2" },
          { name: "Salt", amount: "pinch" },
          { name: "Pepper", amount: "pinch" }
        ],
        steps: ["Toast bread", "Mash avocado", "Fry egg", "Assemble"],
        tags: ["Breakfast", "High Protein", "Quick"],
        mealType: "Breakfast",
        image: "https://image.pollinations.ai/prompt/Professional%20food%20photography%20of%20Avocado%20Toast%20with%20Egg?width=800&height=800&nologo=true"
      } as Meal
    ];
  }
};
