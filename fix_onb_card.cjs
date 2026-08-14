const fs = require('fs');
let code = fs.readFileSync('src/views/OnboardingView.tsx', 'utf8');

if (!code.includes("import { CARD, PILL, PRIMARY_BUTTON }")) {
  code = code.replace(
    "import { Plus, ChefHat, Sparkles, ArrowRight, Check } from 'lucide-react';",
    "import { Plus, ChefHat, Sparkles, ArrowRight, Check } from 'lucide-react';\nimport { CARD, PILL, PRIMARY_BUTTON } from '../styles/designTokens';"
  );
}

code = code.replace(
  /className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm flex items-center justify-between"/g,
  'className={`${CARD} p-5 flex items-center justify-between`}'
);

fs.writeFileSync('src/views/OnboardingView.tsx', code);
