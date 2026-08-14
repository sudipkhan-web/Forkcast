const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  "        setPantryLogs([]);\n        setCustomIngredientRules({});",
  "        setQueuedSuggestions([]);\n        setPantryLogs([]);\n        setCustomIngredientRules({});"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
