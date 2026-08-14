const fs = require('fs');

function addImports(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes("import { CARD")) {
    const reactImportMatch = code.match(/import React[^;]*;/);
    if (reactImportMatch) {
      code = code.replace(
        reactImportMatch[0],
        reactImportMatch[0] + "\nimport { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';"
      );
      fs.writeFileSync(file, code);
    }
  }
}

['src/components/PlanModal.tsx', 'src/components/ShareModal.tsx', 'src/components/ScannedItemsModal.tsx', 'src/components/NotificationBell.tsx'].forEach(addImports);

// PlanModal
let pm = fs.readFileSync('src/components/PlanModal.tsx', 'utf8');
pm = pm.replace(
  'className="bg-stone-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"',
  'className={`${CARD} w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden`}'
);
pm = pm.replace(
  'className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-900"',
  'className="p-6 border-b border-stone-800 flex items-center justify-between"'
);
pm = pm.replace(
  'className="p-2 text-stone-400 hover:text-stone-400 hover:bg-stone-700/50 rounded-full transition-all active:scale-95"',
  'className={`${ICON_BUTTON}`}'
);
pm = pm.replace(
  'className="w-full py-3.5 bg-[#FC5200] text-white rounded-2xl font-semibold text-lg hover:bg-[#FC5200] transition-all active:scale-[0.98] shadow-lg shadow-[#FC5200]/20 disabled:opacity-50 disabled:active:scale-100"',
  'className={`${PRIMARY_BUTTON} w-full py-3.5 text-lg disabled:opacity-50 disabled:active:scale-100`}'
);
fs.writeFileSync('src/components/PlanModal.tsx', pm);

// ShareModal
let sm = fs.readFileSync('src/components/ShareModal.tsx', 'utf8');
sm = sm.replace(
  'className="bg-stone-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"',
  'className={`${CARD} w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden`}'
);
sm = sm.replace(
  'className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-900"',
  'className="p-6 border-b border-stone-800 flex items-center justify-between"'
);
sm = sm.replace(
  'className="p-2 text-stone-400 hover:text-stone-400 hover:bg-stone-700/50 rounded-full transition-all active:scale-95"',
  'className={`${ICON_BUTTON}`}'
);
sm = sm.replace(
  'className="w-full py-4 bg-[#FC5200] text-white rounded-2xl font-semibold text-lg hover:bg-[#FC5200] transition-all active:scale-[0.98] shadow-lg shadow-[#FC5200]/20 flex items-center justify-center gap-2"',
  'className={`${PRIMARY_BUTTON} w-full py-4 text-lg flex items-center justify-center gap-2`}'
);
fs.writeFileSync('src/components/ShareModal.tsx', sm);

// ScannedItemsModal
let sim = fs.readFileSync('src/components/ScannedItemsModal.tsx', 'utf8');
sim = sim.replace(
  'className="bg-[#17181C] w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"',
  'className={`${CARD} w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"}' // wait, quote inside
);
// Fix the quote:
sim = sim.replace(
  '${CARD} w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"}',
  '${CARD} w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]`}'
);

sim = sim.replace(
  'className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900 shrink-0"',
  'className="px-6 py-4 border-b border-stone-800 flex items-center justify-between shrink-0"'
);
sim = sim.replace(
  'className="p-2 text-stone-400 hover:text-stone-400 hover:bg-stone-800 rounded-full transition-colors"',
  'className={`${ICON_BUTTON}`}'
);
// Scanned item row
sim = sim.replace(
  /className="bg-stone-900 border border-stone-800 rounded-xl p-3 flex flex-col gap-3 shadow-sm"/g,
  'className={`${CARD} p-3 flex flex-col gap-3 shadow-sm`}'
);

// Plus/Minus/Remove
sim = sim.replace(
  'className="flex items-center bg-stone-900 rounded-lg border border-stone-800 p-1"',
  'className="flex items-center gap-1"'
);
sim = sim.replace(
  /className="p-1 text-stone-400 hover:text-white transition-all active:scale-\[0\.98\]"/g,
  'className={`${ICON_BUTTON}`}'
);
sim = sim.replace(
  'className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all"',
  'className={`${ICON_BUTTON} hover:text-red-600 hover:bg-red-500/10`}'
);
// Footer quick add submit
sim = sim.replace(
  'className="bg-stone-800 text-white p-2 px-3 rounded-xl disabled:opacity-50 hover:bg-stone-900 flex items-center justify-center transition-all"',
  'className={`${ICON_BUTTON} disabled:opacity-50`}'
);
// Footer bg
sim = sim.replace(
  'className="p-6 bg-stone-900 border-t border-stone-800 shrink-0"',
  'className="p-6 border-t border-stone-800 shrink-0"'
);
// Confirm button
sim = sim.replace(
  'className="w-full py-4 bg-[#FC5200] text-white rounded-2xl font-semibold text-lg hover:bg-[#FC5200] transition-all active:scale-[0.98] shadow-lg shadow-[#FC5200]/20 flex items-center justify-center gap-2"',
  'className={`${PRIMARY_BUTTON} w-full py-4 text-lg flex items-center justify-center gap-2`}'
);
fs.writeFileSync('src/components/ScannedItemsModal.tsx', sim);

// NotificationBell
let nb = fs.readFileSync('src/components/NotificationBell.tsx', 'utf8');
nb = nb.replace(
  'className="absolute right-0 mt-2 w-80 bg-stone-900 rounded-2xl shadow-xl border border-stone-800 z-50 overflow-hidden"',
  'className={`absolute right-0 mt-2 w-80 z-50 overflow-hidden ${CARD}`}'
);
nb = nb.replace(
  'className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-900/50"',
  'className="p-4 border-b border-stone-800 flex items-center justify-between"'
);
nb = nb.replace(
  'className="text-stone-400 hover:text-stone-400"',
  'className={`${ICON_BUTTON}`}'
);
nb = nb.replace(
  'className="w-6 h-6 rounded-full bg-stone-800 hover:bg-emerald-100 text-stone-400 hover:text-[#FC5200] flex items-center justify-center shrink-0 transition-colors"',
  'className={`shrink-0 ${ICON_BUTTON}`}'
);
// Fix the row borders
nb = nb.replace(
  /border-stone-100/g,
  'border-stone-800'
);
fs.writeFileSync('src/components/NotificationBell.tsx', nb);

