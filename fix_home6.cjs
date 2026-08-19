const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// There is some trailing character or unmatched bracket at the very end of the file.
// Let's strip anything after the final `}`
const lastBrace = code.lastIndexOf('}');
if (lastBrace !== -1) {
    code = code.substring(0, lastBrace + 1) + "\n";
}

fs.writeFileSync('src/views/HomeView.tsx', code);
