const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');

const regex = /if \(typeof window !== 'undefined'\) \{[\s\S]*?\}\s*import {StrictMode}/;
code = code.replace(regex, "import {StrictMode}");

fs.writeFileSync('src/main.tsx', code);
