import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { 
  serverAnalyzePantryImage, 
  serverGenerateSmartStaples, 
  serverGenerateRecipes, 
  serverGenerateRecipeImage,
  serverAnalyzeMealPhoto,
  getCuratedFallbackRecipes
} from "./src/services/geminiServer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" })); // Support large base64 image loads
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes for Gemini Services (Fully Server-Side)
  app.post("/api/inventory/scan", async (req, res) => {
    try {
      const { base64Image, mimeType } = req.body;
      if (!base64Image || !mimeType) {
        return res.status(400).json({ error: "Missing base64Image or mimeType in request body." });
      }
      const result = await serverAnalyzePantryImage(base64Image, mimeType);
      res.json(result || []);
    } catch (error: any) {
      console.warn("[SERVER] Notice during inventory scanning / image analysis:", error?.message || error);
      res.json([]);
    }
  });

  app.post("/api/meals/analyze-photo", async (req, res) => {
    try {
      const { base64Image, mimeType } = req.body;
      if (!base64Image || !mimeType) {
        return res.status(400).json({ error: "Missing base64Image or mimeType in request body." });
      }
      const result = await serverAnalyzeMealPhoto(base64Image, mimeType);
      res.json(result);
    } catch (error: any) {
      console.warn("[SERVER] Notice during meal photo analysis:", error?.message || error);
      res.json(null);
    }
  });

  app.post("/api/recipes/generate-staples", async (req, res) => {
    try {
      const { inventoryItems, favoriteCuisines, likedTags } = req.body;
      const result = await serverGenerateSmartStaples(
        inventoryItems || [],
        favoriteCuisines || [],
        likedTags || []
      );
      res.json(result || []);
    } catch (error: any) {
      console.warn("[SERVER] Fallback during staples generation:", error?.message || error);
      res.json(["Garlic", "Olive Oil", "Eggs", "Parmesan"]);
    }
  });

  app.post("/api/recipes/generate-recipes", async (req, res) => {
    try {
      const {
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
      } = req.body;

      const result = await serverGenerateRecipes(
        count || 6,
        likedTags || [],
        dislikedTags || [],
        dietary || [],
        dislikedIngredients || [],
        favoriteCuisines || [],
        goals || [],
        seenMealNames || [],
        favoriteMealNamesStr || "",
        inventoryItems || [],
        healthConditions || [],
        specificMealType,
        trainingDayType,
        weightKg,
        remainingCarbsGrams,
        remainingProteinGrams,
        remainingFatGrams
      );

      if (Array.isArray(result) && result.length > 0) {
        return res.json(result);
      }

      const fallbacks = getCuratedFallbackRecipes(
        count || 6,
        dietary || [],
        dislikedIngredients || [],
        favoriteCuisines || [],
        seenMealNames || [],
        specificMealType
      );
      res.json(fallbacks);
    } catch (error: any) {
      console.warn("[SERVER] Using curated recipes after generation notice:", error?.message || error);
      const fallbacks = getCuratedFallbackRecipes(
        req.body?.count || 6,
        req.body?.dietary || [],
        req.body?.dislikedIngredients || [],
        req.body?.favoriteCuisines || [],
        req.body?.seenMealNames || [],
        req.body?.specificMealType
      );
      res.json(fallbacks);
    }
  });

  app.post("/api/recipes/generate-image", async (req, res) => {
    try {
      const { recipeName, cuisine, details } = req.body;
      if (!recipeName) {
        return res.status(400).json({ error: "Missing recipeName in request body." });
      }
      const base64Data = await serverGenerateRecipeImage(recipeName, cuisine || "", details || "");
      if (base64Data) {
        return res.json({ base64: base64Data });
      }
      const fallbackPrompt = `Professional food photography of ${recipeName}. ${cuisine ? cuisine + ' cuisine. ' : ''}High quality, appetizing, delicious.`;
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fallbackPrompt)}?width=800&height=800&nologo=true`;
      res.json({ base64: null, fallbackUrl });
    } catch (error: any) {
      const fallbackPrompt = `Professional food photography of ${req.body?.recipeName || 'delicious meal'}. ${req.body?.cuisine ? req.body.cuisine + ' cuisine. ' : ''}High quality, appetizing, delicious.`;
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fallbackPrompt)}?width=800&height=800&nologo=true`;
      res.json({ base64: null, fallbackUrl });
    }
  });

  // API Route - Demo Endpoint for Email Notifications
  app.post("/api/settings/notifications", (req, res) => {
    const { emailNotificationEnabled, userId } = req.body;
    console.log(`[SERVER] User ${userId} toggled email notifications to: ${emailNotificationEnabled}`);
    res.json({ success: true, emailNotificationEnabled });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
