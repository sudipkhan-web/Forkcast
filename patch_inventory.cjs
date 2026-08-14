const fs = require('fs');
let code = fs.readFileSync('src/views/InventoryView.tsx', 'utf8');

const importRegex = /(import React[^;]*;)([\s\S]*?)import/;
code = code.replace(
  "import { Search, Plus, Trash2, ArrowRight, Minus, Flame, RefreshCcw, ArchiveX, Clock, Calendar as CalendarIcon, Tag, ShoppingCart } from 'lucide-react';",
  "import { Search, Plus, Trash2, ArrowRight, Minus, Flame, RefreshCcw, ArchiveX, Clock, Calendar as CalendarIcon, Tag, ShoppingCart } from 'lucide-react';\nimport { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL } from '../styles/designTokens';"
);

// row backgrounds -> CARD
code = code.replace(
  /className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col gap-2 shadow-sm"/g,
  'className={`${CARD} p-4 flex flex-col gap-2`}'
);
code = code.replace(
  /className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex items-start gap-4 shadow-sm"/g,
  'className={`${CARD} p-5 flex items-start gap-4`}'
);

fs.writeFileSync('src/views/InventoryView.tsx', code);
