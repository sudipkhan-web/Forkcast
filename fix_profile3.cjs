const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

code = code.replace(/bg-red-50 /g, 'bg-red-500/10 ');
code = code.replace(/hover:bg-red-100/g, 'hover:bg-red-500/20');
code = code.replace(/border-red-200/g, 'border-red-500/20');

fs.writeFileSync('src/views/ProfileView.tsx', code);
