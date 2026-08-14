const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');
code = code.replace(/\\\$\{/g, '${');
fs.writeFileSync('src/views/ShopView.tsx', code);
