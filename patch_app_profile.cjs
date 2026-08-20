const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "setProfile={setProfile}\n          />",
  "setProfile={setProfile}\n            customIngredientRules={customIngredientRules}\n          />"
);

code = code.replace(
  "setProfile={setProfile}\r\n          />",
  "setProfile={setProfile}\r\n            customIngredientRules={customIngredientRules}\r\n          />"
);

fs.writeFileSync('src/App.tsx', code);
