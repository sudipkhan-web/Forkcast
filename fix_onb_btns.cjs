const fs = require('fs');
let code = fs.readFileSync('src/views/OnboardingView.tsx', 'utf8');

// Step 1
const step1old = "className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${";
const step1oldFullRegex = /className=\{`w-full py-4 rounded-2xl font-semibold text-lg transition-all active:scale-\[0\.98\] shadow-lg flex items-center justify-center gap-2 \$\{\s*household\.length > 0\s*\?\s*'bg-\[#FC5200\] text-white hover:bg-\[#FC5200\] shadow-\[#FC5200\]\/20'\s*:\s*'bg-stone-200 text-stone-400 cursor-not-allowed'\s*\}`\}/;

code = code.replace(
  step1oldFullRegex,
  'className={`${PRIMARY_BUTTON} w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-stone-800 disabled:text-stone-500`}'
);

// Step 2 & 3
const step23Regex = /className="w-full py-4 rounded-2xl font-semibold text-lg transition-all active:scale-\[0\.98\] shadow-lg bg-\[#FC5200\] text-white hover:bg-\[#FC5200\] shadow-\[#FC5200\]\/20 flex items-center justify-center gap-2"/g;
code = code.replace(
  step23Regex,
  'className={`${PRIMARY_BUTTON} w-full py-4 text-lg flex items-center justify-center gap-2`}'
);

// Step 4
const step4Regex = /className=\{`w-full py-4 rounded-2xl font-semibold text-lg transition-all active:scale-\[0\.98\] shadow-lg flex items-center justify-center gap-2 \$\{\s*agreed\s*\?\s*'bg-\[#FC5200\] text-white hover:bg-\[#FC5200\] shadow-\[#FC5200\]\/20'\s*:\s*'bg-stone-800 text-stone-500 cursor-not-allowed'\s*\}`\}/;

code = code.replace(
  step4Regex,
  'className={`w-full py-4 text-lg flex items-center justify-center gap-2 ${agreed ? PRIMARY_BUTTON : "bg-stone-800 text-stone-500 cursor-not-allowed rounded-xl"}`}'
);

// Replace PILLs for pantry step
const pillRegex = /className=\{`px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 flex items-center gap-2 border \$\{\s*isSelected\s*\?\s*'bg-\[#FC5200\] border-\[#FC5200\] text-white shadow-md shadow-\[#FC5200\]\/20'\s*:\s*'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-300'\s*\}`\}/;
code = code.replace(
  pillRegex,
  "className={isSelected ? 'px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 flex items-center gap-2 border bg-[#FC5200] border-[#FC5200] text-white shadow-md shadow-[#FC5200]/20' : `${PILL} flex items-center gap-2`}"
);

code = code.replace(/\\\$\{/g, '${');
fs.writeFileSync('src/views/OnboardingView.tsx', code);
