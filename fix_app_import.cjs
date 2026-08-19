const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Ensure Toaster is properly imported
if (!code.includes("import { Toaster } from 'react-hot-toast'")) {
  code = "import { Toaster } from 'react-hot-toast';\n" + code;
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed Toaster import");
}
