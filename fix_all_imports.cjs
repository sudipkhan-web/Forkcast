const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const missingImports = `import { createServer as createViteServer } from "vite";\nimport path from "path";\n`;

code = missingImports + code;

fs.writeFileSync('server.ts', code);
