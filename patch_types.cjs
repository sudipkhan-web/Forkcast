const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  "biologicalSex?: 'male' | 'female';",
  "biologicalSex?: 'male' | 'female';\n  trackedSupplements?: string[];"
);

fs.writeFileSync('src/types.ts', code);
console.log("Updated types.ts");
