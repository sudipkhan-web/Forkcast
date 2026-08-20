const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "likedTags={likedTags}\n          />",
  "likedTags={likedTags}\n            customIngredientRules={customIngredientRules}\n          />"
);

code = code.replace(
  "likedTags={likedTags}\r\n          />",
  "likedTags={likedTags}\r\n            customIngredientRules={customIngredientRules}\r\n          />"
);

fs.writeFileSync('src/App.tsx', code);
