const fs = require('fs');
let code = fs.readFileSync('src/components/OrderModal.tsx', 'utf8');

const importRegex = /(import React[^;]*;)([\s\S]*?)import/;
code = code.replace(
  "import { X, ShoppingCart, Package, Store, ChevronLeft, Check } from 'lucide-react';",
  "import { X, ShoppingCart, Package, Store, ChevronLeft, Check } from 'lucide-react';\nimport { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';"
);

// Replace modal panel background
code = code.replace(
  'className="bg-stone-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"',
  'className={`${CARD} w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden`}'
);

// Header background
code = code.replace(
  'className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-900"',
  'className="p-6 border-b border-stone-800 flex items-center justify-between"'
);

// Close button
code = code.replace(
  'className="p-2 text-stone-400 hover:text-stone-400 hover:bg-stone-700/50 rounded-full transition-all active:scale-95"',
  'className={`${ICON_BUTTON}`}'
);

// Primary action buttons
code = code.replace(
  'className="w-full py-4 bg-[#FC5200] text-white rounded-2xl font-semibold text-lg hover:bg-[#FC5200] transition-all active:scale-[0.98] shadow-lg shadow-[#FC5200]/20"',
  'className={`${PRIMARY_BUTTON} w-full py-4 text-lg`}'
);

code = code.replace(
  'className="w-full py-4 bg-[#FC5200] text-white rounded-2xl font-semibold hover:bg-[#FC5200] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"',
  'className={`${PRIMARY_BUTTON} w-full py-4 flex items-center justify-center gap-2`}'
);

fs.writeFileSync('src/components/OrderModal.tsx', code);
