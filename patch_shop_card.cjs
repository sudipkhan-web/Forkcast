const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');

code = code.replace(
  "className=\"absolute top-full left-0 right-0 mt-1 bg-stone-800 border border-stone-700 rounded-lg shadow-xl overflow-hidden z-20\"",
  "className={`absolute top-full left-0 right-0 mt-2 ${CARD} z-20`}"
);

fs.writeFileSync('src/views/ShopView.tsx', code);
