const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importStatement = 'import { serverGenerateRecipes, serverGenerateSmartStaples, serverGenerateRecipeImage, serverAnalyzeMealPhoto, serverClassifyMealType, serverEstimateMealFromName } from "./src/services/geminiServer";';
code = code.replace(/import \{.*?\} from "\.\/src\/services\/geminiServer";/, importStatement);

fs.writeFileSync('server.ts', code);
console.log("Fixed server imports");
