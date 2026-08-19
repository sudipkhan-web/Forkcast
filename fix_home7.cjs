const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// If there's an extra bracket missing, let's just append it.
code += "\n}";

fs.writeFileSync('src/views/HomeView.tsx', code);
