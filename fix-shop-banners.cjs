const fs = require('fs');
let content = fs.readFileSync('src/views/ShopView.tsx', 'utf8');
content = content.replace(/bg-emerald-50/g, 'bg-emerald-500/10');
content = content.replace(/border-emerald-100/g, 'border-emerald-500/20');
content = content.replace(/bg-emerald-100/g, 'bg-emerald-500/20');
content = content.replace(/text-emerald-800/g, 'text-emerald-400');
content = content.replace(/text-emerald-700/g, 'text-emerald-400');

content = content.replace(/bg-amber-50/g, 'bg-amber-500/10');
content = content.replace(/border-amber-100/g, 'border-amber-500/20');
content = content.replace(/bg-amber-100/g, 'bg-amber-500/20');
content = content.replace(/text-amber-800/g, 'text-amber-400');
content = content.replace(/text-amber-700/g, 'text-amber-400');

fs.writeFileSync('src/views/ShopView.tsx', content);
