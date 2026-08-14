const fs = require('fs');
let code = fs.readFileSync('src/views/FavoritesView.tsx', 'utf8');

code = code.replace(
  /className="p-2 -ml-2 text-stone-400 hover:text-white transition-all active:scale-95"/g,
  'className={`${ICON_BUTTON} -ml-2`}'
);

fs.writeFileSync('src/views/FavoritesView.tsx', code);
