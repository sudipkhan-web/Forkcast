import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Share, PlusCircle, Trash2, Calendar, Clock, RotateCcw } from 'lucide-react';
import { PlannedMeal, Group } from '../types';
import { Meal, ALL_MEALS } from '../data/recipes';
import { NotificationBell } from '../components/NotificationBell';

interface PlanViewProps {
  plannedMeals: PlannedMeal[];
  globalRecipes: Meal[];
  setPlannedMeals: React.Dispatch<React.SetStateAction<PlannedMeal[]>>;
  groups: Group[];
  favorites: Meal[];
  setActiveTab: (tab: any) => void;
  setIsShareModalOpen: (open: boolean) => void;
  setPlanningDate: (date: string) => void;
  setNewMealGroupId: (id: string) => void;
  setIsPlanModalOpen: (open: boolean) => void;
  handleSelectMeal: (meal: Meal | null) => void;
  setAcceptedSubstitutions: (subs: string[]) => void;
  selectedGroupId: string;
}

export function PlanView({
  plannedMeals,
  globalRecipes,
  setPlannedMeals,
  groups,
  favorites,
  setActiveTab,
  setIsShareModalOpen,
  setPlanningDate,
  setNewMealGroupId,
  setIsPlanModalOpen,
  handleSelectMeal,
  setAcceptedSubstitutions,
  selectedGroupId
}: PlanViewProps) {
  const [viewMode, setViewMode] = useState<'upcoming' | 'history'>('upcoming');

  const getNextDays = (numDays: number) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < numDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const pastMeals = plannedMeals.filter(m => m.date < todayStr || m.cookedAt).sort((a, b) => b.date.localeCompare(a.date));

  const sortedPastDates = Array.from(new Set(pastMeals.map(m => m.date))).sort((a, b) => b.localeCompare(a));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 bg-[#fdfbf7] flex flex-col z-10"
    >
      <header className="px-6 py-4 flex items-center justify-between bg-[#fdfbf7]/80 backdrop-blur-xl border-b border-stone-200/60 shrink-0 z-20 sticky top-0">
        <h1 className="text-2xl font-display font-bold text-stone-900 tracking-tight">Meal Plan</h1>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button 
            onClick={() => setActiveTab('favorites')}
            className="p-2 text-stone-400 hover:text-emerald-600 transition-all active:scale-[0.98] relative"
          >
            <Star className="w-6 h-6" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 rounded-full border-2 border-[#fdfbf7] text-[9px] font-bold text-white flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-y-auto pb-24">
        
        <div className="flex bg-stone-100 p-1 mx-6 mt-4 rounded-xl shrink-0">
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[15px] font-medium rounded-lg transition-all ${viewMode === 'upcoming' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500'}`}
            onClick={() => setViewMode('upcoming')}
          >
            <Calendar className="w-4 h-4" />
            Upcoming
          </button>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[15px] font-medium rounded-lg transition-all ${viewMode === 'history' ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-500'}`}
            onClick={() => setViewMode('history')}
          >
            <Clock className="w-4 h-4" />
            History
          </button>
        </div>

        <div className="p-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {viewMode === 'upcoming' ? (
              <motion.div 
                key="upcoming-list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {getNextDays(7).map((date, idx) => {
                  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  const dayMeals = plannedMeals.filter(m => m.date === dateStr);
                  const isToday = idx === 0;
                  
                  return (
                    <div key={dateStr} className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
                      <div className="bg-stone-50 px-4 py-3 border-b border-stone-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-display font-bold ${isToday ? 'text-emerald-600' : 'text-stone-900'}`}>
                            {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="text-stone-500 text-sm">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            setPlanningDate(dateStr);
                            setNewMealGroupId(selectedGroupId);
                            setIsPlanModalOpen(true);
                          }}
                          className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all active:scale-95"
                        >
                          <PlusCircle className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="p-4">
                        {dayMeals.length === 0 ? (
                          <div className="text-center py-4 text-stone-400 text-sm">
                            No meals planned
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {dayMeals.map(meal => (
                              <div 
                                key={meal.id} 
                                className="flex items-center justify-between group cursor-pointer hover:bg-stone-50 p-2 -mx-2 rounded-lg transition-colors"
                                onClick={() => {
                                  if (meal.recipeId) {
                                    const originalMeal = [...ALL_MEALS, ...globalRecipes].find(m => m.id === meal.recipeId);
                                    if (originalMeal) {
                                      handleSelectMeal(originalMeal);
                                      if (meal.ingredients) {
                                        const accepted: string[] = [];
                                        originalMeal.ingredients.forEach(origIng => {
                                          if (!meal.ingredients?.some(pi => pi.name === origIng.name)) {
                                            accepted.push(origIng.name);
                                          }
                                        });
                                        setAcceptedSubstitutions(accepted);
                                      } else {
                                        setAcceptedSubstitutions([]);
                                      }
                                    }
                                  }
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <div>
                                    <p className="text-sm font-medium text-stone-900">{meal.recipeName}</p>
                                    <p className="text-xs text-stone-500">
                                      {meal.mealType}
                                      {meal.groupId && (
                                        <span className="ml-2 text-stone-400">
                                          • For {groups.find(g => g.id === meal.groupId)?.name || 'Unknown Group'}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    setPlannedMeals(prev => prev.filter(m => m.id !== meal.id));
                                    import('../firebase').then(({ auth, db }) => {
                                      if (auth.currentUser) {
                                        import('firebase/firestore').then(({ doc, deleteDoc }) => {
                                          deleteDoc(doc(db, `users/${auth.currentUser!.uid}/plannedMeals`, meal.id));
                                        });
                                      }
                                    });
                                  }}
                                  className="p-1.5 text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                key="history-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {sortedPastDates.length === 0 ? (
                  <div className="text-center py-10 flex flex-col items-center justify-center opacity-60">
                    <Clock className="w-10 h-10 text-stone-400 mb-3" />
                    <p className="text-stone-500 font-medium">No past meals</p>
                    <p className="text-stone-400 text-sm mt-1">Meals you plan will appear here after their date has passed.</p>
                  </div>
                ) : (
                  sortedPastDates.map((dateStr) => {
                    const [year, month, day] = dateStr.split('-');
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    const dayMeals = pastMeals.filter(m => m.date === dateStr);
                    
                    return (
                      <div key={dateStr} className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden opacity-90">
                        <div className="bg-stone-50 px-4 py-3 border-b border-stone-200/60 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-medium text-stone-700">
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span className="text-stone-500 text-sm">
                              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="space-y-3">
                            {dayMeals.map(meal => (
                              <div 
                                key={meal.id} 
                                className="flex items-center justify-between group p-2 -mx-2 rounded-lg transition-colors hover:bg-stone-50"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                                  <div>
                                    <p className="text-sm font-medium text-stone-800">{meal.recipeName}</p>
                                    <p className="text-xs text-stone-500">
                                      {meal.mealType} {meal.cookedAt && `• Cooked at ${new Date(meal.cookedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all">
                                  {meal.recipeId && (
                                    <button 
                                      onClick={() => {
                                        const originalMeal = [...ALL_MEALS, ...globalRecipes].find(m => m.id === meal.recipeId);
                                        if (originalMeal) {
                                          handleSelectMeal(originalMeal);
                                        }
                                      }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs font-medium rounded-full transition-colors mr-2"
                                      title="Plan Again"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      Plan Again
                                    </button>
                                  )}
                                  <button 
                                    onClick={async () => {
                                      setPlannedMeals(prev => prev.filter(m => m.id !== meal.id));
                                      import('../firebase').then(({ auth, db }) => {
                                        if (auth.currentUser) {
                                          import('firebase/firestore').then(({ doc, deleteDoc }) => {
                                            deleteDoc(doc(db, `users/${auth.currentUser!.uid}/plannedMeals`, meal.id));
                                          });
                                        }
                                      });
                                    }}
                                    className="p-1.5 text-stone-400 hover:text-red-500 transition-all rounded-full hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
