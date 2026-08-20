import React from 'react';
import { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { Group, PlannedMeal, PersonProfile, InventoryItem, UserProfile } from '../types';
import { Meal, RecipeIngredient, ALL_MEALS } from '../data/recipes';
import { getTopMeals, getSmartSubstitutions } from '../services/recommendationEngine';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddMeal: (e: React.FormEvent) => void;
  planningDate: string;
  setPlanningDate: (date: string) => void;
  getNextDays: (numDays: number) => Date[];
  newMealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  setNewMealType: (type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => void;
  newMealName: string;
  setNewMealName: (name: string) => void;
  newMealGroupId: string;
  setNewMealGroupId: (id: string) => void;
  groups: Group[];
  plannedMeals: PlannedMeal[];
  globalRecipes: Meal[];
  household: PersonProfile[];
  dislikedTags: Record<string, number>;
  likedTags: Record<string, number>;
  profile: UserProfile | null;
  inventory: InventoryItem[];
  favorites: Meal[];
  checkIngredient: (name: string) => boolean;
  setNewMealIngredients: (ingredients: RecipeIngredient[] | undefined) => void;
}

export function PlanModal({
  isOpen,
  onClose,
  handleAddMeal,
  planningDate,
  setPlanningDate,
  getNextDays,
  newMealType,
  setNewMealType,
  newMealName,
  setNewMealName,
  newMealGroupId,
  setNewMealGroupId,
  groups,
  plannedMeals,
  globalRecipes,
  household,
  dislikedTags,
  likedTags,
  profile,
  inventory,
  favorites,
  checkIngredient,
  setNewMealIngredients
}: PlanModalProps) {
  const [mealSuggestions, setMealSuggestions] = React.useState<string[]>([]);
  const debounceRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  React.useEffect(() => {
    const term = newMealName.trim().toLowerCase();
    if (!term) { setMealSuggestions([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const allNames = Array.from(new Set([...ALL_MEALS, ...globalRecipes].map(m => m.name)));
      setMealSuggestions(allNames.filter(n => n.toLowerCase().includes(term)).slice(0, 5));
    }, 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [newMealName, globalRecipes]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`${CARD} w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden`}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-stone-800 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-white">
                Plan Meal
              </h2>
              <button 
                onClick={onClose}
                className={`${ICON_BUTTON}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddMeal} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-display font-bold text-stone-400 uppercase tracking-widest mb-3">Date</label>
                <select
                  value={planningDate}
                  onChange={(e) => setPlanningDate(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-white"
                >
                  {getNextDays(7).map((date, idx) => {
                    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    return (
                      <option key={dateStr} value={dateStr}>
                        {idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-display font-bold text-stone-400 uppercase tracking-widest mb-3">Meal Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewMealType(type)}
                      className={`py-2 px-4 rounded-xl text-sm font-medium transition-all active:scale-[0.98] border ${
                        newMealType === type 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-emerald-500 hover:text-[#FC5200]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-display font-bold text-stone-400 uppercase tracking-widest">Meal Name or Recipe</label>
                  <button
                    type="button"
                    onClick={() => {
                      const group = groups.find(g => g.id === newMealGroupId) || groups[0];
                      const memberIds = group ? group.memberIds : [];
                      const topMeals = getTopMeals(1, plannedMeals.map(m => m.recipeId || ''), memberIds, globalRecipes, household, dislikedTags, likedTags, profile, inventory, favorites);
                      if (topMeals.length > 0) {
                        const meal = topMeals[0];
                        setNewMealName(meal.name);
                        
                        const missingIngredients = meal.ingredients.filter(i => !checkIngredient(i.name)).map(i => i.name);
                        const substitutions = getSmartSubstitutions(missingIngredients, inventory, meal.ingredients.map(i => i.name));
                        
                        const swappedIngredients = meal.ingredients.map(ing => {
                          const sub = substitutions.find(s => s.original === ing.name);
                          return sub ? { ...ing, name: sub.substitute } : ing;
                        });
                        
                        setNewMealIngredients(swappedIngredients);
                      }
                    }}
                    className="text-xs font-bold text-[#FC5200] hover:text-[#FC5200] flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    Suggest for Group
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={newMealName}
                    onChange={(e) => setNewMealName(e.target.value)}
                    placeholder="e.g. Avocado Toast"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC5200]/20 focus:border-[#FC5200] transition-all text-white placeholder:text-stone-400"
                    autoFocus
                  />
                  {mealSuggestions.length > 0 && newMealName.trim() && (
                    <div className={`absolute left-0 right-0 top-full mt-2 z-20 ${CARD} overflow-hidden`}>
                      {mealSuggestions.map(s => (
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
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-display font-bold text-stone-400 uppercase tracking-widest mb-3">Cooking For</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMealGroupId('')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-[0.98] border ${
                      !newMealGroupId
                        ? 'bg-stone-800 border-stone-800 text-white shadow-sm'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-800 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    Just Me
                  </button>
                  {groups.map(group => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setNewMealGroupId(group.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-[0.98] border ${
                        newMealGroupId === group.id
                          ? 'bg-stone-800 border-stone-800 text-white shadow-sm'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-800 hover:bg-stone-800 hover:text-white'
                      }`}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!newMealName.trim()}
                  className={`${PRIMARY_BUTTON} w-full py-3.5 text-lg disabled:opacity-50 disabled:active:scale-100`}
                >
                  Add to Plan
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
