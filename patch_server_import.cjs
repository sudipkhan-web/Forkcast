const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "serverGenerateRecipeImage,",
  "serverGenerateRecipeImage,\n  serverAnalyzeMealPhoto,"
);

fs.writeFileSync('server.ts', code);
console.log("Updated server.ts imports");
