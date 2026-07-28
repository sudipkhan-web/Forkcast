import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { ChevronLeft, RefreshCw, X, Heart, Star } from 'lucide-react';
import { RecipeIngredient, Meal, ALL_MEALS } from '../data/recipes';
import { generateRecipes } from '../services/recipeGenerator';
import { trackBehavior, TrackingAction } from '../services/behaviorTracking';
import { getExplorationMeals } from '../services/recommendationEngine';
import { InventoryItem, PersonProfile, UserProfile } from '../types';
import { RecipeImage } from './RecipeImage';

function TasteLearningCard({ meal, onLike, onDislike }: { key?: string, meal: Meal, onLike: () => void, onDislike: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 80) {
          onLike();
        } else if (info.offset.x < -80) {
          onDislike();
        }
      }}
      className="absolute inset-0 bg-stone-900 rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.5)] border border-stone-800 origin-bottom cursor-grab active:cursor-grabbing group"
    >
      <RecipeImage meal={meal} className="w-full h-[65%] object-cover pointer-events-none saturate-110 brightness-95 group-hover:scale-105 transition-transform duration-700" />
      <div className="p-6 h-[35%] flex flex-col justify-start bg-stone-900 pointer-events-none">
        {meal.isVariation && (
          <span className="text-[10px] font-bold text-[#FC5200] uppercase tracking-widest mb-1.5 flex items-center gap-1 shrink-0">
            <RefreshCw className="w-3 h-3" /> Variation
          </span>
        )}
        <h3 className="text-lg font-display font-bold text-white tracking-tight leading-tight mb-1 line-clamp-2 shrink-0">{meal.name}</h3>
        
        {(meal.cuisine || meal.mealType) && (
          <p className="text-stone-400 text-sm mb-1.5 shrink-0 line-clamp-1">
            {[meal.cuisine, meal.mealType].filter(Boolean).join(" · ")}
          </p>
        )}
        
        {meal.calories != null && meal.carbsGrams != null && meal.proteinGrams != null && meal.fatGrams != null && (
          <div className="flex items-center gap-2 mb-1.5 shrink-0">
            <div className="flex items-baseline gap-0.5"><span className="text-[11px] font-mono font-bold text-stone-300">{meal.calories}</span><span className="text-[9px] font-medium text-stone-500">cal</span></div>
            <div className="w-0.5 h-0.5 rounded-full bg-stone-700" />
            <div className="flex items-baseline gap-0.5"><span className="text-[11px] font-mono font-bold text-stone-300">{meal.carbsGrams}g</span><span className="text-[9px] font-medium text-stone-500">C</span></div>
            <div className="w-0.5 h-0.5 rounded-full bg-stone-700" />
            <div className="flex items-baseline gap-0.5"><span className="text-[11px] font-mono font-bold text-stone-300">{meal.proteinGrams}g</span><span className="text-[9px] font-medium text-stone-500">P</span></div>
            <div className="w-0.5 h-0.5 rounded-full bg-stone-700" />
            <div className="flex items-baseline gap-0.5"><span className="text-[11px] font-mono font-bold text-stone-300">{meal.fatGrams}g</span><span className="text-[9px] font-medium text-stone-500">F</span></div>
          </div>
        )}

        {meal.fuelingNote && (
          <p className="text-stone-400 text-xs italic line-clamp-2 leading-snug shrink-0">
            {meal.fuelingNote}
          </p>
        )}
      </div>
    </motion.div>
  );
}

interface TasteLearningScreenProps {
  onClose: () => void;
  onFavoriteMeal?: (meal: Meal) => void;
  onLike: (tags: string[], mealId: string) => void;
  onDislike: (tags: string[], mealId: string) => void;
  globalRecipes: Meal[];
  likedTags: Record<string, number>;
  dislikedTags: Record<string, number>;
  dietary: string[];
  dislikedIngredients: string[];
  favoriteCuisines: string[];
  healthConditions: string[];
  seenMealIds: string[];
  setSeenMealIds: React.Dispatch<React.SetStateAction<string[]>>;
  favorites: Meal[];
  groupId: string;
  groupName: string;
  inventory: InventoryItem[];
  profile: UserProfile | null;
  household: PersonProfile[];
  suggestions: Meal[];
  setSuggestions: React.Dispatch<React.SetStateAction<(Meal & { dynamicReason: string, groupReason?: string })[]>>;
  onOpenFavorites?: () => void;
}

