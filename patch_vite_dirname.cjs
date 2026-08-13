const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf-8');
content = content.replace(/__dirname/g, 'import.meta.dirname');
fs.writeFileSync('vite.config.ts', content);
