const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// There are duplicate declarations of `scannedMealPreview` state.
// We can just remove the exact string `  const [scannedMealPreview, setScannedMealPreview] = React.useState<any | null>(null);\n`
code = code.replace("  const [scannedMealPreview, setScannedMealPreview] = React.useState<any | null>(null);\n", "");

fs.writeFileSync('src/views/HomeView.tsx', code);
