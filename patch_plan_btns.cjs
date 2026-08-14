const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// Favorites button (Star)
code = code.replace(
  /className="p-2 text-stone-400 hover:text-\[#FC5200\] transition-all active:scale-\[0\.98\] relative"/g,
  'className={`relative ${ICON_BUTTON}`}'
);

// PlusCircle button
code = code.replace(
  /className="p-1\.5 text-stone-400 hover:text-\[#FC5200\] hover:bg-emerald-50 rounded-full transition-all active:scale-95"/g,
  'className={`${ICON_BUTTON}`}'
);

// Trash2 (upcoming)
code = code.replace(
  /className="p-1\.5 text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"/g,
  'className={`opacity-0 group-hover:opacity-100 ${ICON_BUTTON} hover:text-red-500 hover:border-red-900/50`}'
);

// Trash2 (history)
code = code.replace(
  /className="p-1\.5 text-stone-400 hover:text-red-500 transition-all rounded-full hover:bg-red-50"/g,
  'className={`${ICON_BUTTON} hover:text-red-500 hover:border-red-900/50`}'
);

// Plan Again button - let's make it PRIMARY_BUTTON or PILL? "Replace any primary action buttons with PRIMARY_BUTTON."
// Since it's the main action on a history item, let's use PRIMARY_BUTTON but with small padding.
// Wait, the prompt says "Replace any primary action buttons with PRIMARY_BUTTON".
// Previously, Plan Again was:
// className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-[#FC5200] hover:bg-emerald-200 text-xs font-medium rounded-full transition-colors mr-2"
// Replacing with PRIMARY_BUTTON:
code = code.replace(
  /className="flex items-center gap-1\.5 px-3 py-1\.5 bg-emerald-100 text-\[#FC5200\] hover:bg-emerald-200 text-xs font-medium rounded-full transition-colors mr-2"/g,
  'className={`flex items-center gap-1.5 px-3 py-1.5 text-xs mr-2 ${PRIMARY_BUTTON} rounded-full`}'
);

fs.writeFileSync('src/views/PlanView.tsx', code);
