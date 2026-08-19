import { set, get } from "idb-keyval";

/**
 * Generates an image using Imagen 3 via the backend server-side API, and caches it in IndexedDB
 * to load blazing fast on subsequent views.
 */
export const getOrGenerateRecipeImage = async (recipeId: string, recipeName: string, cuisine: string = '', details: string = ''): Promise<string> => {
  try {
    // Check IndexedDB cache first
    const cacheKey = `recipe_img_${recipeId}`;
    const cachedImage = await get(cacheKey);
    if (cachedImage) {
      return cachedImage;
    }

    const res = await fetch("/api/recipes/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ recipeName, cuisine, details })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server returned status ${res.status}`);
    }

    const data = await res.json();
    if (data && data.base64) {
      const dataUrl = `data:image/jpeg;base64,${data.base64}`;
      // Cache in IDB
      await set(cacheKey, dataUrl);
      return dataUrl;
    }

    if (data && data.fallbackUrl) {
      // Cache the fallback URL in IDB too
      await set(cacheKey, data.fallbackUrl);
      return data.fallbackUrl;
    }

    // Fallback if generation fails to yield an image part
    const fallbackPrompt = `Professional food photography of ${recipeName}. ${cuisine ? cuisine + ' cuisine. ' : ''}High quality, appetizing, delicious.`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(fallbackPrompt)}?width=800&height=800&nologo=true`;
  } catch (error) {
    // Image generation failed (e.g. network error, ad blocker, quota). Using fallback quietly.
    // Return a reliable fallback
    const fallbackPrompt = `Professional food photography of ${recipeName}. ${cuisine ? cuisine + ' cuisine. ' : ''}High quality, appetizing, delicious.`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(fallbackPrompt)}?width=800&height=800&nologo=true`;
  }
};
