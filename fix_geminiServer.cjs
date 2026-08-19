const fs = require('fs');
let code = fs.readFileSync('src/services/geminiServer.ts', 'utf8');

// The error is `const text = response.text();` -> `response.text` is a property/getter in this SDK sometimes, 
// wait, the error says "This expression is not callable because it is a 'get' accessor".
// Yes, in `@google/genai` it's `response.text` instead of `response.text()`

code = code.replace(
  "const text = response.text();",
  "const text = response.text;"
);

fs.writeFileSync('src/services/geminiServer.ts', code);
console.log("Fixed text accessor");
