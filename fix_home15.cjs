const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// There's a duplicate `};` at line 205 splitting the `handleConfirmMealPhoto` in half.
// Let's remove the extra `};` and the empty lines around it.

code = code.replace("  };\n\n\n      \n      await setDoc(logRef, {", "      await setDoc(logRef, {");

fs.writeFileSync('src/views/HomeView.tsx', code);
