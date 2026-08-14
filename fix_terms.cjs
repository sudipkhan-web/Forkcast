const fs = require('fs');
let code = fs.readFileSync('src/views/TermsGateView.tsx', 'utf8');

if (!code.includes("import { CARD, PRIMARY_BUTTON }")) {
  code = code.replace(
    "import { FileText } from 'lucide-react';",
    "import { FileText } from 'lucide-react';\nimport { CARD, PRIMARY_BUTTON } from '../styles/designTokens';"
  );
}

// Button
const btnRegex = /className=\{`w-full py-4 rounded-2xl font-semibold text-lg transition-all active:scale-\[0\.98\] shadow-lg flex items-center justify-center gap-2 \$\{\s*agreed\s*\?\s*'bg-\[#FC5200\] text-white hover:bg-\[#FC5200\] shadow-\[#FC5200\]\/20'\s*:\s*'bg-stone-800 text-stone-500 cursor-not-allowed'\s*\}`\}/;

code = code.replace(
  btnRegex,
  'className={`w-full py-4 text-lg flex items-center justify-center gap-2 ${agreed ? PRIMARY_BUTTON : "bg-stone-800 text-stone-500 cursor-not-allowed rounded-xl"}`}'
);

// We'll wrap the content in a CARD
code = code.replace(
  '<div className="flex-1 flex flex-col bg-[#17181C] overflow-hidden">',
  '<div className="min-h-screen flex items-center justify-center bg-[#17181C] p-4 font-sans">'
);

code = code.replace(
  '<div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">',
  '<div className={`${CARD} w-full max-w-md p-8 sm:p-10 text-center flex flex-col items-center justify-center`}>'
);

// Remove the footer container since it's now all inside the card
code = code.replace(
  '<div className="p-6 bg-stone-900 border-t border-stone-800">',
  '<div className="mt-8 w-full">'
);

fs.writeFileSync('src/views/TermsGateView.tsx', code);
