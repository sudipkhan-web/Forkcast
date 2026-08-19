const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('Toaster')) {
  code = code.replace(
    /import \{ AppProvider \} from '\.\/context\/AppContext';/,
    "import { AppProvider } from './context/AppContext';\nimport { Toaster } from 'react-hot-toast';"
  );
  
  code = code.replace(
    /<AppProvider>/,
    "<AppProvider>\n      <Toaster position=\"top-center\" toastOptions={{ style: { background: '#1C1C1E', color: '#fff' } }} />"
  );
  fs.writeFileSync('src/App.tsx', code);
  console.log("Added Toaster to App.tsx");
}
