const fs = require('fs');
let code1 = fs.readFileSync('src/views/ShopView.tsx', 'utf8');
code1 = code1.replace(
  "import { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER } from '../styles/designTokens';",
  "import { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER } from '../styles/designTokens';\nimport { suggestFreeTextOptions } from '../services/mealPhotoAnalyzer';"
);
fs.writeFileSync('src/views/ShopView.tsx', code1);

let code2 = fs.readFileSync('src/components/PlanModal.tsx', 'utf8');
code2 = code2.replace(
  "import { getTopMeals, getSmartSubstitutions } from '../services/recommendationEngine';",
  "import { getTopMeals, getSmartSubstitutions } from '../services/recommendationEngine';\nimport { suggestFreeTextOptions } from '../services/mealPhotoAnalyzer';"
);
fs.writeFileSync('src/components/PlanModal.tsx', code2);
