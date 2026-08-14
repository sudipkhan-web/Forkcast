import React from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'motion/react';
import { Star, RefreshCw, Clock, Sparkles, Users, Carrot, ShoppingCart } from 'lucide-react';
import { Meal } from '../data/recipes';
import { CARD, PRIMARY_BUTTON } from '../styles/designTokens';
import { Substitution } from '../services/recommendationEngine';
import { RecipeImage } from './RecipeImage';

interface MealCardProps {
  meal: Meal;
  dynamicReason: string;
  groupReason?: string;
  confidence: number;
  availableIngredients: string[];
  missingIngredients: string[];
  substitutions: Substitution[];
  onReplace: () => void;
  onFavorite: () => void;
  onClick: () => void;
}

export function MealCard({ 
  meal, 
  dynamicReason, 
  groupReason, 
  confidence, 
  availableIngredients, 
  missingIngredients, 
  substitutions, 
  onReplace, 
  onFavorite, 
  onClick 
}: MealCardProps) {
  const x = useMotionValue(0);
  const bgOpacityRight = useTransform(x, [0, 60], [0, 1]);
  const bgOpacityLeft = useTransform(x, [0, -60], [0, 1]);
  const controls = useAnimation();

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, scale: 0.9, y: 20 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }} 
      className="relative w-full shrink-0"
    >
      <motion.div style={{ opacity: bgOpacityRight }} className="absolute inset-0 rounded-[28px] bg-[#FC5200] flex items-center justify-start pl-8">
        <Star className="w-8 h-8 text-white" />
      </motion.div>
      <motion.div style={{ opacity: bgOpacityLeft }} className="absolute inset-0 rounded-[28px] bg-stone-200 flex items-center justify-end pr-8">
        <RefreshCw className="w-8 h-8 text-stone-500" />
      </motion.div>

      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        animate={controls}
        onDragEnd={async (e, info) => {
          if (info.offset.x > 60) {
            await controls.start({ x: 200, opacity: 0, transition: { duration: 0.2 } });
            onFavorite();
          } else if (info.offset.x < -60) {
            await controls.start({ x: -200, opacity: 0, transition: { duration: 0.2 } });
            onReplace();
          }
        }}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className={`${CARD} relative flex flex-col cursor-pointer touch-pan-y overflow-hidden`}
      >
        <div className="relative h-64 w-full shrink-0">
          <RecipeImage meal={meal} className="w-full h-full object-cover saturate-110 brightness-95" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17181C]/90 via-[#17181C]/40 to-transparent" />
          {meal.isVariation && (
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
              <div className="bg-[#FC5200]/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <RefreshCw className="w-3.5 h-3.5 text-white animate-spin-slow" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Variation</span>
              </div>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Clock className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-bold text-white">{meal.time}</span>
          </div>
          <div className={`absolute top-4 left-4 ${meal.isVariation ? 'mt-10' : ''} bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm`}>
            <Sparkles className="w-4 h-4 text-[#FC5200]" />
            <span className="text-xs font-bold text-white">{confidence}% Match</span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <h3 className="text-3xl font-display font-bold text-white leading-tight tracking-tight">{meal.name}</h3>
          
          {meal.calories != null && meal.carbsGrams != null && meal.proteinGrams != null && meal.fatGrams != null && (
            <div className="text-xs font-mono text-stone-400 font-medium tracking-wide">
              {meal.calories} kcal &middot; {meal.carbsGrams}c &middot; {meal.proteinGrams}p &middot; {meal.fatGrams}f
            </div>
          )}
          
          <div className="bg-stone-900 rounded-2xl p-5 border border-stone-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FC5200] rounded-l-2xl" />
            <p className="text-sm text-stone-300 leading-relaxed font-medium">
              {dynamicReason}
            </p>
            {groupReason && (
              <p className="text-xs text-stone-500 mt-2 italic flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {groupReason}
              </p>
            )}
            {substitutions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-stone-800">
                <p className="text-xs font-bold text-[#FC5200] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Smart Swaps
                </p>
                <div className="space-y-1.5">
                  {substitutions.slice(0, 2).map((sub, idx) => (
                    <p key={idx} className="text-xs text-stone-400 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FC5200] mt-1 shrink-0" />
                      <span>Use <span className="font-bold text-white">{sub.substitute}</span> {sub.expiresSoon && <span className="text-red-500 font-medium">(expires soon)</span>} instead of {sub.original}</span>
                    </p>
                  ))}
                  {substitutions.length > 2 && (
                    <p className="text-xs text-stone-400 italic ml-3">+ {substitutions.length - 2} more swaps</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-sm text-stone-400 font-medium">
              <Carrot className="w-4 h-4 text-[#FC5200]" />
              <span>{availableIngredients.length + substitutions.length} ingredients</span>
            </div>
            {missingIngredients.length - substitutions.length > 0 ? (
              <div className="flex items-center gap-1.5 text-sm text-stone-400 font-medium">
                <ShoppingCart className="w-4 h-4" />
                <span>{missingIngredients.length - substitutions.length} missing</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-[#FC5200] font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Ready to cook!</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 pt-0">
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className={`${PRIMARY_BUTTON} w-full py-3 text-sm flex items-center justify-center gap-2`}
          >
            View Recipe
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
