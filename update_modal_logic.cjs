const fs = require('fs');
let code = fs.readFileSync('src/components/MealPhotoConfirmModal.tsx', 'utf8');

// 1. Imports
code = code.replace(
  "import { Meal } from '../data/recipes';",
  "import { Meal } from '../data/recipes';\nimport { estimateMealFromName } from '../services/mealPhotoAnalyzer';\nimport { Loader2 } from 'lucide-react';"
);

// 2. Add state
const stateInsert = `
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Meal[]>([]);
  const [isEstimating, setIsEstimating] = useState(false);
  const [confidenceNote, setConfidenceNote] = useState<'high' | 'medium' | 'low' | null>(initialData?.confidence || null);
`;

code = code.replace(
  /const \[showSuggestions.*?useState<Meal\[\]>\(\[\]\);/s,
  stateInsert.trim()
);

// 3. Clear note when initially closed/opened without data
code = code.replace(
  "setMealType(getDefaultMealType());\n      } else {\n        setName('');",
  "setMealType(getDefaultMealType());\n        setConfidenceNote(initialData.confidence || null);\n      } else {\n        setName('');\n        setConfidenceNote(null);"
);

// 4. Input rendering - Add the button and loading logic
const oldInputEnd = `                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>`;

const newInputEnd = `                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Estimate Button */}
                {name.trim().length > 0 && suggestions.length === 0 && !showSuggestions && 
                 calories === '' && carbsGrams === '' && proteinGrams === '' && fatGrams === '' && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setIsEstimating(true);
                        const result = await estimateMealFromName(name);
                        if (result) {
                          setCalories(result.calories);
                          setCarbsGrams(result.carbsGrams);
                          setProteinGrams(result.proteinGrams);
                          setFatGrams(result.fatGrams);
                          setConfidenceNote(result.confidence);
                        }
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsEstimating(false);
                      }
                    }}
                    disabled={isEstimating}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-stone-800 text-stone-300 text-xs font-medium hover:bg-stone-700 transition-colors border border-stone-700/50 disabled:opacity-50"
                  >
                    {isEstimating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Estimate macros with AI"}
                  </button>
                )}
              </div>`;

code = code.replace(oldInputEnd, newInputEnd);

// 5. Adjust the confidence note rendering so it works for name estimates too.
const oldConfidence = `            {initialData?.confidence === 'low' && (
              <div className="bg-amber-900/20 border border-amber-900/50 rounded-lg p-3 flex items-start gap-3 mt-4">`;

const newConfidence = `            {confidenceNote === 'low' && (
              <div className="bg-amber-900/20 border border-amber-900/50 rounded-lg p-3 flex items-start gap-3 mt-4">`;

code = code.replace(oldConfidence, newConfidence);

fs.writeFileSync('src/components/MealPhotoConfirmModal.tsx', code);
console.log("Updated Modal Logic");
