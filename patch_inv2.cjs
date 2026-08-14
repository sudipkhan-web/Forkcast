const fs = require('fs');
let code = fs.readFileSync('src/views/InventoryView.tsx', 'utf8');

// Category filter chips / dynamicQuickAddItems
const pillRegex = /className=\{`px-3 py-1\.5 rounded-lg text-xs font-medium transition-all active:scale-95 border \$\{\s*isSelected\s*\?\s*'bg-emerald-50 border-emerald-200 text-\[#FC5200\] opacity-50 cursor-not-allowed'\s*:\s*'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-300 hover:bg-stone-900'\s*\}`\}/;

code = code.replace(
  pillRegex,
  "className={isSelected ? 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 border bg-emerald-50 border-emerald-200 text-[#FC5200] opacity-50 cursor-not-allowed' : `${PILL}`}"
);

// Add primary button to "Add ingredient" submit button
code = code.replace(
  /className="bg-\[#FC5200\] text-white p-3 rounded-xl disabled:opacity-50 hover:bg-\[#FC5200\] transition-all active:scale-\[0\.98\] shadow-sm flex items-center justify-center"/g,
  'className={`${PRIMARY_BUTTON} p-3 disabled:opacity-50`}'
);

// Delete button
code = code.replace(
  /className="p-1\.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-\[0\.98\]"/g,
  'className={`${ICON_BUTTON} hover:text-red-600 hover:bg-red-50`}'
);

fs.writeFileSync('src/views/InventoryView.tsx', code);
