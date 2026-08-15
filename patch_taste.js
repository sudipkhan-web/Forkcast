const fs = require('fs');
let code = fs.readFileSync('src/components/TasteLearningScreen.tsx', 'utf8');

const target = `{meal.calories != null && meal.carbsGrams != null && meal.proteinGrams != null && meal.fatGrams != null && (
          <div className="flex items-center gap-2 mb-1.5 shrink-0">
            <div className="flex items-baseline gap-0.5"><span className="text-[11px] font-mono font-bold text-stone-300">{meal.calories}</span><span className="text-[9px] font-medium text-stone-500">cal</span></div>
            <div className="w-0.5 h-0.5 rounded-full bg-stone-700" />
            <div className="flex items-baseline gap-0.5"><span className="text-[11px] font-mono font-bold text-stone-300">{meal.carbsGrams}g</span><span className="text-[9px] font-medium text-stone-500">C</span></div>
            <div className="w-0.5 h-0.5 rounded-full bg-stone-700" />
            <div className="flex items-baseline gap-0.5"><span className="text-[11px] font-mono font-bold text-stone-300">{meal.proteinGrams}g</span><span className="text-[9px] font-medium text-stone-500">P</span></div>
            <div className="w-0.5 h-0.5 rounded-full bg-stone-700" />
            <div className="flex items-baseline gap-0.5"><span className="text-[11px] font-mono font-bold text-stone-300">{meal.fatGrams}g</span><span className="text-[9px] font-medium text-stone-500">F</span></div>
          </div>
        )}`;

const replacement = `{(meal.calories != null || meal.carbsGrams != null || meal.proteinGrams != null || meal.fatGrams != null) && (
          <div className="flex items-center gap-2 mb-1.5 shrink-0">
            {[
              meal.calories != null && { key: 'cal', val: String(meal.calories), unit: 'cal' },
              meal.carbsGrams != null && { key: 'carbs', val: \`\${meal.carbsGrams}g\`, unit: 'C' },
              meal.proteinGrams != null && { key: 'protein', val: \`\${meal.proteinGrams}g\`, unit: 'P' },
              meal.fatGrams != null && { key: 'fat', val: \`\${meal.fatGrams}g\`, unit: 'F' },
            ]
              .filter((m) => Boolean(m))
              .map((m, idx, arr) => (
                <React.Fragment key={m.key}>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[11px] font-mono font-bold text-stone-300">{m.val}</span>
                    <span className="text-[9px] font-medium text-stone-500">{m.unit}</span>
                  </div>
                  {idx < arr.length - 1 && <div className="w-0.5 h-0.5 rounded-full bg-stone-700" />}
                </React.Fragment>
              ))}
          </div>
        )}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/TasteLearningScreen.tsx', code);
  console.log('Successfully updated TasteLearningScreen.tsx');
} else {
  console.error('Target not found!');
  process.exit(1);
}
