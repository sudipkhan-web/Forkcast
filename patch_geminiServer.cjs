const fs = require('fs');
let code = fs.readFileSync('src/services/geminiServer.ts', 'utf8');

code = code.replace(
  /const matchingType = pool\.filter\(m => \(m\.mealType \|\| 'Dinner'\)\.toLowerCase\(\) === specificMealType\.toLowerCase\(\)\);/,
  "const matchingType = pool.filter(m => m.mealType?.toLowerCase() === specificMealType.toLowerCase());"
);

code = code.replace(
  /mealType: specificMealType && specificMealType !== 'All' \? specificMealType : \(meal\.mealType \|\| 'Dinner'\),/,
  "mealType: specificMealType && specificMealType !== 'All' ? specificMealType : meal.mealType,"
);

fs.writeFileSync('src/services/geminiServer.ts', code);
console.log("Updated geminiServer.ts");
