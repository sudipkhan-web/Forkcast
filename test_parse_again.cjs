const ts = require('typescript');
const fs = require('fs');

const code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');
const sourceFile = ts.createSourceFile('HomeView.tsx', code, ts.ScriptTarget.Latest, true);

const diagnostics = sourceFile.parseDiagnostics;
if (diagnostics.length > 0) {
    diagnostics.forEach(diag => {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start);
        console.log(`Error at line ${line + 1}, col ${character + 1}: ${diag.messageText}`);
    });
} else {
    console.log("No parse errors.");
}
