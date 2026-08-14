const fs = require('fs');

function applyToShopView() {
  let file = 'src/views/ShopView.tsx';
  let code = fs.readFileSync(file, 'utf8');

  // Replace Add button classes
  // The current Add button is something like:
  // className="bg-[#FC5200] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#FC5200] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 text-sm"
  const addBtnMatch = code.match(/className="bg-\[#FC5200\] text-white px-5 py-3 rounded-xl font-medium hover:bg-\[#FC5200\] active:scale-\[0\.98\] transition-all shadow-sm disabled:opacity-50 text-sm"/);
  if (addBtnMatch) {
    code = code.replace(
      addBtnMatch[0],
      'className={`${PRIMARY_BUTTON} px-5 py-3 disabled:opacity-50 text-sm`}'
    );
  } else {
    console.log("Could not find Add button in ShopView.tsx");
  }

  // Remove any remaining backslash before ${
  code = code.replace(/\\\$\{/g, '${');
  fs.writeFileSync(file, code);
}

function applyToMealCard() {
  let file = 'src/components/MealCard.tsx';
  let code = fs.readFileSync(file, 'utf8');

  if (!code.includes("import { CARD, PRIMARY_BUTTON }")) {
    code = code.replace(
      "import { Meal } from '../data/recipes';",
      "import { Meal } from '../data/recipes';\nimport { CARD, PRIMARY_BUTTON } from '../styles/designTokens';"
    );
  }

  // Card outer container
  // className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden flex flex-col shadow-sm"
  const outerContainerMatch = code.match(/className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden flex flex-col shadow-sm"/);
  if (outerContainerMatch) {
    code = code.replace(
      outerContainerMatch[0],
      'className={`${CARD} overflow-hidden flex flex-col`}'
    );
  } else {
    // try another match for outer container
    const altOuterContainerMatch = code.match(/className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden flex flex-col/);
    if (altOuterContainerMatch) {
        code = code.replace(
            altOuterContainerMatch[0],
            'className={`${CARD} overflow-hidden flex flex-col'
        );
    } else {
      console.log("Could not find MealCard outer container");
    }
  }
  
  // "View Recipe" button
  // className="w-full bg-[#FC5200] text-white py-3 rounded-2xl font-semibold hover:bg-[#FC5200] transition-colors active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
  const btnMatch = code.match(/className="w-full bg-\[#FC5200\] text-white py-3 rounded-2xl font-semibold hover:bg-\[#FC5200\] transition-colors active:scale-\[0\.98\] shadow-sm flex items-center justify-center gap-2"/);
  if (btnMatch) {
    code = code.replace(
      btnMatch[0],
      'className={`${PRIMARY_BUTTON} w-full py-3 flex items-center justify-center gap-2`}'
    );
  } else {
    console.log("Could not find View Recipe button");
  }

  code = code.replace(/\\\$\{/g, '${');
  fs.writeFileSync(file, code);
}

function applyToHomeView() {
  let file = 'src/views/HomeView.tsx';
  let code = fs.readFileSync(file, 'utf8');

  if (!code.includes("import { CARD, ICON_BUTTON, PRIMARY_BUTTON }")) {
    code = code.replace(
      "import { NotificationBell } from '../components/NotificationBell';",
      "import { NotificationBell } from '../components/NotificationBell';\nimport { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';"
    );
  }

  // Generate More Recipes button
  // className="mt-8 mx-auto flex items-center gap-2 bg-[#FC5200] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#FC5200] transition-all active:scale-95 shadow-lg shadow-[#FC5200]/20"
  const generateBtnMatch = code.match(/className="mt-8 mx-auto flex items-center gap-2 bg-\[#FC5200\] text-white px-6 py-3 rounded-full font-semibold hover:bg-\[#FC5200\] transition-all active:scale-95 shadow-lg shadow-\[#FC5200\]\/20"/);
  if (generateBtnMatch) {
    code = code.replace(
      generateBtnMatch[0],
      'className={`${PRIMARY_BUTTON} mt-8 mx-auto flex items-center gap-2 px-6 py-3`}'
    );
  } else {
    console.log("Could not find Generate More Recipes button");
  }

  // Today Panel
  // className="bg-stone-900 border border-stone-800 rounded-[32px] p-8 relative overflow-hidden"
  const todayPanelMatch = code.match(/className="bg-stone-900 border border-stone-800 rounded-\[32px\] p-8 relative overflow-hidden"/);
  if (todayPanelMatch) {
    code = code.replace(
      todayPanelMatch[0],
      'className={`${CARD} p-8 relative overflow-hidden`}'
    );
  } else {
    console.log("Could not find Today Panel");
  }

  // ICON BUTTONS
  // header profile
  const profileMatch = code.match(/className="w-10 h-10 rounded-full overflow-hidden border-2 border-stone-800 shrink-0"/);
  if (profileMatch) {
    // Wait, profile icon might be an img in a button, or just a button.
    // The prompt says "Replace the header icon buttons (profile, notification bell wrapper, favorites) with ICON_BUTTON"
    // Let's replace only the class of the wrapper
    // We should probably just replace the class strings directly if they match certain patterns.
  }

  code = code.replace(/\\\$\{/g, '${');
  fs.writeFileSync(file, code);
}

try {
  applyToShopView();
  applyToMealCard();
  applyToHomeView();
} catch (e) {
  console.error(e);
}
