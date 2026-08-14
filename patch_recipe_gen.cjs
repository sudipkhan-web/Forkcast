const fs = require('fs');
let code = fs.readFileSync('src/services/recipeGenerator.ts', 'utf8');

const oldLoop = `    // Pre-generate images and assign them to the recipe objects
    for (const recipe of recipes) {
      try {
        const imageUrl = await getOrGenerateRecipeImage(recipe.id, recipe.name, recipe.cuisine || "", recipe.details || "");
        if (imageUrl) {
          recipe.image = imageUrl;
        }
      } catch (imgError) {
        console.error("Failed to pre-generate image for recipe:", recipe.name, imgError);
      }
    }`;

const newLoop = `    // Pre-generate images and assign them to the recipe objects in batches to avoid rate limits
    const CHUNK_SIZE = 4;
    for (let i = 0; i < recipes.length; i += CHUNK_SIZE) {
      const chunk = recipes.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(async (recipe) => {
        try {
          const imageUrl = await getOrGenerateRecipeImage(recipe.id, recipe.name, recipe.cuisine || "", recipe.details || "");
          if (imageUrl) {
            recipe.image = imageUrl;
          }
        } catch (imgError) {
          console.error("Failed to pre-generate image for recipe:", recipe.name, imgError);
        }
      }));
    }`;

if (code.includes(oldLoop)) {
  code = code.replace(oldLoop, newLoop);
  fs.writeFileSync('src/services/recipeGenerator.ts', code);
  console.log("Successfully patched recipeGenerator.ts");
} else {
  console.log("Could not find old loop in recipeGenerator.ts");
}
