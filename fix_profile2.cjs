const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

code = code.replace(
  'className="p-2 text-stone-400 hover:text-[#FC5200] hover:bg-emerald-50 rounded-full transition-all active:scale-95"',
  'className={`${ICON_BUTTON} relative`}'
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
