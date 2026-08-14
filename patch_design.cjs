const fs = require('fs');

// Patch designTokens.ts
let tokens = fs.readFileSync('src/styles/designTokens.ts', 'utf8');
const newButton = `export const SECONDARY_BUTTON = "bg-[#232428] border border-[#303136] rounded-2xl text-stone-200 font-semibold transition-all active:scale-[0.98]";\n`;
if (!tokens.includes('SECONDARY_BUTTON')) {
  tokens += '\n' + newButton;
  fs.writeFileSync('src/styles/designTokens.ts', tokens);
}

// Patch MealCard.tsx
let mealCard = fs.readFileSync('src/components/MealCard.tsx', 'utf8');
mealCard = mealCard.replace('py-3.5', 'py-3 text-sm');
fs.writeFileSync('src/components/MealCard.tsx', mealCard);
console.log("Patched both files.");
