const fs = require('fs');

function fixImports(file) {
  let code = fs.readFileSync(file, 'utf8');
  const duplicate = "import { ICON_BUTTON } from '../styles/designTokens';\n";
  if (code.includes(duplicate)) {
    code = code.replace(duplicate, "");
  }
  const duplicate2 = "import { ICON_BUTTON } from '../styles/designTokens';";
  if (code.includes(duplicate2)) {
    // only replace if there's multiple designTokens imports
    const match = code.match(/styles\/designTokens/g);
    if (match && match.length > 1) {
      code = code.replace(duplicate2, "");
    }
  }
  fs.writeFileSync(file, code);
}

fixImports('src/components/NotificationBell.tsx');

