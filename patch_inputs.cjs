const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const cuisineOld = `<form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newFavoriteCuisine.trim()) return;
                        if (!person.favoriteCuisines.includes(newFavoriteCuisine.trim())) {
                          updateHouseholdMember({
                            ...person,
                            favoriteCuisines: [...person.favoriteCuisines, newFavoriteCuisine.trim()]
                          });
                        }
                        setNewFavoriteCuisine('');
                      }}
                      className="flex gap-2 mb-3"
                    >
                      <input 
                        type="text" 
                        value={newFavoriteCuisine}
                        onChange={e => setNewFavoriteCuisine(e.target.value)}
                        placeholder="Add other cuisine..."
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-white placeholder:text-stone-400"
                      />
                      <button type="submit" className={\`\${PRIMARY_BUTTON} px-5 py-2.5 text-sm\`}>Add</button>
                    </form>`;

const cuisineNew = `<form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newFavoriteCuisine.trim()) return;
                        if (!person.favoriteCuisines.includes(newFavoriteCuisine.trim())) {
                          updateHouseholdMember({
                            ...person,
                            favoriteCuisines: [...person.favoriteCuisines, newFavoriteCuisine.trim()]
                          });
                        }
                        setNewFavoriteCuisine('');
                        setCuisineSuggestions([]);
                      }}
                      className="flex gap-2 mb-3 relative"
                    >
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          value={newFavoriteCuisine}
                          onChange={e => setNewFavoriteCuisine(e.target.value)}
                          placeholder="Add other cuisine..."
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC5200]/20 focus:border-[#FC5200] text-white placeholder:text-stone-400 transition-all"
                        />
                        {cuisineSuggestions.length > 0 && newFavoriteCuisine.trim() && (
                          <div className={\`absolute top-full left-0 right-0 mt-2 \${CARD} z-20\`}>
                            {cuisineSuggestions.map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  setNewFavoriteCuisine(s);
                                  setCuisineSuggestions([]);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 transition-colors capitalize"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button type="submit" className={\`\${PRIMARY_BUTTON} px-5 py-2.5 text-sm\`}>Add</button>
                    </form>`;

const dietaryOld = `<form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newDietary.trim()) return;
                        if (!person.dietary.includes(newDietary.trim())) {
                          updateHouseholdMember({
                            ...person,
                            dietary: [...person.dietary, newDietary.trim()]
                          });
                        }
                        setNewDietary('');
                      }}
                      className="flex gap-2 mb-3"
                    >
                      <input 
                        type="text" 
                        value={newDietary}
                        onChange={e => setNewDietary(e.target.value)}
                        placeholder="Add other preference..."
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-white placeholder:text-stone-400"
                      />
                      <button type="submit" className={\`\${PRIMARY_BUTTON} px-5 py-2.5 text-sm\`}>Add</button>
                    </form>`;

const dietaryNew = `<form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newDietary.trim()) return;
                        if (!person.dietary.includes(newDietary.trim())) {
                          updateHouseholdMember({
                            ...person,
                            dietary: [...person.dietary, newDietary.trim()]
                          });
                        }
                        setNewDietary('');
                        setDietarySuggestions([]);
                      }}
                      className="flex gap-2 mb-3 relative"
                    >
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          value={newDietary}
                          onChange={e => setNewDietary(e.target.value)}
                          placeholder="Add other preference..."
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC5200]/20 focus:border-[#FC5200] text-white placeholder:text-stone-400 transition-all"
                        />
                        {dietarySuggestions.length > 0 && newDietary.trim() && (
                          <div className={\`absolute top-full left-0 right-0 mt-2 \${CARD} z-20\`}>
                            {dietarySuggestions.map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  setNewDietary(s);
                                  setDietarySuggestions([]);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 transition-colors capitalize"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button type="submit" className={\`\${PRIMARY_BUTTON} px-5 py-2.5 text-sm\`}>Add</button>
                    </form>`;

