import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronLeft, Clock, RefreshCw, ShoppingCart, Check, CalendarDays, ChefHat } from 'lucide-react';
import { Meal } from '../data/recipes';
import { RecipeImage } from '../components/RecipeImage';

interface MealDetailsViewProps {
  selectedMeal: Meal;
  handleSelectMeal: (meal: Meal | null) => void;
  checkIngredient: (name: string) => boolean;
  substitutions: any[];
  acceptedSubstitutions: string[];
  setAcceptedSubstitutions: React.Dispatch<React.SetStateAction<string[]>>;
  shoppingListProps: any;
  setNewMealName: (name: string) => void;
  setNewMealIngredients: (ingredients: any[]) => void;
  setNewMealGroupId: (id: string) => void;
  selectedGroupId: string;
  setPlanningDate: (date: string) => void;
  setIsPlanModalOpen: (open: boolean) => void;
  handleAddMissingToShoppingList: (ingredients: any[], subs: any[]) => void;
  handleCookMeal: (meal: Meal, acceptedSubs: string[], substitutions: any[]) => void;
}

export function MealDetailsView({
  selectedMeal,
  handleSelectMeal,
  checkIngredient,
  substitutions,
  acceptedSubstitutions,
  setAcceptedSubstitutions,
  shoppingListProps,
  setNewMealName,
  setNewMealIngredients,
  setNewMealGroupId,
  selectedGroupId,
  setPlanningDate,
  setIsPlanModalOpen,
  handleAddMissingToShoppingList,
  handleCookMeal
}: MealDetailsViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  
  // Create a parallax effect
  const imageY = useTransform(scrollY, [0, 500], [0, 250]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.4]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 max-w-md mx-auto bg-stone-900 z-40 flex flex-col shadow-2xl overflow-hidden"
    >
      {/* Back button pinned to the top left */}
      <button 
        onClick={() => handleSelectMeal(null)} 
        className="absolute top-4 left-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur-md transition-all active:scale-95 z-50 shadow-md"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 overflow-y-auto scroll-smooth relative" ref={scrollRef}>
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[360px] z-0 transform-gpu"
          style={{ y: imageY, opacity }}
        >
          <RecipeImage meal={selectedMeal} className="w-full h-full object-cover saturate-[1.15] brightness-95" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent" />
          <div className="absolute bottom-12 left-6 right-6 text-white">
            <h1 className="text-4xl font-display font-bold tracking-tight leading-tight drop-shadow-lg">{selectedMeal.name}</h1>
            <div className="flex items-center gap-4 mt-3 opacity-90">
              <span className="flex items-center gap-1.5 text-sm font-medium drop-shadow-md"><Clock className="w-4 h-4" /> {selectedMeal.time}</span>
            </div>
          </div>
        </motion.div>
        
        <div className="pt-[320px] relative z-10 pb-6 w-full">
        <div className="bg-[#fdfbf7] p-6 rounded-t-3xl min-h-screen shadow-[0_-8px_30px_rgba(0,0,0,0.2)]">
        <div>
          <h2 className="text-xs font-display font-bold text-stone-400 uppercase tracking-widest">Chef's Note</h2>
          <p className="mt-3 text-stone-700 bg-stone-50 p-5 rounded-2xl border border-stone-200/60 leading-relaxed text-[15px]">
            {selectedMeal.reason}
          </p>
        </div>

        {substitutions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-display font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" /> Smart Swaps
            </h2>
            <div className="mt-4 bg-emerald-50 p-5 rounded-2xl border border-emerald-100 space-y-3">
              {substitutions.map((sub, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <RefreshCw className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-[15px] text-stone-800">
                      Use <span className="font-bold">{sub.substitute}</span> instead of <span className="line-through text-stone-500">{sub.original}</span>
                    </p>
                    {sub.expiresSoon && (
                      <p className="text-xs text-red-500 font-medium mt-0.5">Use it up! Expires soon.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-display font-bold text-stone-400 uppercase tracking-widest">Ingredients</h2>
          </div>
          <ul className="mt-4 space-y-4">
            {selectedMeal.ingredients.map((ing, idx) => {
              const has = checkIngredient(ing.name);
              const inCart = shoppingListProps.inShoppingList(ing.name);
              const sub = substitutions.find(s => s.original === ing.name);
              const isAccepted = sub && acceptedSubstitutions.includes(sub.original);
              return (
                <li key={idx} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${has ? 'bg-emerald-100 text-emerald-600' : inCart ? 'bg-blue-100 text-blue-600' : isAccepted ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-400 border border-stone-200/60'}`}>
                    {has ? <Check className="w-3 h-3" /> : inCart ? <ShoppingCart className="w-3 h-3" /> : isAccepted ? <RefreshCw className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />}
                  </div>
                  <span className={`text-sm ${has || inCart || isAccepted ? 'text-stone-900' : 'text-stone-500'}`}>
                    {isAccepted ? (
                      <span><span className="line-through text-stone-400">{ing.name}</span> <span className="font-bold text-emerald-700 ml-1">{sub.substitute}</span></span>
                    ) : (
                      ing.name
                    )}
                    <span className="text-stone-400 text-xs ml-1">({ing.amount})</span>
                  </span>
                  {!has && !inCart && !sub && <span className="text-[10px] font-display font-bold uppercase tracking-wider text-stone-400 ml-auto bg-stone-100 px-2 py-0.5 rounded-sm">Missing</span>}
                  {!has && inCart && !sub && <span className="text-[10px] font-display font-bold uppercase tracking-wider text-blue-500 ml-auto bg-blue-50 px-2 py-0.5 rounded-sm">In Cart</span>}
                  {sub && !isAccepted && (
                    <button 
                      onClick={() => setAcceptedSubstitutions(prev => [...prev, sub.original])}
                      className="text-[10px] font-display font-bold uppercase tracking-wider text-emerald-600 ml-auto bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm hover:bg-emerald-100 transition-colors"
                    >
                      Swap: {sub.substitute}
                    </button>
                  )}
                  {sub && isAccepted && <span className="text-[10px] font-display font-bold uppercase tracking-wider text-emerald-600 ml-auto bg-emerald-100 px-2 py-0.5 rounded-sm">Swapped</span>}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-xs font-display font-bold text-stone-400 uppercase tracking-widest">Preparation</h2>
          <div className="mt-4 space-y-5">
            {selectedMeal.steps.map((step, idx) => {
              let elements: (string | React.ReactNode)[] = [step];
              
              substitutions.forEach(sub => {
                if (acceptedSubstitutions.includes(sub.original)) {
                  const regex = new RegExp(`(\\b${sub.original}\\b)`, 'gi');
                  let newElements: (string | React.ReactNode)[] = [];
                  elements.forEach(el => {
                    if (typeof el === 'string') {
                      const parts = el.split(regex);
                      parts.forEach((part, partIdx) => {
                        if (part.toLowerCase() === sub.original.toLowerCase()) {
                          newElements.push(<span key={partIdx + Math.random()} className="font-bold text-emerald-700">{sub.substitute}</span>);
                        } else if (part) {
                          newElements.push(part);
                        }
                      });
                    } else {
                      newElements.push(el);
                    }
                  });
                  elements = newElements;
                }
              });

              return (
                <div key={idx} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-[15px] text-stone-700 leading-relaxed">{elements}</p>
                </div>
              );
            })}
          </div>
        </div>
        </div>
        </div>
      </div>
      <div className="p-6 border-t border-stone-200/60 bg-white shrink-0 space-y-3">
        <button 
          onClick={() => {
            setNewMealName(selectedMeal.name);
            const swappedIngredients = selectedMeal.ingredients.map(ing => {
              const sub = substitutions.find(s => s.original === ing.name);
              const isAccepted = sub && acceptedSubstitutions.includes(sub.original);
              return isAccepted ? { ...ing, name: sub.substitute } : ing;
            });
            setNewMealIngredients(swappedIngredients);
            setNewMealGroupId(selectedGroupId);
            const d = new Date();
            setPlanningDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
            setIsPlanModalOpen(true);
            handleSelectMeal(null);
          }}
          className="w-full py-4 bg-stone-900 text-white rounded-2xl font-semibold text-lg hover:bg-stone-800 transition-all active:scale-[0.98] shadow-lg shadow-stone-900/20 flex items-center justify-center gap-2"
        >
          <CalendarDays className="w-5 h-5" />
          Plan this Meal
        </button>

        <button 
          onClick={() => {
            handleCookMeal(selectedMeal, acceptedSubstitutions, substitutions);
            handleSelectMeal(null);
          }}
          className="w-full py-4 bg-orange-500 text-white rounded-2xl font-semibold text-lg hover:bg-orange-600 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
        >
          <ChefHat className="w-5 h-5" />
          {selectedMeal.ingredients.filter(i => !checkIngredient(i.name) && !(substitutions.find(sub => sub.original === i.name) && acceptedSubstitutions.includes(i.name))).length === 0 ? "Cook Now" : "I Just Cooked This (Subtract Inventory)"}
        </button>

        {selectedMeal.ingredients.filter(i => !checkIngredient(i.name) && !(substitutions.find(sub => sub.original === i.name) && acceptedSubstitutions.includes(i.name))).length > 0 && (
          <button 
            onClick={() => {
              const acceptedSubs = substitutions.filter(sub => acceptedSubstitutions.includes(sub.original));
              handleAddMissingToShoppingList(selectedMeal.ingredients, acceptedSubs);
              handleSelectMeal(null);
            }}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20 mt-3"
          >
            Add Missing to Shopping List
          </button>
        )}
      </div>
    </motion.div>
  );
}
