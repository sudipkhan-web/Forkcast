const fs = require('fs');

let geminiServer = fs.readFileSync('src/services/geminiServer.ts', 'utf8');
geminiServer = geminiServer.replace(/gemini-2\.5-flash/g, 'gemini-3.6-flash');
fs.writeFileSync('src/services/geminiServer.ts', geminiServer);

let recipeImage = fs.readFileSync('src/components/RecipeImage.tsx', 'utf8');
recipeImage = recipeImage.replace(/gemini-2\.5-flash/g, 'gemini-3.6-flash');
fs.writeFileSync('src/components/RecipeImage.tsx', recipeImage);

console.log("Updated gemini models.");
