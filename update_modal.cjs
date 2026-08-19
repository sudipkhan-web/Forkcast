const fs = require('fs');
let code = fs.readFileSync('src/components/MealPhotoConfirmModal.tsx', 'utf8');

// 1. Imports
code = code.replace(
  "import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON, PILL } from '../styles/designTokens';",
  "import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON, PILL } from '../styles/designTokens';\nimport { Meal } from '../data/recipes';"
);

// 2. Props
code = code.replace(
  "  onCancel: () => void;\n}",
  "  onCancel: () => void;\n  globalRecipes?: Meal[];\n  ALL_MEALS?: Meal[];\n}"
);

code = code.replace(
  "export function MealPhotoConfirmModal({ isOpen, initialData, initialDate, onConfirm, onCancel }: MealPhotoConfirmModalProps) {",
  "export function MealPhotoConfirmModal({ isOpen, initialData, initialDate, onConfirm, onCancel, globalRecipes = [], ALL_MEALS = [] }: MealPhotoConfirmModalProps) {"
);

// 3. State and Effect
const stateAndEffect = `
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Meal[]>([]);

  useEffect(() => {
    if (name.trim().length > 0 && showSuggestions) {
      const timer = setTimeout(() => {
        const query = name.toLowerCase();
        const allAvailable = [...ALL_MEALS, ...globalRecipes];
        const matches = allAvailable.filter(m => m.name.toLowerCase().includes(query)).slice(0, 5);
        setSuggestions(matches);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [name, showSuggestions, ALL_MEALS, globalRecipes]);
`;

code = code.replace(
  "  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);",
  "  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);\n" + stateAndEffect
);

// 4. Input rendering
const oldInput = `              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Meal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                />
              </div>`;

const newInput = `              <div className="relative">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Meal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                />
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={\`absolute top-full left-0 right-0 mt-1 z-50 \${CARD} overflow-hidden max-h-[200px] overflow-y-auto\`}
                    >
                      <ul>
                        {suggestions.map(meal => (
                          <li
                            key={meal.id}
                            className="px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 cursor-pointer border-b border-stone-800/50 last:border-0"
                            onClick={() => {
                              setName(meal.name);
                              if (meal.calories !== undefined) setCalories(meal.calories);
                              if (meal.carbsGrams !== undefined) setCarbsGrams(meal.carbsGrams);
                              if (meal.proteinGrams !== undefined) setProteinGrams(meal.proteinGrams);
                              if (meal.fatGrams !== undefined) setFatGrams(meal.fatGrams);
                              setShowSuggestions(false);
                            }}
                          >
                            <div className="font-medium">{meal.name}</div>
                            <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                              {meal.calories || 0}kcal • {meal.proteinGrams || 0}g P • {meal.carbsGrams || 0}g C • {meal.fatGrams || 0}g F
                            </div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>`;

code = code.replace(oldInput, newInput);

fs.writeFileSync('src/components/MealPhotoConfirmModal.tsx', code);
console.log("Updated Modal");
