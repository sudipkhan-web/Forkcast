const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// Replace standard icon button classes
const oldIconBtn = 'className="p-2 text-stone-400 hover:text-[#FC5200] transition-all active:scale-[0.98] relative"';
const newIconBtn = 'className={`${ICON_BUTTON} relative`}';
code = code.split(oldIconBtn).join(newIconBtn);

fs.writeFileSync('src/views/HomeView.tsx', code);
