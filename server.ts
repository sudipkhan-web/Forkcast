import { createServer as createViteServer } from "vite";
import path from "path";
import express from "express";
import { 
  serverAnalyzePantryImage, 
  serverGenerateSmartStaples, 
  serverGenerateRecipes, 
  serverGenerateRecipeImage,
  serverAnalyzeMealPhoto,
  serverEstimateMealFromName,
  getCuratedFallbackRecipes, serverClassifyMealType,
  serverClassifyIngredient,
  serverSuggestFreeTextOptions,
  serverCreateLiveToken
} from "./src/services/geminiServer";
import { requireFirebaseUser, type AuthedRequest } from "./src/services/authMiddleware";
import { ICON_192, ICON_512, APPLE_TOUCH_ICON, FAVICON_32 } from "./src/services/iconData";
import { allowFeedback, validateFeedback, sendFeedbackEmail } from "./src/services/feedbackServer";
import { apiRateLimit } from "./src/services/rateLimit";
import { reportError, reportClientError } from "./src/services/errorAlert";
import { enforceFreeTierCap, getUsageStatus, addRequestCostEur } from "./src/services/aiUsage";
import { VOICE_SESSION_ESTIMATE_EUR } from "./src/services/aiCostConfig";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic hardening headers. (No X-Frame-Options: the AI Studio preview embeds the app in a frame.)
  app.use((_req, res, next) => {
    res.set({ "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin" });
    next();
  });
  // Photos are resized in the browser before upload, so 15 MB is plenty for a base64 image.
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // App icons: served from embedded text so a sync that mangles binary files can't break "Install app".
  const iconRoutes: Record<string, string> = {
    "/icon-192.png": ICON_192,
    "/icon-512.png": ICON_512,
    "/apple-touch-icon.png": APPLE_TOUCH_ICON,
    "/favicon-32.png": FAVICON_32,
  };
  Object.entries(iconRoutes).forEach(([route, b64]) => {
    const png = Buffer.from(b64, "base64");
    app.get(route, (_req, res) => {
      res.set({ "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" });
      res.send(png);
    });
  });

  // Every /api route requires a signed-in Firebase user (see authMiddleware.ts)
  app.use("/api", requireFirebaseUser);
  // Per-user request limit (protects the Gemini bill while the monthly cap is off)
  app.use("/api", apiRateLimit);
  // Free-tier AI cap: free users over this month's allowance get 402 (see aiCostConfig.ts)
  app.use("/api", enforceFreeTierCap);

  // Crash reports from the browser (signed-in users only; limited per user in errorAlert.ts)
  app.post("/api/client-error", (req: AuthedRequest, res) => {
    reportClientError(req.uid!, req.body);
    res.status(204).end();
  });

  // Current user's AI allowance for this month (not metered itself)
  app.get("/api/usage", async (req: AuthedRequest, res) => {
    res.json(await getUsageStatus(req.uid!, req.email, req.emailVerified));
  });

  // Short-lived, single-use token for the voice assistant (Gemini Live).
  // The real GEMINI_API_KEY never leaves the server.
  app.post("/api/live/token", async (req, res) => {
    try {
      const token = await serverCreateLiveToken();
      addRequestCostEur(VOICE_SESSION_ESTIMATE_EUR);
      res.json({ token });
    } catch (error: any) {
      console.error("[SERVER] Error creating live token:", error);
      res.status(500).json({
        error: "Voice assistant is unavailable right now.",
        detail: String(error?.message || error).slice(0, 300),
      });
    }
  });

  // In-app feedback: validates, rate-limits (5/hour/user) and emails the feedback inbox.
  // The Firestore record is written by the client afterwards (see FeedbackModal + firestore.rules).
  app.post("/api/feedback", async (req: AuthedRequest, res) => {
    const parsed = validateFeedback(req.body);
    if (parsed.ok === false) {
      return res.status(400).json({ error: parsed.error });
    }
    if (!allowFeedback(req.uid as string)) {
      return res.status(429).json({ error: "You've sent a lot of feedback in the last hour. Please try again later." });
    }
    const emailed = await sendFeedbackEmail({
      feedback: parsed.value,
      uid: req.uid as string,
      email: req.email ?? null,
      userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
    });
    // The Firestore write is the record, so success does not depend on the email.
    res.json({ ok: true, emailed });
  });

  // API Routes for Gemini Services (Fully Server-Side)

  app.post("/api/inventory/classify-ingredient", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Missing name in request body." });
      }
      const result = await serverClassifyIngredient(name);
      res.json(result);
    } catch (error: any) {
      console.error("[SERVER] Error classifying ingredient:", error);
      res.status(500).json({ error: "Failed to classify ingredient." });
    }
  });

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

  
  app.post("/api/meals/estimate-from-name", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Missing name in request body." });
      }
      const result = await serverEstimateMealFromName(name);
      res.json(result);
    } catch (error: any) {
      console.warn("[SERVER] Notice during meal estimation:", error?.message || error);
      res.json(null);
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

  app.post("/api/suggestions/freetext", async (req, res) => {
    try {
      const { category, partialText } = req.body;
      if (!category || !partialText) {
        return res.status(400).json({ error: "Missing category or partialText" });
      }
      const results = await serverSuggestFreeTextOptions(category, partialText);
      res.json(results);
    } catch (error: any) {
      console.error("[SERVER] Error generating free text suggestions:", error);
      res.json([]);
    }
  });

  app.post("/api/settings/notifications", (req: AuthedRequest, res) => {
    // Use the verified uid from the sign-in token, never an id sent in the request body.
    const { emailNotificationEnabled } = req.body;
    console.log(`[SERVER] User ${req.uid} toggled email notifications to: ${emailNotificationEnabled}`);
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

  
app.post('/api/recipes/classify-mealtype', async (req, res) => {
  try {
    const { name, ingredients, details } = req.body;
    if (!name || !ingredients || !details) {
      return res.status(400).json({ error: 'Missing required fields: name, ingredients, details' });
    }

    const mealType = await serverClassifyMealType(name, ingredients, details);
    res.json({ mealType });
  } catch (error: any) {
    console.error('Error classifying meal type:', error);
    res.status(500).json({ error: 'Failed to classify meal type', details: error.message });
  }
});

  // Last-resort handler for errors thrown outside a route's own try/catch
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    reportError("SERVER-ERROR", String(err?.stack || err?.message || err).slice(0, 500));
    if (!res.headersSent) res.status(500).json({ error: "Something went wrong. Please try again." });
  });
  process.on("uncaughtException", (err) => reportError("SERVER-ERROR", `uncaughtException: ${String(err?.stack || err).slice(0, 500)}`));
  process.on("unhandledRejection", (err: any) => reportError("SERVER-ERROR", `unhandledRejection: ${String(err?.stack || err).slice(0, 500)}`));

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
