const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "    customIngredientRules\n  } = useAppContext();",
  "    customIngredientRules,\n    queuedSuggestions\n  } = useAppContext();"
);

fs.writeFileSync('src/App.tsx', code);
