const fs = require('fs');

let recipeGen = fs.readFileSync('src/services/recipeGenerator.ts', 'utf8');

// Replace console.error for "Error generating recipes:"
recipeGen = recipeGen.replace(
  /console\.error\("Error generating recipes:", error\);/g,
  "// Suppressed recipe generation error (quota/network) as fallback is handled."
);
// Same for staples
recipeGen = recipeGen.replace(
  /console\.error\("Failed to generate smart staples:", error\);/g,
  "// Suppressed staple generation error."
);

fs.writeFileSync('src/services/recipeGenerator.ts', recipeGen);
console.log("Fixed recipeGenerator logs");