const dislikedOld = `<form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newDislikedIngredient.trim()) return;
                        if (!person.dislikedIngredients.includes(newDislikedIngredient.trim())) {
                          updateHouseholdMember({
                            ...person,
                            dislikedIngredients: [...person.dislikedIngredients, newDislikedIngredient.trim()]
                          });
                        }
                        setNewDislikedIngredient('');
                      }}
                      className="flex gap-2 mb-3"
                    >
                      <input 
                        type="text" 
                        value={newDislikedIngredient}
                        onChange={e => setNewDislikedIngredient(e.target.value)}
                        placeholder="Add other ingredient..."
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-white placeholder:text-stone-400"
                      />
                      <button type="submit" className={\`\${PRIMARY_BUTTON} px-5 py-2.5 text-sm\`}>Add</button>
                    </form>`;

const dislikedNew = `<form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newDislikedIngredient.trim()) return;
                        if (!person.dislikedIngredients.includes(newDislikedIngredient.trim())) {
                          updateHouseholdMember({
                            ...person,
                            dislikedIngredients: [...person.dislikedIngredients, newDislikedIngredient.trim()]
                          });
                        }
                        setNewDislikedIngredient('');
                        setDislikedSuggestions([]);
                      }}
                      className="flex gap-2 mb-3 relative"
                    >
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          value={newDislikedIngredient}
                          onChange={e => setNewDislikedIngredient(e.target.value)}
                          placeholder="Add other ingredient..."
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC5200]/20 focus:border-[#FC5200] text-white placeholder:text-stone-400 transition-all"
                        />
                        {dislikedSuggestions.length > 0 && newDislikedIngredient.trim() && (
                          <div className={\`absolute top-full left-0 right-0 mt-2 \${CARD} z-20\`}>
                            {dislikedSuggestions.map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  setNewDislikedIngredient(s);
                                  setDislikedSuggestions([]);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 transition-colors capitalize"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button type="submit" className={\`\${PRIMARY_BUTTON} px-5 py-2.5 text-sm\`}>Add</button>
                    </form>`;

const healthOld = `<form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newHealthCondition.trim()) return;
                          if (!person.healthConditions.includes(newHealthCondition.trim())) {
                            updateHouseholdMember({
                              ...person,
                              healthConditions: [...person.healthConditions, newHealthCondition.trim()]
                            });
                          }
                          setNewHealthCondition('');
                        }}
                        className="flex gap-2 mb-3"
                      >
                        <input 
                          type="text" 
                          value={newHealthCondition}
                          onChange={e => setNewHealthCondition(e.target.value)}
                          placeholder="Add other condition..."
                          className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-white placeholder:text-stone-400"
                        />
                        <button type="submit" className={\`\${PRIMARY_BUTTON} px-5 py-2.5 text-sm\`}>Add</button>
                      </form>`;

const healthNew = `<form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newHealthCondition.trim()) return;
                          if (!person.healthConditions.includes(newHealthCondition.trim())) {
                            updateHouseholdMember({
                              ...person,
                              healthConditions: [...person.healthConditions, newHealthCondition.trim()]
                            });
                          }
                          setNewHealthCondition('');
                          setHealthConditionSuggestions([]);
                        }}
                        className="flex gap-2 mb-3 relative"
                      >
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value={newHealthCondition}
                            onChange={e => setNewHealthCondition(e.target.value)}
                            placeholder="Add other condition..."
                            className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC5200]/20 focus:border-[#FC5200] text-white placeholder:text-stone-400 transition-all"
                          />
                          {healthConditionSuggestions.length > 0 && newHealthCondition.trim() && (
                            <div className={\`absolute top-full left-0 right-0 mt-2 \${CARD} z-20\`}>
                              {healthConditionSuggestions.map(s => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => {
                                    setNewHealthCondition(s);
                                    setHealthConditionSuggestions([]);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 transition-colors capitalize"
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <button type="submit" className={\`\${PRIMARY_BUTTON} px-5 py-2.5 text-sm\`}>Add</button>
                      </form>`;

code = code.replace(cuisineOld, cuisineNew);
code = code.replace(dietaryOld, dietaryNew);
code = code.replace(dislikedOld, dislikedNew);
code = code.replace(healthOld, healthNew);

fs.writeFileSync('src/views/ProfileView.tsx', code);
