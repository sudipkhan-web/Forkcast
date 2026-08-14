const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

code = code.replace(
  'className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-sm"',
  'className={`${CARD} overflow-hidden`}'
);

code = code.replace(
  'className="bg-stone-900 border border-stone-800/80 rounded-2xl p-5"',
  'className={`${CARD} p-5`}'
);

code = code.replace(
  'className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm relative overflow-hidden"',
  'className={`${CARD} p-6 relative overflow-hidden`}'
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
