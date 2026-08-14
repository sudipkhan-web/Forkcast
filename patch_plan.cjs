const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// Imports
const importRegex = /(import React[^;]*;)([\s\S]*?)import/;
code = code.replace(
  "import { Calendar, Trash2, ArrowRight, Activity, Clock, Flame, Image as ImageIcon, ChevronRight, Share, Plus, CalendarPlus, Search, Utensils } from 'lucide-react';",
  "import { Calendar, Trash2, ArrowRight, Activity, Clock, Flame, Image as ImageIcon, ChevronRight, Share, Plus, CalendarPlus, Search, Utensils } from 'lucide-react';\nimport { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';"
);

// Planned-meal row/card background (CARD)
code = code.replace(
  /className="bg-stone-900 rounded-2xl border border-stone-800 shadow-sm overflow-hidden"/g,
  'className={`${CARD} overflow-hidden`}'
);
code = code.replace(
  /className="bg-stone-900 rounded-2xl border border-stone-800 shadow-sm overflow-hidden opacity-90"/g,
  'className={`${CARD} overflow-hidden opacity-90`}'
);

// We should check icon-only buttons
// Icon only buttons in PlanView... Let's review them first
fs.writeFileSync('src/views/PlanView.tsx', code);
