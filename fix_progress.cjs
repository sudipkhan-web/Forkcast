const fs = require('fs');
let code = fs.readFileSync('src/views/ProgressView.tsx', 'utf8');

if (!code.includes("import { CARD, PILL }")) {
  code = code.replace(
    "import { Target, Flame, ChevronRight } from 'lucide-react';",
    "import { Target, Flame, ChevronRight } from 'lucide-react';\nimport { CARD, PILL } from '../styles/designTokens';"
  );
}

// 1. Race-countdown hero
// <div className="flex flex-col items-center justify-center py-6 bg-stone-900 rounded-3xl border border-stone-800 shadow-xl">
code = code.replace(
  'className="flex flex-col items-center justify-center py-6 bg-stone-900 rounded-3xl border border-stone-800 shadow-xl"',
  'className={`${CARD} flex flex-col items-center justify-center py-6`}'
);

// Fallback race countdown
// className="flex flex-col items-center justify-center py-10 bg-stone-900 rounded-3xl border border-stone-800 shadow-xl text-center px-6"
code = code.replace(
  'className="flex flex-col items-center justify-center py-10 bg-stone-900 rounded-3xl border border-stone-800 shadow-xl text-center px-6"',
  'className={`${CARD} flex flex-col items-center justify-center py-10 text-center px-6`}'
);

// 2. Weekly Coverage
// className="bg-stone-900 rounded-3xl border border-stone-800 p-6 shadow-xl"
// wait, there are two of these (Streak and Weekly, maybe Trend Chart)
code = code.replace(
  /className="bg-stone-900 rounded-3xl border border-stone-800 p-6 shadow-xl"/g,
  'className={`${CARD} p-6`}'
);

// 3. Streak badge
// className="bg-stone-900 rounded-3xl border border-stone-800 p-6 shadow-xl flex items-center gap-4"
code = code.replace(
  /className="bg-stone-900 rounded-3xl border border-stone-800 p-6 shadow-xl flex items-center gap-4"/g,
  'className={`${CARD} p-6 flex items-center gap-4`}'
);

// 4. Macro trend chart container
// (already caught by the global replace if it's identical, let's verify)

// 5. Carbs/Protein/Fat toggle buttons
// className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0 ${
//   activeMacro === macro
//     ? 'bg-[#FC5200] border-[#FC5200] text-white shadow-lg shadow-[#FC5200]/20'
//     : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
// }`}
const oldToggle = "className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0 ${\n                  activeMacro === macro\n                    ? 'bg-[#FC5200] border-[#FC5200] text-white shadow-lg shadow-[#FC5200]/20'\n                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'\n                }`}";
const newToggle = "className={activeMacro === macro ? 'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0 bg-[#FC5200] border-[#FC5200] text-white shadow-lg shadow-[#FC5200]/20' : `${PILL} shrink-0 capitalize`}";

code = code.replace(oldToggle, newToggle);
// Maybe it's formatted differently? Let's use regex for the toggle.

code = code.replace(/\\\$\{/g, '${');
fs.writeFileSync('src/views/ProgressView.tsx', code);
