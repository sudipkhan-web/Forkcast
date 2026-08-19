const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Update import
code = code.replace(
  "import { serverAnalyzePantryImage, serverGenerateStapleRecommendations, serverGenerateRecipes, getCuratedFallbackRecipes } from './src/services/geminiServer';",
  "import { serverAnalyzePantryImage, serverGenerateStapleRecommendations, serverGenerateRecipes, getCuratedFallbackRecipes, serverAnalyzeMealPhoto } from './src/services/geminiServer';"
);

// Add route
const analyzeRoute = `  app.post("/api/meals/analyze-photo", async (req, res) => {
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

  app.post("/api/recipes/generate-staples", async (req, res) => {`;

code = code.replace('  app.post("/api/recipes/generate-staples", async (req, res) => {', analyzeRoute);

fs.writeFileSync('server.ts', code);
console.log("Updated server.ts");
