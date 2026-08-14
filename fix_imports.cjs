const fs = require('fs');

let authCode = fs.readFileSync('src/views/AuthView.tsx', 'utf8');
if (!authCode.includes('import { CARD, PRIMARY_BUTTON }')) {
  authCode = authCode.replace(
    "import { ChefHat } from 'lucide-react';",
    "import { ChefHat } from 'lucide-react';\nimport { CARD, PRIMARY_BUTTON } from '../styles/designTokens';"
  );
  fs.writeFileSync('src/views/AuthView.tsx', authCode);
}

let onbCode = fs.readFileSync('src/views/OnboardingView.tsx', 'utf8');
if (!onbCode.includes('import { CARD, PILL, PRIMARY_BUTTON }')) {
  onbCode = onbCode.replace(
    "import { Sparkles, Plus, Check, ArrowRight, ChefHat } from 'lucide-react';",
    "import { Sparkles, Plus, Check, ArrowRight, ChefHat } from 'lucide-react';\nimport { CARD, PILL, PRIMARY_BUTTON } from '../styles/designTokens';"
  );
  fs.writeFileSync('src/views/OnboardingView.tsx', onbCode);
}
