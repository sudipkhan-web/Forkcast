const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replaceAll("slice(0, 50)", "slice(0, 20)");

fs.writeFileSync('src/App.tsx', code);
