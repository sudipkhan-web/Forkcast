const fs = require('fs');

function patch(file, toastImport) {
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes("useToast")) {
    // find first import and put it before
    code = code.replace(/import /, toastImport + "\nimport ");
  }

  // Replace handleFirestoreError(x, y, z) with handleFirestoreError(x, y, z, showToast)
  code = code.replace(/handleFirestoreError\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g, "handleFirestoreError($1, $2, $3, showToast)");

  fs.writeFileSync(file, code);
}

patch('src/App.tsx', "import { useToast } from './components/Toast';");
patch('src/context/AppContext.tsx', "import { useToast } from '../components/Toast';");
patch('src/views/FavoritesView.tsx', "import { useToast } from '../components/Toast';");

