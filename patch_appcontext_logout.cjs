const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  "      setProfile({\n        favoriteCuisines: [],\n        hasCompletedOnboarding: false,\n      });",
  "      setQueuedSuggestions(null);\n      setProfile({\n        favoriteCuisines: [],\n        hasCompletedOnboarding: false,\n      });"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
