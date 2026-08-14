const fs = require('fs');
let code = fs.readFileSync('src/views/InventoryView.tsx', 'utf8');

code = code.replace(
  /className="p-2 text-stone-400 hover:text-\[#FC5200\] transition-all active:scale-\[0\.98\] relative"/g,
  'className={`relative ${ICON_BUTTON}`}'
);

fs.writeFileSync('src/views/InventoryView.tsx', code);
