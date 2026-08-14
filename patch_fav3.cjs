const fs = require('fs');
let code = fs.readFileSync('src/views/FavoritesView.tsx', 'utf8');

if (!code.includes("import { CARD")) {
  code = code.replace(
    "import { ChevronLeft, Star, XCircle, Clock } from 'lucide-react';",
    "import { ChevronLeft, Star, XCircle, Clock } from 'lucide-react';\nimport { CARD, ICON_BUTTON } from '../styles/designTokens';"
  );
  fs.writeFileSync('src/views/FavoritesView.tsx', code);
}
