import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';
import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON, PILL } from '../styles/designTokens';
import { Meal } from '../data/recipes';
import { estimateMealFromName } from '../services/mealPhotoAnalyzer';
import { Loader2 } from 'lucide-react';

interface MealPhotoConfirmModalProps {
  isOpen: boolean;
  initialDate?: string;
  initialData: {
    name: string;
    calories: number;
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
    confidence: 'high' | 'medium' | 'low';
    imageBase64: string;
  } | null;
  onConfirm: (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; date: string }) => void;
  onCancel: () => void;
  globalRecipes?: Meal[];
  ALL_MEALS?: Meal[];
}


function getDefaultMealType(): 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' {
  const hour = new Date().getHours();
  if (hour < 11) return 'Breakfast';
  if (hour < 15) return 'Lunch';
  if (hour < 17) return 'Snack';
  return 'Dinner';
}

export function MealPhotoConfirmModal({ isOpen, initialData, initialDate, onConfirm, onCancel, globalRecipes = [], ALL_MEALS = [] }: MealPhotoConfirmModalProps) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [carbsGrams, setCarbsGrams] = useState<number | ''>('');
  const [proteinGrams, setProteinGrams] = useState<number | ''>('');
  const [fatGrams, setFatGrams] = useState<number | ''>('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>(getDefaultMealType());
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Meal[]>([]);
  const [isEstimating, setIsEstimating] = useState(false);
  const [confidenceNote, setConfidenceNote] = useState<'high' | 'medium' | 'low' | null>(initialData?.confidence || null);

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


  
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setCalories(initialData.calories ?? '');
        setCarbsGrams(initialData.carbsGrams ?? '');
        setProteinGrams(initialData.proteinGrams ?? '');
        setFatGrams(initialData.fatGrams ?? '');
        setMealType(getDefaultMealType());
        setConfidenceNote(initialData.confidence || null);
      } else {
        setName('');
        setConfidenceNote(null);
        setCalories('');
        setCarbsGrams('');
        setProteinGrams('');
        setFatGrams('');
        setMealType(getDefaultMealType());
      }
      setDate(initialDate || new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, initialData, initialDate]);


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`${CARD} relative w-full max-w-sm max-h-[90vh] overflow-y-auto z-10 flex flex-col`}
        >
          <div className="sticky top-0 bg-[#1A1A1A]/95 backdrop-blur-xl border-b border-stone-800 p-4 flex items-center justify-between z-10">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Review Meal</h3>
            <button onClick={onCancel} className="p-2 -mr-2 text-stone-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {initialData?.imageBase64 && (
              <div className="w-full h-40 rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                <img src={initialData.imageBase64} alt="Scanned Meal" className="w-full h-full object-cover" />
              </div>
            )}

            {initialData?.confidence === 'low' && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-300 font-medium">This estimate might be rough — feel free to adjust the numbers.</p>
              </div>
            )}

            <div className="space-y-4">

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5"
                />
              </div>


              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Meal Type</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0 w-full">
                  {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`${PILL} ${mealType === type ? 'bg-[#FC5200] text-white border-[#FC5200]' : 'bg-stone-900 text-stone-400 border-stone-800'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
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
                  className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5"
                />
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`absolute top-full left-0 right-0 mt-1 z-50 ${CARD} overflow-hidden max-h-[200px] overflow-y-auto`}
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Calories</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={carbsGrams}
                    onChange={(e) => setCarbsGrams(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={proteinGrams}
                    onChange={(e) => setProteinGrams(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={fatGrams}
                    onChange={(e) => setFatGrams(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-stone-800 flex gap-3 mt-auto">
            <button onClick={onCancel} className={`${SECONDARY_BUTTON} flex-1`}>
              Cancel
            </button>
            <button
              onClick={() => onConfirm({ 
                name, 
                calories: Number(calories) || 0, 
                carbsGrams: Number(carbsGrams) || 0, 
                proteinGrams: Number(proteinGrams) || 0, 
                fatGrams: Number(fatGrams) || 0,
                mealType,
                date
              })}
              className={`${PRIMARY_BUTTON} flex-1`}
              disabled={!name.trim()}
            >
              Log Meal
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
