import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Star, XCircle, Clock } from 'lucide-react';
import { Meal } from '../data/recipes';
import { auth, db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebaseUtils';
import { RecipeImage } from '../components/RecipeImage';
import { trackBehavior, TrackingAction } from '../services/behaviorTracking';

interface FavoritesViewProps {
  favorites: Meal[];
  setFavorites: React.Dispatch<React.SetStateAction<Meal[]>>;
  setActiveTab: (tab: any) => void;
  handleSelectMeal: (meal: Meal) => void;
  setAcceptedSubstitutions: (subs: string[]) => void;
}

export function FavoritesView({
  favorites,
  setFavorites,
  setActiveTab,
  handleSelectMeal,
  setAcceptedSubstitutions
}: FavoritesViewProps) {
  const handleDeleteFavorite = async (e: React.MouseEvent, meal: Meal) => {
    e.stopPropagation();
    setFavorites(prev => prev.filter(f => f.id !== meal.id));
    
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/favorites`, meal.id));
        trackBehavior(TrackingAction.REMOVED_FAVORITE, meal.id, meal.name, undefined, meal.tags || []);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${auth.currentUser.uid}/favorites/${meal.id}`);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 bg-[#17181C] flex flex-col z-10"
    >
      <header className="px-6 py-4 flex items-center gap-4 bg-[#17181C]/80 backdrop-blur-xl border-b border-stone-800 shrink-0 z-20 sticky top-0">
        <button 
          onClick={() => setActiveTab('home')}
          className="p-2 -ml-2 text-stone-400 hover:text-white transition-all active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Saved Recipes</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        {favorites.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
            <Star className="w-12 h-12 opacity-20" />
            <p className="text-sm">No saved recipes yet. Swipe right on a meal to save it!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {favorites.map(meal => (
              <div 
                key={meal.id} 
                className="bg-stone-900 rounded-2xl shadow-sm border border-stone-800 overflow-hidden cursor-pointer hover:border-stone-400 transition-colors relative group"
                onClick={() => {
                  handleSelectMeal(meal);
                  setAcceptedSubstitutions([]);
                }}
              >
                <button
                  onClick={(e) => handleDeleteFavorite(e, meal)}
                  className="absolute top-2 right-2 p-1 bg-stone-900/90 backdrop-blur-md rounded-full text-stone-400 hover:text-red-500 hover:bg-stone-900 transition-all active:scale-95 shadow-sm z-10 opacity-70 hover:opacity-100"
                  aria-label="Remove from favorites"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                <RecipeImage meal={meal} className="w-full h-32 object-cover saturate-110 brightness-95" />
                <div className="p-3">
                  <h3 className="font-display font-bold text-white text-sm line-clamp-2">{meal.name}</h3>
                  <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {meal.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
