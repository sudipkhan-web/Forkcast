const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// The UI map functions are currently mapping over strings:
// {cuisineSuggestions.map(s => (
//   <button ... onClick={() => { setNewFavoriteCuisine(s); setCuisineSuggestions([]); }}>
//     {s}
//   </button>

code = code.replace(
  /\{cuisineSuggestions\.map\(s => \([\s\S]*?className="w-full text-left px-4 py-2\.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors capitalize"[\s\S]*?>\s*\{s\}\s*<\/button>\s*\)\)\}/,
  `{cuisineSuggestions.map((s, i) => (
                              <button
                                key={s.text + i}
                                type="button"
                                onClick={() => {
                                  setNewFavoriteCuisine(s.text);
                                  setCuisineSuggestions([]);
                                }}
                                className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors capitalize"
                              >
                                <span>{s.text}</span>
                                {s.isAi && <span className="text-[10px] bg-[#FC5200]/20 text-[#FC5200] px-1.5 py-0.5 rounded ml-2 normal-case font-medium">AI suggested</span>}
                              </button>
                            ))}`
);

code = code.replace(
  /\{dietarySuggestions\.map\(s => \([\s\S]*?className="w-full text-left px-4 py-2\.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors capitalize"[\s\S]*?>\s*\{s\}\s*<\/button>\s*\)\)\}/,
  `{dietarySuggestions.map((s, i) => (
                              <button
                                key={s.text + i}
                                type="button"
                                onClick={() => {
                                  setNewDietary(s.text);
                                  setDietarySuggestions([]);
                                }}
                                className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors capitalize"
                              >
                                <span>{s.text}</span>
                                {s.isAi && <span className="text-[10px] bg-[#FC5200]/20 text-[#FC5200] px-1.5 py-0.5 rounded ml-2 normal-case font-medium">AI suggested</span>}
                              </button>
                            ))}`
);

code = code.replace(
  /\{healthConditionSuggestions\.map\(s => \([\s\S]*?className="w-full text-left px-4 py-2\.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors capitalize"[\s\S]*?>\s*\{s\}\s*<\/button>\s*\)\)\}/,
  `{healthConditionSuggestions.map((s, i) => (
                              <button
                                key={s.text + i}
                                type="button"
                                onClick={() => {
                                  setNewHealthCondition(s.text);
                                  setHealthConditionSuggestions([]);
                                }}
                                className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors capitalize"
                              >
                                <span>{s.text}</span>
                                {s.isAi && <span className="text-[10px] bg-[#FC5200]/20 text-[#FC5200] px-1.5 py-0.5 rounded ml-2 normal-case font-medium">AI suggested</span>}
                              </button>
                            ))}`
);

code = code.replace(
  /\{dislikedSuggestions\.map\(s => \([\s\S]*?className="w-full text-left px-4 py-2\.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors capitalize"[\s\S]*?>\s*\{s\}\s*<\/button>\s*\)\)\}/,
  `{dislikedSuggestions.map((s, i) => (
                              <button
                                key={s.text + i}
                                type="button"
                                onClick={() => {
                                  setNewDislikedIngredient(s.text);
                                  setDislikedSuggestions([]);
                                }}
                                className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors capitalize"
                              >
                                <span>{s.text}</span>
                                {s.isAi && <span className="text-[10px] bg-[#FC5200]/20 text-[#FC5200] px-1.5 py-0.5 rounded ml-2 normal-case font-medium">AI suggested</span>}
                              </button>
                            ))}`
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
console.log("Patched ProfileView UI");
