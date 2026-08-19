const ts = require('typescript');
const fs = require('fs');
const code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');
const sourceFile = ts.createSourceFile('HomeView.tsx', code, ts.ScriptTarget.Latest, true);
console.log("Statements:", sourceFile.statements.length);
console.log("Last statement end position:", sourceFile.statements[sourceFile.statements.length - 1].end);
console.log("Code length:", code.length);
