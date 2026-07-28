const fs = require('fs');

let homeContent = fs.readFileSync('src/views/HomeView.tsx', 'utf8');
homeContent = homeContent.replace(
  "const newMeals = await generateRecipes(12, liked, disliked, dietary, dislikedIngredients, favoriteCuisines, goals, seenNames, favorites, inventoryNames, healthConditions, mealTypeFilter === 'All' ? undefined : mealTypeFilter, trainingDayType || undefined);",
  "const newMeals = await generateRecipes(12, liked, disliked, dietary, dislikedIngredients, favoriteCuisines, goals, seenNames, favorites, inventoryNames, healthConditions, mealTypeFilter === 'All' ? undefined : mealTypeFilter, trainingDayType || undefined, profile?.weightKg);"
);
fs.writeFileSync('src/views/HomeView.tsx', homeContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  "const newMeals = await generateRecipes(12, liked, disliked, dietary, dislikedIngredients, favoriteCuisines, goals, seenNames, favorites, inventoryNames, healthConditions, undefined, trainingDayType);",
  "const newMeals = await generateRecipes(12, liked, disliked, dietary, dislikedIngredients, favoriteCuisines, goals, seenNames, favorites, inventoryNames, healthConditions, undefined, trainingDayType, profile?.weightKg);"
);
fs.writeFileSync('src/App.tsx', appContent);