export function TasteLearningScreen({ 
  onClose, 
  onLike, 
  onDislike,
  globalRecipes,
  likedTags,
  dislikedTags,
  dietary,
  dislikedIngredients,
  favoriteCuisines,
  healthConditions,
  seenMealIds,
  setSeenMealIds,
  favorites,
  groupId,
  groupName,
  inventory,
  profile,
  household,
  suggestions,
  setSuggestions,
  onFavoriteMeal,
  onOpenFavorites
}: TasteLearningScreenProps) {
  // We use the shared suggestions queue from App instead of local state.
  // This lets App.tsx handle the background polling and persistent storage.
  const isGenerating = suggestions.length === 0;

  const handleLike = () => {
    if (suggestions.length === 0) return;
    const meal = suggestions[0];
    
    const extendedTags = [...(meal.tags || [])];
    if (meal.cuisine) {
      const cuisineTag = `cuisine:${meal.cuisine.toLowerCase()}`;
      if (!extendedTags.includes(cuisineTag)) extendedTags.push(cuisineTag);
    }
    if (meal.ingredients) {
      meal.ingredients.forEach(ing => {
        const ingTag = `ingredient:${ing.name.toLowerCase()}`;
        if (!extendedTags.includes(ingTag)) extendedTags.push(ingTag);
      });
    }
    
    trackBehavior(TrackingAction.FAVORITED_RECIPE, meal.id, meal.name, undefined, extendedTags, groupId, groupName);
    onLike(extendedTags, meal.id);
    setSeenMealIds(prev => [...prev, meal.id]);
    setSuggestions(prev => prev.slice(1));
  };

  const handleStar = () => {
    if (suggestions.length === 0) return;
    const meal = suggestions[0];
    
    if (onFavoriteMeal) {
      onFavoriteMeal(meal);
    }
    
    // Also mark as liked
    handleLike();
  };

  const handleDislike = () => {
    if (suggestions.length === 0) return;
    const meal = suggestions[0];
    
    const extendedTags = [...(meal.tags || [])];
    if (meal.cuisine) {
      const cuisineTag = `cuisine:${meal.cuisine.toLowerCase()}`;
      if (!extendedTags.includes(cuisineTag)) extendedTags.push(cuisineTag);
    }
    if (meal.ingredients) {
      meal.ingredients.forEach(ing => {
        const ingTag = `ingredient:${ing.name.toLowerCase()}`;
        if (!extendedTags.includes(ingTag)) extendedTags.push(ingTag);
      });
    }
    
    trackBehavior(TrackingAction.REJECTED_RECIPE, meal.id, meal.name, undefined, extendedTags, groupId, groupName);
    onDislike(extendedTags, meal.id);
    setSeenMealIds(prev => [...prev, meal.id]);
    setSuggestions(prev => prev.slice(1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
      className="absolute inset-0 z-10 flex flex-col bg-[#17181C]"
    >
      <div className="flex-none p-6 pt-12 pb-4 relative text-center">
        <button 
          onClick={onClose}
          className="absolute top-10 left-6 p-2 text-stone-400 hover:text-white transition-all active:scale-95 z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="absolute top-10 right-6 flex items-center gap-2 z-20">
          <button
            onClick={() => setSuggestions([])}
            className="p-2 text-stone-400 hover:text-white bg-white/10 rounded-full transition-all active:scale-95"
            aria-label="Refresh Swipes"
            title="Get a new batch of meals to review (This may take a few minutes running in the background to tailor to your preferences)"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={onOpenFavorites}
            className="p-2 text-stone-400 hover:text-[#FC5200] bg-white/10 rounded-full transition-all active:scale-[0.98] relative"
          >
            <Star className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FC5200] rounded-full border-2 border-[#17181C] text-[9px] font-bold text-white flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>
        </div>
        <h2 className="text-white text-2xl sm:text-3xl font-display font-bold tracking-tight mt-4">Refine Your Palate<br/><span className="text-xs sm:text-sm font-sans font-normal text-stone-400 mt-1 block">Swipe right to like, left to dislike</span></h2>
      </div>
      
      <div className="flex-1 relative w-full max-w-sm mx-auto min-h-0 px-6 pb-4">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <AnimatePresence>
            {!isGenerating && suggestions.length > 0 ? (
              <TasteLearningCard 
                key={suggestions[0].id} 
                meal={suggestions[0]} 
                onLike={handleLike} 
                onDislike={handleDislike} 
              />
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center p-6 bg-stone-900 rounded-3xl shadow-xl border border-stone-800 w-full"
              >
                <RefreshCw className="w-12 h-12 text-[#FC5200] mb-4 animate-spin" />
                <h3 className="text-xl font-display font-bold text-white mb-2">Recalibrating...</h3>
                <p className="text-stone-400 text-sm mb-6">
                  Learning your preferences and generating endless new recipes tailored just for you.
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl text-stone-400 font-semibold transition-all active:scale-95 hover:bg-stone-800 hover:text-white"
                >
                  Back to Menu
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!isGenerating && suggestions.length > 0 && (
        <div className="flex-none flex items-center justify-center gap-6 p-6 pb-6">
          <button 
            onClick={handleDislike}
            className="w-16 h-16 bg-stone-900 rounded-full shadow-lg border border-stone-800 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
          >
            <X className="w-8 h-8" />
          </button>
          <button 
            onClick={handleStar}
            className="w-16 h-16 bg-stone-900 rounded-full shadow-lg border border-stone-800 flex items-center justify-center text-stone-400 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all active:scale-95"
          >
            <Star className="w-8 h-8" />
          </button>
          <button 
            onClick={handleLike}
            className="w-16 h-16 bg-stone-900 rounded-full shadow-lg border border-stone-800 flex items-center justify-center text-stone-400 hover:text-[#FC5200] hover:bg-[#FC5200]/10 transition-all active:scale-95"
          >
            <Heart className="w-8 h-8" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
