const fs = require('fs');
let code = fs.readFileSync('src/views/MealDetailsView.tsx', 'utf8');

if (!code.includes("import { PRIMARY_BUTTON, SECONDARY_BUTTON }")) {
  code = code.replace("import { RecipeImage } from '../components/RecipeImage';", "import { RecipeImage } from '../components/RecipeImage';\nimport { PRIMARY_BUTTON, SECONDARY_BUTTON } from '../styles/designTokens';");
}

code = code.replace(
  /className="w-full py-4 bg-stone-900 text-white rounded-2xl font-semibold text-lg hover:bg-stone-800 transition-all active:scale-\[0\.98\] shadow-lg shadow-stone-900\/20 flex items-center justify-center gap-2"/g,
  'className={`${SECONDARY_BUTTON} w-full py-3 text-sm flex items-center justify-center gap-2`}'
);

code = code.replace(
  /className="w-full py-4 bg-orange-500 text-white rounded-2xl font-semibold text-lg hover:bg-orange-600 transition-all active:scale-\[0\.98\] shadow-lg shadow-orange-500\/20 flex items-center justify-center gap-2"/g,
  'className={`${PRIMARY_BUTTON} w-full py-3 text-sm flex items-center justify-center gap-2`}'
);

code = code.replace(
  /<ChefHat className="w-5 h-5" \/>/g,
  '<Flame className="w-5 h-5" />'
);

code = code.replace(
  /className="w-full py-4 bg-\[#FC5200\] text-white rounded-2xl font-semibold text-lg hover:bg-\[#FC5200\] transition-all active:scale-\[0\.98\] shadow-lg shadow-\[#FC5200\]\/20 mt-3"/g,
  'className={`${PRIMARY_BUTTON} w-full py-3 text-sm mt-3`}'
);

fs.writeFileSync('src/views/MealDetailsView.tsx', code);
console.log("Patched MealDetailsView.tsx");
