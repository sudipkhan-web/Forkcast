import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, RefreshCw, Sparkles, Share, Target, User, ChevronDown, Flame } from 'lucide-react';
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
  const remainingCarbsGrams = Math.max(0, todayMacros.carbs.target[1] - todayMacros.carbs.current);
  const remainingProteinGrams = Math.max(0, todayMacros.protein.target[1] - todayMacros.protein.current);
  const remainingFatGrams = Math.max(0, todayMacros.fat.target[1] - todayMacros.fat.current);

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

  const regenerateSuggestions = async (replace: boolean, overrideTrainingDayType?: string | null) => {
    const liked = Object.entries(likedTags).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
    const disliked = Object.entries(dislikedTags).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
    const primaryPerson = getPrimaryPerson(household);
    const { dietary, dislikedIngredients, favoriteCuisines, healthConditions } = getActiveConstraints(selectedGroupId ? groups.find(g => g.id === selectedGroupId)?.memberIds || [] : [primaryPerson?.id || ''], household);
    const goals: string[] = [];
    const seenNames = [...ALL_MEALS, ...globalRecipes, ...suggestions].map(m => m.name);
    const inventoryNames = inventory.map(i => i.name);

    let effectiveCarbs = remainingCarbsGrams;
    let effectiveProtein = remainingProteinGrams;
    let effectiveFat = remainingFatGrams;
    
    if (overrideTrainingDayType !== undefined) {
      const macros = getTodayMacros(todayLog?.acceptedMeals || [], primaryPerson || {}, overrideTrainingDayType || undefined);
      effectiveCarbs = Math.max(0, macros.carbs.target[1] - macros.carbs.current);
      effectiveProtein = Math.max(0, macros.protein.target[1] - macros.protein.current);
      effectiveFat = Math.max(0, macros.fat.target[1] - macros.fat.current);
    }

    const currentDayType = overrideTrainingDayType !== undefined ? overrideTrainingDayType : trainingDayType;

    const newMeals = await generateRecipes(12, liked, disliked, dietary, dislikedIngredients, favoriteCuisines, goals, seenNames, favorites, inventoryNames, healthConditions, mealTypeFilter === 'All' ? undefined : mealTypeFilter, currentDayType || undefined, primaryPerson?.weightKg, effectiveCarbs, effectiveProtein, effectiveFat);
    
    if (newMeals.length > 0) {
      const mapped = newMeals.map((m, idx) => ({
        ...m,
        id: `ai-manual-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        dynamicReason: 'Freshly generated for you!',
        groupReason: 'AI Recommended'
      }));
      
      if (replace) {
        setSuggestions(mapped);
      } else {
        setSuggestions([...mapped, ...suggestions]);
      }
    }
  };

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
          <button
            onClick={() => setSuggestions([])}
            className="p-2 text-stone-400 hover:text-[#FC5200] transition-all active:scale-[0.98] relative"
            aria-label="Refresh Suggestions"
            title="Refresh Suggestions based on new preferences (This may take a few minutes running in the background)"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
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

        </div>
      </header>
      


      <div className="mx-6 mt-3 p-[14px] rounded-2xl bg-stone-900 flex flex-col gap-3">
        <div className="flex flex-col w-full">
          <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide mb-1.5">Training Today</span>
          <div className="relative">
            <select
              value={trainingDayType || ''}
              onChange={async (e) => {
                const next = e.target.value || null;
                setTrainingDayType(next);
                if (auth.currentUser) {
                  const today = new Date().toISOString().split('T')[0];
                  const logRef = doc(db, `users/${auth.currentUser.uid}/trainingLog`, today);
                  setDoc(logRef, { dayType: next }, { merge: true });
                }
                setIsGeneratingMeals(true);
                try {
                  await regenerateSuggestions(true, next);
                } finally {
                  setIsGeneratingMeals(false);
                }
              }}
              className="w-full appearance-none bg-stone-800 border border-stone-700 rounded-[10px] px-3 py-[9px] pl-9 pr-9 text-sm font-medium text-white focus:outline-none focus:border-[#FC5200] cursor-pointer"
            >
              <option value="">No training today</option>
              {TRAINING_DAY_OPTIONS.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
            <Flame className="w-4 h-4 text-[#FC5200] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-[14px] w-full">
          {[
            { label: 'CARBS', data: todayMacros.carbs },
          { label: 'PROTEIN', data: todayMacros.protein },
          { label: 'FAT', data: todayMacros.fat }
        ].map(macro => {
          const [, max] = macro.data.target;
          const current = macro.data.current;
          const percentage = Math.min((current / max) * 100, 100);
          const isOver = current > max;
          const isUnder = current < macro.data.target[0];
          let activeColor = 'bg-[#FC5200]';
          if (isUnder) activeColor = 'bg-stone-500';
          if (isOver) activeColor = 'bg-red-500';
          
          return (
            <div key={macro.label} className="flex-1 flex flex-col">
              <div className="flex justify-between items-end mb-1">
                <span className="text-[9px] font-medium text-stone-400 uppercase tracking-wide">{macro.label}</span>
                <span className="text-[9px] font-mono text-stone-300">{current}/{max}g</span>
              </div>
              <div className="h-[5px] w-full bg-stone-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${activeColor}`} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <div className="px-6 mt-3 flex gap-2 w-full pb-2 shrink-0">
        <div className="flex flex-col w-full">
          <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide mb-1.5 mt-2.5">Meal Type</span>
          <div className="relative">
            <select
              value={mealTypeFilter}
              onChange={(e) => setMealTypeFilter(e.target.value)}
              className="w-full appearance-none bg-stone-900 border border-stone-800 rounded-[10px] px-3 py-[9px] pr-9 text-sm font-medium text-white focus:outline-none focus:border-[#FC5200] cursor-pointer"
            >
              <option value="All">All Meals</option>
              {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="pb-2 px-6 mt-3">
        <h3 className="text-[10px] font-medium text-stone-400 uppercase tracking-wide mb-1.5 px-2">Cooking For</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
          <button
            onClick={() => handleSelectGroup('')}
            className={`transition-all active:scale-[0.98] ${
              !selectedGroupId
                ? 'bg-stone-800 text-white text-xs font-medium px-3.5 py-1.5 rounded-full'
                : 'bg-stone-900 border border-stone-800 text-stone-400 text-xs px-3.5 py-1.5 rounded-full hover:bg-stone-800 hover:text-white'
            }`}
          >
            Just Me
          </button>
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => handleSelectGroup(group.id)}
              className={`transition-all active:scale-[0.98] ${
                selectedGroupId === group.id
                  ? 'bg-stone-800 text-white text-xs font-medium px-3.5 py-1.5 rounded-full'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 text-xs px-3.5 py-1.5 rounded-full hover:bg-stone-800 hover:text-white'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 px-6 mt-4">
        <AnimatePresence mode="popLayout">
          {isGeneratingMeals && suggestions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <RefreshCw className="w-8 h-8 text-[#FC5200] animate-spin" />
              <p className="text-sm font-medium text-stone-400">Finding your fuel...</p>
            </motion.div>
          ) : filteredSuggestions.length === 0 ? (
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
              await regenerateSuggestions(false);
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
