const fs = require('fs');
let code = fs.readFileSync('src/views/AuthView.tsx', 'utf8');

if (!code.includes("import { CARD, PRIMARY_BUTTON }")) {
  code = code.replace(
    "import { LogIn } from 'lucide-react';",
    "import { LogIn } from 'lucide-react';\nimport { CARD, PRIMARY_BUTTON } from '../styles/designTokens';"
  );
}

// replace the sign-in/sign-up card container
code = code.replace(
  'className="w-full max-w-md bg-stone-900 rounded-3xl shadow-xl border border-stone-100 p-8 sm:p-10 text-center"',
  'className={`${CARD} w-full max-w-md p-8 sm:p-10 text-center`}'
);

// replace submit button
code = code.replace(
  'className="w-full bg-[#FC5200] text-white px-4 py-3.5 rounded-xl font-medium hover:bg-[#FC5200] active:scale-[0.98] transition-all shadow-sm mt-2"',
  'className={`${PRIMARY_BUTTON} w-full px-4 py-3.5 mt-2`}'
);

fs.writeFileSync('src/views/AuthView.tsx', code);
