const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

code = code.replace(
  /import {([^}]+)} from 'lucide-react';/,
  (match, p1) => {
    if (p1.includes('ChevronRight')) return match;
    return `import {${p1}, ChevronRight} from 'lucide-react';`;
  }
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
console.log("Import fixed");
