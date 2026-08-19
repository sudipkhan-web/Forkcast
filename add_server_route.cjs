const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importStatement = 'import { serverGenerateRecipes, serverGenerateSmartStaples, serverGenerateRecipeImage, serverAnalyzeMealPhoto, serverClassifyMealType, serverEstimateMealFromName } from "./src/services/geminiServer";';
code = code.replace(/import \{.*?\} from "\.\/src\/services\/geminiServer";/, importStatement);

const newRoute = `
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

  app.post("/api/meals/analyze-photo"`;

code = code.replace(/app\.post\("\/api\/meals\/analyze-photo"/, newRoute);

fs.writeFileSync('server.ts', code);
