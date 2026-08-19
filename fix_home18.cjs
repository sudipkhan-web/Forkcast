const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// Notice the double `}}` at the very end of the file.
// Let's replace `}}` with `}` at the end.
if (code.endsWith("}\n}")) {
   code = code.substring(0, code.length - 2) + "}";
} else if (code.endsWith("}}")) {
   code = code.substring(0, code.length - 2) + "}";
} else if (code.endsWith("}\n}\n")) {
   code = code.substring(0, code.length - 3) + "}\n";
}

fs.writeFileSync('src/views/HomeView.tsx', code);
