const fs = require('fs');
let code = fs.readFileSync('src/components/MealCard.tsx', 'utf8');

code = code.replace(
  /className="relative bg-stone-900 rounded-\[28px\] shadow-xl border border-stone-800 flex flex-col cursor-pointer touch-pan-y overflow-hidden"/,
  'className={`${CARD} relative flex flex-col cursor-pointer touch-pan-y overflow-hidden`}'
);

fs.writeFileSync('src/components/MealCard.tsx', code);
