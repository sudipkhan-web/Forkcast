const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Update imports
code = code.replace(
  /getCuratedFallbackRecipes/,
  "getCuratedFallbackRecipes, serverClassifyMealType"
);

// Add route
const newRoute = `
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
`;

// Insert the new route before app.listen or similar
code = code.replace(/app\.listen\(/, newRoute + '\n  app.listen(');

fs.writeFileSync('server.ts', code);
console.log("Updated server.ts with route");
