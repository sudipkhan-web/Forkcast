const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /fatGrams: meal.fatGrams \|\| 0,\n\s*loggedAt: new Date\(\)\.toISOString\(\)/,
  "fatGrams: meal.fatGrams || 0,\n              mealType: meal.mealType || 'Snack',\n              loggedAt: new Date().toISOString()"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx");
