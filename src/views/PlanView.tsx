import { Droplet, Activity, Plus, Camera, Loader2 } from 'lucide-react';
import { captureMealPhoto } from '../services/mealPhotoAnalyzer';
import { useToast } from '../components/Toast';
import { auth, db } from '../firebase';
import { useAppContext } from '../context/AppContext';
import { doc, setDoc, arrayUnion, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { MealPhotoConfirmModal } from '../components/MealPhotoConfirmModal';
import React, { useState } from 'react';
import { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER } from '../styles/designTokens';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Share, PlusCircle, Trash2, Calendar, Clock, RotateCcw } from 'lucide-react';
import { PlannedMeal, Group } from '../types';
import { Meal, ALL_MEALS } from '../data/recipes';
import { NotificationBell } from '../components/NotificationBell';

interface PlanViewProps {
  household?: any;
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
  household,
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
  const { trainingLogs } = useAppContext();
  const [viewMode, setViewMode] = useState<'upcoming' | 'history'>('upcoming');

  const [manualMealDate, setManualMealDate] = React.useState<string | null>(null);
  const [scanningDate, setScanningDate] = React.useState<string | null>(null);
  const [scannedMealPreview, setScannedMealPreview] = React.useState<any | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeDateForUpload, setActiveDateForUpload] = React.useState<string | null>(null);
  const { showToast } = useToast();

  

  const triggerUpload = (dateKey: string) => {
    setActiveDateForUpload(dateKey);
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeDateForUpload) return;

    setScanningDate(activeDateForUpload);
    try {
      const result = await captureMealPhoto(file);
      if (result) {
        setScannedMealPreview(result);
        setManualMealDate(activeDateForUpload);
      } else {
        showToast("Error: Failed to analyze photo.", "error");
      }
    } catch (err: any) {
      showToast(`Error: ${err.message || "Failed to analyze photo."}`, "error");
    } finally {
      setScanningDate(null);
      setActiveDateForUpload(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteLoggedMeal = async (dateKey: string, mealToRemove: any) => {
    if (!auth.currentUser) return;
    try {
      const logRef = doc(db, `users/${auth.currentUser.uid}/trainingLog`, dateKey);
      const snap = await getDoc(logRef);
      if (snap.exists()) {
        const data = snap.data();
        const meals = data.acceptedMeals || [];
        // Remove exactly one matching meal
        const index = meals.findIndex((m: any) => 
          m.name === mealToRemove.name && 
          m.calories === mealToRemove.calories && 
          m.mealType === mealToRemove.mealType
        );
        if (index > -1) {
          meals.splice(index, 1);
          await updateDoc(logRef, { acceptedMeals: meals });
          showToast("Meal removed from log", "success");
        }
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to remove meal", "error");
    }
  };

  const handleConfirmManualMeal = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; date: string }) => {
    if (!auth.currentUser) return;
    try {
      const logRef = doc(db, `users/${auth.currentUser.uid}/trainingLog`, data.date);
      const newMeal = {
        recipeId: crypto.randomUUID(),
        name: data.name,
        calories: data.calories,
        carbsGrams: data.carbsGrams,
        proteinGrams: data.proteinGrams,
        fatGrams: data.fatGrams,
        mealType: data.mealType,
        image: scannedMealPreview?.imageBase64 || null,
        source: scannedMealPreview ? 'photo-log' : 'manual-log',
        loggedAt: new Date().toISOString()
      };
      await setDoc(logRef, {
        acceptedMeals: arrayUnion(newMeal)
      }, { merge: true });
      showToast("Meal logged successfully!", "success");
      setManualMealDate(null);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to log meal", "error");
    }
  };


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
      className="absolute inset-0 bg-[#17181C] flex flex-col z-10"
    >
      <header className="px-6 py-4 flex items-center justify-between bg-[#17181C]/80 backdrop-blur-xl border-b border-stone-800 shrink-0 z-20 sticky top-0">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Meal Plan</h1>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`relative ${ICON_BUTTON}`}
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

      <div className="flex-1 flex flex-col overflow-y-auto pb-24">
        
        <div className="flex bg-stone-800 p-1 mx-6 mt-4 rounded-xl shrink-0">
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[15px] font-medium rounded-lg transition-all ${viewMode === 'upcoming' ? 'bg-stone-900 text-[#FC5200] shadow-sm' : 'text-stone-500'}`}
            onClick={() => setViewMode('upcoming')}
          >
            <Calendar className="w-4 h-4" />
            Upcoming
          </button>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-[15px] font-medium rounded-lg transition-all ${viewMode === 'history' ? 'bg-stone-900 text-[#FC5200] shadow-sm' : 'text-stone-500'}`}
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
                    <div key={dateStr} className={`${CARD} overflow-hidden`}>
                      <div className="bg-stone-900 px-4 py-3 border-b border-stone-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-display font-bold ${isToday ? 'text-[#FC5200]' : 'text-white'}`}>
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
                          className={`${ICON_BUTTON}`}
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
                                className="flex items-center justify-between group cursor-pointer hover:bg-stone-900 p-2 -mx-2 rounded-lg transition-colors"
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
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#FC5200]/100" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{meal.recipeName}</p>
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
                                    if (auth.currentUser) {
                                      try {
                                        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/plannedMeals`, meal.id));
                                      } catch (err: any) {
                                        console.error(err);
                                        showToast(err.message || "Failed to delete meal", "error");
                                      }
                                    }
                                  }}
                                  className={`opacity-0 group-hover:opacity-100 ${ICON_BUTTON} hover:text-red-500 hover:border-red-900/50`}
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
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4">Actually Logged</h3>
                  
                  {(trainingLogs || [])
                    .slice()
                    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 14)
                    .map((log: any) => {
                      const dateKey = log.date;
                      if (!log) return null;
                      
                      const meals = log.acceptedMeals || [];
                      const water = log.waterMl;
                      const supplements = log.supplementsTaken || [];
                      
                      if (meals.length === 0 && !water && supplements.length === 0) {
                        return null;
                      }
                      
                      const groupedMeals = meals.reduce((acc, meal) => {
                        const type = meal.mealType || 'Snack';
                        if (!acc[type]) acc[type] = [];
                        acc[type].push(meal);
                        return acc;
                      }, {} as Record<string, typeof meals>);
                      
                      const dateObj = new Date(dateKey + 'T12:00:00');
                      const isToday = dateKey === new Date().toISOString().split('T')[0];
                      const dateString = isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                      return (
                        <div key={'logged-'+dateKey} className={`${CARD} p-5 flex flex-col gap-4 mb-4 opacity-90`}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">{dateString}</h3>

                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => triggerUpload(dateKey)}
                                className="p-1 text-stone-400 hover:text-[#FC5200] transition-colors disabled:opacity-50"
                                disabled={scanningDate === dateKey}
                              >
                                {scanningDate === dateKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => setManualMealDate(dateKey)}
                                className="p-1 text-stone-400 hover:text-white transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => {
                            const typeMeals = groupedMeals[type];
                            if (!typeMeals || typeMeals.length === 0) return null;
                            
                            return (
                              <div key={type} className="flex flex-col gap-2">
                                <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{type}</h4>
                                <div className="flex flex-col gap-2">
                                  {typeMeals.map((meal, idx) => (
                                    <div key={idx} className="flex items-center justify-between group bg-stone-900/50 rounded-lg p-3 border border-stone-800/50">
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium text-stone-200 mb-1">{meal.name}</span>
                                        <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                                          {meal.calories}kcal • {meal.proteinGrams}g P • {meal.carbsGrams}g C • {meal.fatGrams}g F
                                        </span>
                                      </div>
                                      <button 
                                        onClick={() => handleDeleteLoggedMeal(dateKey, meal)}
                                        className={`${ICON_BUTTON} opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:border-red-900/50 shrink-0`}
                                        title="Remove meal"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                          
                          {(water || supplements.length > 0) && (
                            <div className="pt-3 border-t border-stone-800/50 flex flex-col gap-2">
                              {water ? (
                                <div className="flex items-center gap-2">
                                  <Droplet className="w-3.5 h-3.5 text-blue-400" />
                                  <span className="text-xs text-stone-300">{water} ml logged</span>
                                </div>
                              ) : null}
                              
                              {supplements.length > 0 ? (
                                <div className="flex items-start gap-2">
                                  <Activity className="w-3.5 h-3.5 text-[#FC5200] shrink-0 mt-0.5" />
                                  <span className="text-xs text-stone-300">{supplements.join(', ')}</span>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      );
                    })}

      {manualMealDate && (
        <MealPhotoConfirmModal
          isOpen={!!manualMealDate}
          initialData={scannedMealPreview}
          initialDate={manualMealDate}
          onConfirm={handleConfirmManualMeal}
          onCancel={() => {
            setManualMealDate(null);
            setScannedMealPreview(null);
          }}
          globalRecipes={globalRecipes}
          ALL_MEALS={ALL_MEALS}
        />
      )}

      </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
