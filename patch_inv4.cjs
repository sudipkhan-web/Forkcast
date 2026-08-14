const fs = require('fs');
let code = fs.readFileSync('src/views/InventoryView.tsx', 'utf8');

code = code.replace(
  "className={isSelected ? 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 border bg-emerald-50 border-emerald-200 text-[#FC5200] opacity-50 cursor-not-allowed' : `${PILL}`}",
  "className={isSelected ? 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 border bg-[#FC5200]/15 border-[#FC5200]/40 text-[#FC5200] opacity-50 cursor-not-allowed' : `${PILL}`}"
);

code = code.replace(
  /hover:bg-red-50/g,
  "hover:bg-red-500/10"
);

fs.writeFileSync('src/views/InventoryView.tsx', code);
