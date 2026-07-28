import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, RefreshCw, Sparkles, Share, Target, User } from 'lucide-react';
import { Group, PersonProfile, InventoryItem, UserProfile } from '../types';
import { Meal, ALL_MEALS } from '../data/recipes';
import { MealCard } from '../components/MealCard';
import { generateRecipes } from '../services/recipeGenerator';
import { getActiveConstraints, getSmartSubstitutions } from '../services/recommendationEngine';
import { getPrimaryPerson } from '../utils/mealUtils';
import { useAppContext } from '../context/AppContext';
import { getTodayMacros } from '../utils/progressUtils';
import { NotificationBell } from '../components/NotificationBell';
import { TRAINING_DAY_OPTIONS } from '../constants';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface HomeViewProps {
  favorites: Meal[];
  setActiveTab: (tab: any) => void;
  setIsShareModalOpen: (open: boolean) => void;
  suggestions: (Meal & { dynamicReason: string, groupReason?: string })[];
  groups: Group[];
  selectedGroupId: string;
  handleSelectGroup: (id: string) => void;
  checkIngredient: (name: string) => boolean;
  inventory: InventoryItem[];
  calculateConfidence: (meal: Meal, availableCount: number, totalCount: number, substitutions: any[]) => number;
  handleReplace: (id: string) => void;
  handleFavorite: (meal: Meal) => void;
  handleSelectMeal: (meal: Meal) => void;
  setAcceptedSubstitutions: (subs: string[]) => void;
  isGeneratingMeals: boolean;
  setIsGeneratingMeals: (val: boolean) => void;
  likedTags: Record<string, number>;
  dislikedTags: Record<string, number>;
  household: PersonProfile[];
  seenMealIds: string[];
  globalRecipes: Meal[];
  setSuggestions: React.Dispatch<React.SetStateAction<(Meal & { dynamicReason: string, groupReason?: string })[]>>;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export function HomeView({
  favorites,
  setActiveTab,
  setIsShareModalOpen,
  suggestions,
  groups,
  selectedGroupId,
  handleSelectGroup,
  checkIngredient,
  inventory,
  calculateConfidence,
  handleReplace,
  handleFavorite,
  handleSelectMeal,
  setAcceptedSubstitutions,
  isGeneratingMeals,
  setIsGeneratingMeals,
  likedTags,
  dislikedTags,
  household,
  seenMealIds,
  globalRecipes,
  setSuggestions,
  profile,
  setProfile
}: HomeViewProps) {
  const [mealTypeFilter, setMealTypeFilter] = React.useState<string>('All');
  const [trainingDayType, setTrainingDayType] = React.useState<string | null>(null);
  const { trainingLogs } = useAppContext();

  const today = new Date().toISOString().split('T')[0];
  const todayLog = trainingLogs.find((l: any) => l.date === today);
  const primaryPerson = getPrimaryPerson(household);
  const todayMacros = getTodayMacros(todayLog?.acceptedMeals || [], primaryPerson || {}, trainingDayType || undefined);

  React.useEffect(() => {
    if (auth.currentUser) {
      const today = new Date().toISOString().split('T')[0];
      const logRef = doc(db, `users/${auth.currentUser.uid}/trainingLog`, today);
      getDoc(logRef).then(docSnap => {
        if (docSnap.exists()) {
          setTrainingDayType(docSnap.data().dayType);
        }
      });
    }
  }, []);

  const filteredSuggestions = React.useMemo(() => {
    return suggestions.filter(m => mealTypeFilter === 'All' || m.mealType === mealTypeFilter);
  }, [suggestions, mealTypeFilter]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 overflow-y-auto flex flex-col gap-4 pb-8"
    >
      <header className="px-6 py-4 flex items-center justify-between bg-[#17181C]/80 backdrop-blur-xl border-b border-stone-800 shrink-0 z-20 sticky top-0">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Forkcast</h1>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button 
            onClick={() => setActiveTab('profile')}
            className="p-2 text-stone-400 hover:text-[#FC5200] transition-all active:scale-[0.98] relative"
          >
            <User className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className="p-2 text-stone-400 hover:text-[#FC5200] transition-all active:scale-[0.98] relative"
          >
            <Star className="w-6 h-6" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#FC5200] rounded-full border-2 border-[#17181C] text-[9px] font-bold text-white flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 text-stone-400 hover:text-[#FC5200] hover:bg-emerald-50 rounded-full transition-all active:scale-95"
          >
            <Share className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <div className="px-6 mt-2 mb-2 flex items-center justify-between">
        <h2 className="text-4xl font-display font-bold text-white tracking-tight">Today's Menu</h2>
        <button
          onClick={() => setSuggestions([])}
          className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-400 rounded-full transition-all active:scale-95 flex items-center justify-center shrink-0"
          aria-label="Refresh Suggestions"
          title="Refresh Suggestions based on new preferences (This may take a few minutes running in the background)"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 mt-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0 w-full">
        {TRAINING_DAY_OPTIONS.map(day => (
          <button
            key={day}
            onClick={() => {
              const next = trainingDayType === day ? null : day;
              setTrainingDayType(next);
              if (auth.currentUser) {
                const today = new Date().toISOString().split('T')[0];
                const logRef = doc(db, `users/${auth.currentUser.uid}/trainingLog`, today);
                if (next) {
                  setDoc(logRef, { dayType: next }, { merge: true });
                } else {
                  setDoc(logRef, { dayType: null }, { merge: true });
                }
              }
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0 flex items-center gap-1 ${
              trainingDayType === day
                ? 'bg-[#FC5200] border-[#FC5200] text-white shadow-sm'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-[#FC5200] hover:text-[#FC5200]'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            {day}
          </button>
        ))}
      </div>

      <div className="px-6 mt-3 mb-2 flex gap-4 w-full">
        {[
          { label: 'CARBS', data: todayMacros.carbs },
          { label: 'PROTEIN', data: todayMacros.protein },
          { label: 'FAT', data: todayMacros.fat }
        ].map(macro => {
          const [min, max] = macro.data.target;
          const current = macro.data.current;
          const percentage = Math.min((current / max) * 100, 100);
          const isOver = current > max;
          const isUnder = current < min;
          let activeColor = 'bg-[#FC5200]';
          if (isUnder) activeColor = 'bg-stone-500';
          if (isOver) activeColor = 'bg-red-500';
          
          return (
            <div key={macro.label} className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">{macro.label}</span>
                <span className="text-[10px] font-mono text-stone-300">{current} <span className="text-stone-600">/ {min}-{max}g</span></span>
              </div>
              <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${activeColor}`} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 mt-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0 w-full">
        {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => (
          <button
            key={type}
            onClick={() => setMealTypeFilter(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0 ${
              mealTypeFilter === type
                ? 'bg-stone-800 border-stone-800 text-white shadow-sm'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-800 hover:bg-stone-800 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="pb-2 px-6 mt-2">
        <h3 className="text-xs font-display font-bold text-stone-400 uppercase tracking-widest mb-3 px-2">Cooking For</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
          <button
            onClick={() => handleSelectGroup('')}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-[0.98] border ${
              !selectedGroupId
                ? 'bg-stone-800 border-stone-800 text-white shadow-sm'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-800 hover:bg-stone-800 hover:text-white'
            }`}
          >
            Just Me
          </button>
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => handleSelectGroup(group.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-[0.98] border ${
                selectedGroupId === group.id
                  ? 'bg-stone-800 border-stone-800 text-white shadow-sm'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-800 hover:bg-stone-800 hover:text-white'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 px-6 mt-4">
        <AnimatePresence mode="popLayout">
          {filteredSuggestions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="text-center py-10 opacity-70 text-sm text-stone-400"
            >
              No {mealTypeFilter.toLowerCase()} recipes available right now. Click the generate button below to get some ideas!
            </motion.div>
          ) : (
            filteredSuggestions.slice(0, 8).map(meal => {
              const availableIngredients = meal.ingredients?.filter(i => checkIngredient(i.name)).map(i => i.name) || [];
              const missingIngredients = meal.ingredients?.filter(i => !checkIngredient(i.name)).map(i => i.name) || [];
              const substitutions = getSmartSubstitutions(missingIngredients, inventory, meal.ingredients?.map(i => i.name) || []);
              return (
                <MealCard 
                  key={meal.id} 
                  meal={meal} 
                  dynamicReason={meal.dynamicReason}
                  groupReason={meal.groupReason}
                  confidence={calculateConfidence(meal, availableIngredients.length, meal.ingredients?.length || 0, substitutions)}
                  availableIngredients={availableIngredients}
                  missingIngredients={missingIngredients}
                  substitutions={substitutions}
                  onReplace={() => handleReplace(meal.id)} 
                  onFavorite={() => handleFavorite(meal)} 
                  onClick={() => {
                    handleSelectMeal(meal);
                    setAcceptedSubstitutions([]);
                  }} 
                />
              );
            })
          )}
        </AnimatePresence>
      </div>
      
      <p className="text-stone-400 text-xs font-medium px-2 text-center mt-4">Swipe right to favorite, left to replace</p>
      
      <div className="px-6 mt-6 pb-6">
        <button
          onClick={async () => {
            setIsGeneratingMeals(true);
            try {
              const liked = Object.entries(likedTags).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
              const disliked = Object.entries(dislikedTags).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
              const primaryPerson = getPrimaryPerson(household);
              const { dietary, dislikedIngredients, favoriteCuisines, healthConditions } = getActiveConstraints(selectedGroupId ? groups.find(g => g.id === selectedGroupId)?.memberIds || [] : [primaryPerson?.id || ''], household);
              const goals: string[] = [];
              const seenNames = [...ALL_MEALS, ...globalRecipes, ...suggestions].map(m => m.name);
              const inventoryNames = inventory.map(i => i.name);
              const newMeals = await generateRecipes(12, liked, disliked, dietary, dislikedIngredients, favoriteCuisines, goals, seenNames, favorites, inventoryNames, healthConditions, mealTypeFilter === 'All' ? undefined : mealTypeFilter, trainingDayType || undefined, primaryPerson?.weightKg);
              if (newMeals.length > 0) {
                // If filtering by specific type, we might want to *add* them to the top of suggestions or replace.
                // Right now it just replaces the suggestions, or sets a big chunk of them. 
                // Wait, previously it did: "setSuggestions(newMeals...)". But suggestions should retain other meals 
                // so we don't wipe out other meal types.
                setSuggestions([...newMeals.map((m, idx) => ({
                  ...m,
                  id: `ai-manual-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
                  dynamicReason: 'Freshly generated for you!',
                  groupReason: 'AI Recommended'
                })), ...suggestions]);
              }
            } catch (err) {
              console.error("Error generating meals manually:", err);
            } finally {
              setIsGeneratingMeals(false);
            }
          }}
          disabled={isGeneratingMeals}
          className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 bg-[#FC5200] hover:bg-[#FC5200] disabled:opacity-70 disabled:active:scale-100 shadow-lg shadow-[#FC5200]/20"
        >
          {isGeneratingMeals ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating Recipes...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {mealTypeFilter === 'All' ? 'Generate More Recipes' : `Generate More ${mealTypeFilter} Recipes`}
            </>
          )}
        </button>
        <p className="text-[11px] text-center text-stone-400 mt-3 px-4">
          Generating recipes tailored to your precise preferences may take a few minutes running in the background.
        </p>
      </div>
    </motion.div>
  );
}
