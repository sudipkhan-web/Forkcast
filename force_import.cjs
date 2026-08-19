const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newImports = `import { 
  serverAnalyzePantryImage, 
  serverGenerateSmartStaples, 
  serverGenerateRecipes, 
  serverGenerateRecipeImage,
  serverAnalyzeMealPhoto,
  serverEstimateMealFromName,
  getCuratedFallbackRecipes, serverClassifyMealType
} from "./src/services/geminiServer";`;

code = code.replace(/import \{[\s\S]*?\} from "\.\/src\/services\/geminiServer";/, newImports);

fs.writeFileSync('server.ts', code);
console.log("Forced import");
