import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { 
  serverAnalyzePantryImage, 
  serverGenerateSmartStaples, 
  serverGenerateRecipes, 
  serverGenerateRecipeImage 
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
      res.json(result);
    } catch (error: any) {
      console.error("[SERVER] Error during inventory scanning / image analysis:", error);
      res.status(500).json({ error: error.message || "Failed to scan pantry image." });
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
      res.json(result);
    } catch (error: any) {
      console.error("[SERVER] Error during staples generation:", error);
      res.status(500).json({ error: error.message || "Failed to generate smart staples." });
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
      res.json(result);
    } catch (error: any) {
      console.error("[SERVER] Error during recipe generation:", error);
      res.status(500).json({ error: error.message || "Failed to generate recipes." });
    }
  });

  app.post("/api/recipes/generate-image", async (req, res) => {
    try {
      const { recipeName, cuisine, details } = req.body;
      if (!recipeName) {
        return res.status(400).json({ error: "Missing recipeName in request body." });
      }
      const base64Data = await serverGenerateRecipeImage(recipeName, cuisine || "", details || "");
      res.json({ base64: base64Data });
    } catch (error: any) {
      console.info("Using fallback image generator.");
      const fallbackPrompt = `Professional food photography of ${req.body.recipeName}. ${req.body.cuisine ? req.body.cuisine + ' cuisine. ' : ''}High quality, appetizing, delicious.`;
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fallbackPrompt)}?width=800&height=800&nologo=true`;
      res.json({ base64: null, fallbackUrl });
    }
  });

  // API Route - Demo Endpoint for Email Notifications
  app.post("/api/settings/notifications", (req, res) => {
    const { emailNotificationEnabled, userId } = req.body;
    // In a real application with Firebase Admin, we would schedule a Cloud Function or a cron job
    // mapping to Amazon SES, SendGrid, or Resend to send the automated offline emails.
    console.log(`[SERVER] User ${userId} toggled email notifications to: ${emailNotificationEnabled}`);
    if (emailNotificationEnabled) {
      console.log(`[SERVER] Automated Cron Job registered for User: ${userId}`);
      console.log(`[SERVER] Will send offline notifications to configured email when expiring items approach.`);
    } else {
      console.log(`[SERVER] Automated Cron Job de-registered for User: ${userId}`);
    }
    res.json({ success: true, emailNotificationEnabled });
  });

  // Background mock worker for sending notifications offline
  setInterval(() => {
    // In a production environment, this would query Firebase Admin for users who have emailNotifications = true
    // and send them an email regarding any expiring items in their inventory.
    // console.log("[CRON] Checking profiles for pending automated background emails...");
  }, 60000);

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
    console.log(`Offline email/push notification service is standing by.`);
  });
}

startServer();
