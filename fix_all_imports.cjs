const fs = require('fs');

const files = [
  'src/views/FavoritesView.tsx',
  'src/views/InventoryView.tsx',
  'src/views/PlanView.tsx',
  'src/views/ProfileView.tsx',
  'src/views/ProgressView.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes("import { CARD")) {
    const reactImportMatch = code.match(/import React[^;]*;/);
    if (reactImportMatch) {
      code = code.replace(
        reactImportMatch[0],
        reactImportMatch[0] + "\nimport { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER } from '../styles/designTokens';"
      );
      fs.writeFileSync(file, code);
      console.log(`Patched imports in ${file}`);
    }
  }
}
