const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

if (!code.includes("import { CARD, ICON_BUTTON, PRIMARY_BUTTON }")) {
  code = code.replace(
    "import { Settings, Plus, X, Share, KeyRound, Copy, LogOut, Check, Users, ChefHat, Dumbbell, Leaf, HelpCircle, MapPin, Search } from 'lucide-react';",
    "import { Settings, Plus, X, Share, KeyRound, Copy, LogOut, Check, Users, ChefHat, Dumbbell, Leaf, HelpCircle, MapPin, Search } from 'lucide-react';\nimport { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';"
  );
}

// 1. Household member row/card
// <div key={person.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
code = code.replace(
  /className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm flex items-center justify-between"/g,
  'className={`${CARD} p-5 flex items-center justify-between`}'
);

// Any other "bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-sm" which are sections/cards?
// Yes, there are several section cards: "flex items-center justify-between bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm"
code = code.replace(
  /className="flex items-center justify-between bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm"/g,
  'className={`flex items-center justify-between ${CARD} p-6`}'
);
code = code.replace(
  /className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm"/g,
  'className={`${CARD} p-6`}'
);
code = code.replace(
  /className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-sm flex flex-col gap-4"/g,
  'className={`${CARD} p-6 flex flex-col gap-4`}'
);


// 2. Save/Confirm buttons:
// "Done" button for edit group
code = code.replace(
  /className="text-sm font-medium bg-emerald-50 text-\[#FC5200\] hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all active:scale-\[0\.98\]"/g,
  'className={`${PRIMARY_BUTTON} px-4 py-2 text-sm`}'
);
// The other "Done" button
// The "Add" buttons:
code = code.replace(
  /className="bg-stone-900 border border-stone-800 text-stone-300 px-5 py-2\.5 rounded-xl text-sm font-medium hover:bg-stone-900 active:scale-\[0\.98\] transition-all shadow-sm"/g,
  'className={`${PRIMARY_BUTTON} px-5 py-2.5 text-sm`}'
);
// The "Add" button for new person?
code = code.replace(
  /className="w-full bg-\[#17181C\] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-stone-800 border-dashed hover:bg-stone-900 transition-colors"/g,
  'className="w-full bg-[#17181C] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-stone-800 border-dashed hover:bg-stone-900 transition-colors"'
  // This is a dashed "+ Add Household Member", not a primary confirm button, so skip.
);
// Sign out button? It says "Replace any save/confirm buttons", sign out is not save/confirm.

// 3. Small icon-only buttons (edit, delete, chevron/expand toggles) -> ICON_BUTTON
// Edit person button
code = code.replace(
  /className="text-sm font-medium text-stone-400 hover:text-white px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-xl transition-all active:scale-\[0\.98\]"\s*>\s*Edit/g,
  'className={`${ICON_BUTTON}`}>\n                      <Settings className="w-4 h-4" />' // wait, it was text "Edit". The prompt says "icon-only buttons (edit, delete)". Let's see if it has text.
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
