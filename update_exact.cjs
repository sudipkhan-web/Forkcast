const fs = require('fs');

function processShopView() {
  let file = 'src/views/ShopView.tsx';
  let code = fs.readFileSync(file, 'utf8');

  // "Add" button
  code = code.replace(
    /className="\w?[^"]*bg-\[#FC5200\] text-white px-5 py-3 rounded-xl font-medium[^"]*"/,
    'className={`${PRIMARY_BUTTON} px-5 py-3 disabled:opacity-50 text-sm`}'
  );

  code = code.replace(/\\\$\{/g, '${');
  fs.writeFileSync(file, code);
}

function processMealCard() {
  let file = 'src/components/MealCard.tsx';
  let code = fs.readFileSync(file, 'utf8');

  if (!code.includes("import { CARD, PRIMARY_BUTTON }")) {
    code = code.replace(
      "import { Meal } from '../data/recipes';",
      "import { Meal } from '../data/recipes';\nimport { CARD, PRIMARY_BUTTON } from '../styles/designTokens';"
    );
  }

  code = code.replace(
    /className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden flex flex-col[^"]*"/,
    'className={`${CARD} overflow-hidden flex flex-col`}'
  );

  code = code.replace(
    /className="w-full py-3\.5 bg-\[#FC5200\] text-white rounded-2xl font-semibold text-lg[^"]*"/,
    'className={`${PRIMARY_BUTTON} w-full py-3.5 flex items-center justify-center gap-2`}'
  );
  
  code = code.replace(/\\\$\{/g, '${');
  fs.writeFileSync(file, code);
}

function processHomeView() {
  let file = 'src/views/HomeView.tsx';
  let code = fs.readFileSync(file, 'utf8');

  if (!code.includes("import { CARD, ICON_BUTTON, PRIMARY_BUTTON }")) {
    code = code.replace(
      "import { NotificationBell } from '../components/NotificationBell';",
      "import { NotificationBell } from '../components/NotificationBell';\nimport { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';"
    );
  }

  code = code.replace(
    /className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2[^"]*"/,
    'className={`${PRIMARY_BUTTON} w-full py-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100`}'
  );

  // Today Panel
  code = code.replace(
    /className="bg-stone-900 border border-stone-800 rounded-\[32px\] p-8 relative overflow-hidden"/,
    'className={`${CARD} p-8 relative overflow-hidden`}'
  );

  // ICON BUTTONS (header)
  // profile: w-10 h-10 rounded-full overflow-hidden border-2 border-stone-800 shrink-0
  code = code.replace(
    /className="w-10 h-10 rounded-full overflow-hidden border-2 border-stone-800 shrink-0"/,
    'className={ICON_BUTTON}'
  );

  // Notification bell wrapper (let's check the code)
  // <NotificationBell ... /> doesn't have a wrapper in the same file unless it's a div.
  // Wait, NotificationBell itself might have a wrapper or we just replace the favorites button.
  
  // favorites button:
  code = code.replace(
    /className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-\[#FC5200\] hover:border-stone-700 transition-all shrink-0 relative"/,
    'className={`${ICON_BUTTON} relative shrink-0`}'
  );

  code = code.replace(/\\\$\{/g, '${');
  fs.writeFileSync(file, code);
}

try {
  processShopView();
  processMealCard();
  processHomeView();
} catch (e) {
  console.error(e);
}
