const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

code = code.replace(/focus:ring-emerald-500\/20 focus:border-emerald-500/g, 'focus:ring-[#FC5200]/20 focus:border-[#FC5200]');
code = code.replace(/focus:ring-emerald-500 focus:border-emerald-500/g, 'focus:ring-[#FC5200] focus:border-[#FC5200]');

fs.writeFileSync('src/views/ProfileView.tsx', code);
