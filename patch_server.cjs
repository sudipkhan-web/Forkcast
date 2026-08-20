const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Add to imports
code = code.replace(
  "serverClassifyMealType\n} from \"./src/services/geminiServer\";",
  "serverClassifyMealType,\n  serverClassifyIngredient\n} from \"./src/services/geminiServer\";"
);
code = code.replace(
  "serverClassifyMealType\r\n} from \"./src/services/geminiServer\";",
  "serverClassifyMealType,\r\n  serverClassifyIngredient\r\n} from \"./src/services/geminiServer\";"
);

// Add route
const newRoute = `
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
`;

code = code.replace(
  "  app.post(\"/api/inventory/scan\", async (req, res) => {",
  newRoute + "\n  app.post(\"/api/inventory/scan\", async (req, res) => {"
);

fs.writeFileSync('server.ts', code);
