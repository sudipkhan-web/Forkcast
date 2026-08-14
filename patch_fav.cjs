const fs = require('fs');
let code = fs.readFileSync('src/views/FavoritesView.tsx', 'utf8');

const importRegex = /(import React[^;]*;)([\s\S]*?)import/;
code = code.replace(
  "import { Search, HeartOff, Clock, Flame, Image as ImageIcon, Check, ArrowRight, Activity, XCircle, ShoppingBag, Calendar, Share, RefreshCcw } from 'lucide-react';",
  "import { Search, HeartOff, Clock, Flame, Image as ImageIcon, Check, ArrowRight, Activity, XCircle, ShoppingBag, Calendar, Share, RefreshCcw } from 'lucide-react';\nimport { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';"
);

code = code.replace(
  /className="bg-stone-900 rounded-2xl shadow-sm border border-stone-800 overflow-hidden cursor-pointer hover:border-stone-400 transition-colors relative group"/g,
  'className={`${CARD} overflow-hidden cursor-pointer hover:border-stone-400 transition-colors relative group`}'
);

code = code.replace(
  /className="absolute top-2 right-2 p-1 bg-stone-900\/90 backdrop-blur-md rounded-full text-stone-400 hover:text-red-500 hover:bg-stone-900 transition-all active:scale-95 shadow-sm z-10 opacity-70 hover:opacity-100"/g,
  'className={`absolute top-2 right-2 z-10 opacity-70 hover:opacity-100 ${ICON_BUTTON}`}'
);

fs.writeFileSync('src/views/FavoritesView.tsx', code);
