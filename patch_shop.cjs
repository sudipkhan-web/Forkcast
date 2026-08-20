const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');

// Need to import suggestFreeTextOptions
code = code.replace(
  "import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON, ICON_BUTTON } from '../styles/designTokens';",
  "import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON, ICON_BUTTON } from '../styles/designTokens';\nimport { suggestFreeTextOptions } from '../services/mealPhotoAnalyzer';"
);

// Update suggestion type
code = code.replace(
  'const [suggestions, setSuggestions] = useState<string[]>([]);',
  'const [suggestions, setSuggestions] = useState<{text: string, isAi?: boolean}[]>([]);'
);

// Update effect
const oldEffectRegex = /useEffect\(\(\) => \{\s*const name = newShoppingItemName\.trim\(\)[\s\S]*?\}, \[newShoppingItemName, customIngredientRules\]\);/;
const newEffect = `useEffect(() => {
    const name = newShoppingItemName.trim();
    if (!name) {
      setSuggestions([]);
      return;
    }
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const norm = name.toLowerCase();
      const rules = Array.from(new Set([...COMMON_INGREDIENTS.map(i => i.toLowerCase()), ...Object.keys(customIngredientRules || {})]));
      const matches = rules.filter(r => r.includes(norm)).slice(0, 5);
      if (matches.length > 0) {
        setSuggestions(matches.map(text => ({ text })));
      } else if (norm.length >= 3) {
        const aiOptions = await suggestFreeTextOptions('ingredient', norm);
        setSuggestions(aiOptions.map(text => ({ text, isAi: true })));
      } else {
        setSuggestions([]);
      }
    }, 600);
    
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [newShoppingItemName, customIngredientRules]);`;

code = code.replace(oldEffectRegex, newEffect);

// Update map
const oldMap = `{suggestions.map(s => (
                <button 
                  key={s} 
                  onClick={() => { setNewShoppingItemName(s); setSuggestions([]); }} 
                  className="w-full text-left px-4 py-2.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors"
                >
                  {s}
                </button>
              ))}`;
const newMap = `{suggestions.map((s, i) => (
                <button 
                  key={s.text + i} 
                  onClick={() => { setNewShoppingItemName(s.text); setSuggestions([]); }} 
                  className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors capitalize"
                >
                  <span>{s.text}</span>
                  {s.isAi && <span className="text-[10px] bg-[#FC5200]/20 text-[#FC5200] px-1.5 py-0.5 rounded ml-2 normal-case font-medium">AI suggested</span>}
                </button>
              ))}`;

code = code.replace(oldMap, newMap);

fs.writeFileSync('src/views/ShopView.tsx', code);
console.log("Patched ShopView.tsx");
