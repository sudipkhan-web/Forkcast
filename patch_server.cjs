const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Need to import serverSuggestFreeTextOptions
code = code.replace(
  'serverClassifyIngredient\n} from "./src/services/geminiServer";',
  'serverClassifyIngredient,\n  serverSuggestFreeTextOptions\n} from "./src/services/geminiServer";'
);

const newRoute = `
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
`;

// Insert it somewhere
const target = `  app.post("/api/settings/notifications", (req, res) => {`;
code = code.replace(target, newRoute + '\n' + target);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts");
