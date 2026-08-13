const fs = require('fs');
let content = fs.readFileSync('src/components/MealCard.tsx', 'utf-8');

const oldMacros = `          {(meal.calories || meal.proteinGrams || meal.carbsGrams || meal.fatGrams) && (
            <div className="flex items-center gap-3">
              {meal.calories && (
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-mono font-bold text-white">{meal.calories}</span>
                  <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">cal</span>
                </div>
              )}
              {meal.proteinGrams && (
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-mono font-bold text-white">{meal.proteinGrams}g</span>
                  <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">pro</span>
                </div>
              )}
              {meal.carbsGrams && (
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-mono font-bold text-white">{meal.carbsGrams}g</span>
                  <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">carb</span>
                </div>
              )}
              {meal.fatGrams && (
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-mono font-bold text-white">{meal.fatGrams}g</span>
                  <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">fat</span>
                </div>
              )}
            </div>
          )}`;

const newMacros = `          {meal.calories != null && meal.carbsGrams != null && meal.proteinGrams != null && meal.fatGrams != null && (
            <div className="text-xs font-mono text-stone-400 font-medium tracking-wide">
              {meal.calories} kcal &middot; {meal.carbsGrams}c &middot; {meal.proteinGrams}p &middot; {meal.fatGrams}f
            </div>
          )}`;

content = content.replace(oldMacros, newMacros);

// Replace emerald-400 and emerald-500 with [#FC5200]
content = content.replace(/emerald-400/g, '[#FC5200]');
content = content.replace(/emerald-500/g, '[#FC5200]');

fs.writeFileSync('src/components/MealCard.tsx', content);
console.log("Patched MealCard");
