import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';
import { CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from '../styles/designTokens';

interface MealPhotoConfirmModalProps {
  isOpen: boolean;
  initialData: {
    name: string;
    calories: number;
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
    confidence: 'high' | 'medium' | 'low';
    imageBase64: string;
  } | null;
  onConfirm: (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number }) => void;
  onCancel: () => void;
}

export function MealPhotoConfirmModal({ isOpen, initialData, onConfirm, onCancel }: MealPhotoConfirmModalProps) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [carbsGrams, setCarbsGrams] = useState<number | ''>('');
  const [proteinGrams, setProteinGrams] = useState<number | ''>('');
  const [fatGrams, setFatGrams] = useState<number | ''>('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCalories(initialData.calories ?? '');
      setCarbsGrams(initialData.carbsGrams ?? '');
      setProteinGrams(initialData.proteinGrams ?? '');
      setFatGrams(initialData.fatGrams ?? '');
    }
  }, [initialData]);

  if (!isOpen || !initialData) return null;

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
            {initialData.imageBase64 && (
              <div className="w-full h-40 rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                <img src={initialData.imageBase64} alt="Scanned Meal" className="w-full h-full object-cover" />
              </div>
            )}

            {initialData.confidence === 'low' && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-300 font-medium">This estimate might be rough — feel free to adjust the numbers.</p>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Meal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Calories</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={carbsGrams}
                    onChange={(e) => setCarbsGrams(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={proteinGrams}
                    onChange={(e) => setProteinGrams(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={fatGrams}
                    onChange={(e) => setFatGrams(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
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
                fatGrams: Number(fatGrams) || 0 
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
