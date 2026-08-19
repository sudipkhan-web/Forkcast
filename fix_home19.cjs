const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// There's an extra `}` at the end of the file.
if (code.endsWith("}\n}\n")) {
   code = code.substring(0, code.length - 2);
} else if (code.endsWith("}\n}")) {
   code = code.substring(0, code.length - 2);
} else if (code.endsWith("}\n\n}")) {
   code = code.substring(0, code.length - 3);
}

fs.writeFileSync('src/views/HomeView.tsx', code);
