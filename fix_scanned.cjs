const fs = require('fs');
let code = fs.readFileSync('src/components/ScannedItemsModal.tsx', 'utf8');
code = code.replace(/hover:bg-red-50/g, 'hover:bg-red-500/10');
fs.writeFileSync('src/components/ScannedItemsModal.tsx', code);
