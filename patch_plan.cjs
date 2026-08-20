const fs = require('fs');
let code = fs.readFileSync('src/components/PlanModal.tsx', 'utf8');

// Needs to import suggestFreeTextOptions
code = code.replace(
  "import { getTopMeals, getSmartSubstitutions } from '../services/mealPlanner';",
  "import { getTopMeals, getSmartSubstitutions } from '../services/mealPlanner';\nimport { suggestFreeTextOptions } from '../services/mealPhotoAnalyzer';"
);

// Update suggestion type
code = code.replace(
  'const [mealSuggestions, setMealSuggestions] = React.useState<string[]>([]);',
  'const [mealSuggestions, setMealSuggestions] = React.useState<{text: string, isAi?: boolean}[]>([]);'
);

// Update effect
const oldEffectRegex = /React\.useEffect\(\(\) => \{\s*const term = newMealName\.trim\(\)[\s\S]*?\}, \[newMealName, globalRecipes\]\);/;
const newEffect = `React.useEffect(() => {
    const term = newMealName.trim().toLowerCase();
    if (!term) { setMealSuggestions([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const allNames = Array.from(new Set([...ALL_MEALS, ...globalRecipes].map(m => m.name)));
      const local = allNames.filter(n => n.toLowerCase().includes(term)).slice(0, 5);
      if (local.length > 0) {
        setMealSuggestions(local.map(text => ({ text })));
      } else if (term.length >= 3) {
        const aiOptions = await suggestFreeTextOptions('mealName', term);
        setMealSuggestions(aiOptions.map(text => ({ text, isAi: true })));
      } else {
        setMealSuggestions([]);
      }
    }, 600);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [newMealName, globalRecipes]);`;

code = code.replace(oldEffectRegex, newEffect);

// Update map
const oldMap = `{mealSuggestions.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setNewMealName(s);
                            setMealSuggestions([]);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors"
                        >
                          {s}
                        </button>
                      ))}`;
const newMap = `{mealSuggestions.map((s, i) => (
                        <button
                          key={s.text + i}
                          type="button"
                          onClick={() => {
                            setNewMealName(s.text);
                            setMealSuggestions([]);
                          }}
                          className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors capitalize"
                        >
                          <span>{s.text}</span>
                          {s.isAi && <span className="text-[10px] bg-[#FC5200]/20 text-[#FC5200] px-1.5 py-0.5 rounded ml-2 normal-case font-medium">AI suggested</span>}
                        </button>
                      ))}`;

code = code.replace(oldMap, newMap);

fs.writeFileSync('src/components/PlanModal.tsx', code);
console.log("Patched PlanModal.tsx");
