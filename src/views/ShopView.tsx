import React, { useState, useEffect, useRef } from 'react';
import { COMMON_INGREDIENTS } from '../constants';
import { motion } from 'motion/react';
import { Star, CalendarDays, ClipboardList, Check, Minus, Plus, Clock, Trash2, Package, Sparkles, Loader2 } from 'lucide-react';
import { Meal } from '../data/recipes';
import { useShoppingList } from '../hooks/useShoppingList';
import { generateSmartStaples } from '../services/recipeGenerator';
import { InventoryItem, PersonProfile, UserProfile } from '../types';
import { NotificationBell } from '../components/NotificationBell';
import { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER } from '../styles/designTokens';
import { suggestFreeTextOptions } from '../services/mealPhotoAnalyzer';
import { useToast } from '../components/Toast';

interface ShopViewProps {
  setActiveTab: (tab: any) => void;
  favorites: Meal[];
  shoppingListProps: ReturnType<typeof useShoppingList>;
  onMoveCheckedToPantry: () => void;
  onMoveItemToPantry: (item: any) => void;
  inventory: InventoryItem[];
  profile: UserProfile;
  likedTags: Record<string, number>;
  customIngredientRules: Record<string, any>;
}

export function ShopView({ 
  setActiveTab, 
  favorites, 
  shoppingListProps, 
  onMoveCheckedToPantry,
  onMoveItemToPantry,
  inventory,
  profile,
  likedTags,
  customIngredientRules
}: ShopViewProps) {
  const { showToast } = useToast();
  const [suggestions, setSuggestions] = useState<{text: string, isAi?: boolean}[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const {
    newShoppingItemName,
    setNewShoppingItemName,
    deferredItems,
    shoppingEndDate,
    setShoppingEndDate,
    combinedShoppingList,
    handleAddShoppingItem,
    updateShoppingItemQuantity,
    toggleShoppingItem,
    toggleDefer,
    handleSmartDefer,
    removeShoppingItem
  } = shoppingListProps;

  useEffect(() => {
    const name = newShoppingItemName.trim();
    if (!name) {
      setSuggestions([]);
      return;
    }
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const norm = name.toLowerCase();
      const rules = Array.from(new Set([...COMMON_INGREDIENTS.map(i => i.toLowerCase()), ...Object.keys(customIngredientRules || {})]));
      const matches = rules.filter(r => r.includes(norm)).slice(0, 5);
      if (matches.length > 0) {
        setSuggestions(matches.map(text => ({ text })));
      } else if (norm.length >= 3) {
        const aiOptions = await suggestFreeTextOptions('ingredient', norm);
        setSuggestions(aiOptions.map(text => ({ text, isAi: true })));
      } else {
        setSuggestions([]);
      }
    }, 600);
    
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [newShoppingItemName, customIngredientRules]);


  const [isGeneratingStaples, setIsGeneratingStaples] = useState(false);
  const [isDeferModalOpen, setIsDeferModalOpen] = useState(false);
  const [isStaplesModalOpen, setIsStaplesModalOpen] = useState(false);
  const [stapleSuggestions, setStapleSuggestions] = useState<{name: string, selected: boolean}[]>([]);

  const handleSmartSuggest = async () => {
    setIsStaplesModalOpen(true);
    setIsGeneratingStaples(true);
    setStapleSuggestions([]);
    try {
      const inventoryNames = inventory.map(i => i.name);
      
      const staples = await generateSmartStaples(
        inventoryNames,
        profile.favoriteCuisines || [],
        Object.keys(likedTags)
      );
      setStapleSuggestions(staples.map(s => ({ name: s, selected: true })));
    } catch (error) {
      console.error("Failed to suggest staples:", error);
      showToast("Couldn't load staple suggestions — check your connection and try again.", 'error');
      setIsStaplesModalOpen(false);
    } finally {
      setIsGeneratingStaples(false);
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
      <header className="px-6 py-4 flex items-center justify-between bg-[#17181C]/80 backdrop-blur-xl border-b border-stone-800 shrink-0 z-20 sticky top-0">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">My Cart</h1>
        <div className="flex items-center gap-2">
          <NotificationBell />
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

      <div className="p-6 shrink-0 border-b border-stone-800 bg-stone-900">
        <div className="relative">
          <form onSubmit={handleAddShoppingItem} className="flex gap-2">
            <input
              type="text"
              value={newShoppingItemName}
              onChange={(e) => setNewShoppingItemName(e.target.value)}
              placeholder="Add an item..."
              className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC5200]/20 focus:border-[#FC5200] transition-all"
            />
            <button 
              type="submit"
              disabled={!newShoppingItemName.trim()}
              className={`${PRIMARY_BUTTON} px-5 py-3 disabled:opacity-50 text-sm`}
            >
              Add
            </button>
          </form>
          {suggestions.length > 0 && newShoppingItemName.trim() && (
            <div className={`absolute left-0 right-0 top-full mt-2 z-20 ${CARD} overflow-hidden`}>
              {suggestions.map((s, i) => (
                <button 
                  key={s.text + i} 
                  onClick={() => { setNewShoppingItemName(s.text); setSuggestions([]); }} 
                  className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors capitalize"
                >
                  <span>{s.text}</span>
                  {s.isAi && <span className="text-[10px] bg-[#FC5200]/20 text-[#FC5200] px-1.5 py-0.5 rounded ml-2 normal-case font-medium">AI suggested</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <button 
            onClick={() => setIsDeferModalOpen(true)}
            className={PILL}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Defer Perishables
          </button>
          <button 
            onClick={handleSmartSuggest}
            className={PILL}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Suggest Staples
          </button>
        </div>


      </div>

            <div className="flex-1 overflow-y-auto p-6 pb-32">
        {combinedShoppingList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
            <ClipboardList className="w-12 h-12 opacity-20" />
            <p className="text-sm">Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-display font-bold text-stone-400 uppercase tracking-widest">Current List</h2>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-stone-400">
                    {combinedShoppingList.filter(i => i.checked).length} selected
                  </span>
                  <button 
                    onClick={() => {
                      const allChecked = combinedShoppingList.every(i => i.checked);
                      combinedShoppingList.forEach(i => {
                        if (i.checked === allChecked) toggleShoppingItem(i.id, i.isGenerated, i.name);
                      });
                    }}
                    className="text-xs font-bold text-stone-400 uppercase tracking-wider hover:text-[#FC5200] transition-colors"
                  >
                    {combinedShoppingList.every(i => i.checked) ? 'Unselect All' : 'Select All'}
                  </button>
                </div>
              </div>
              <ul className="space-y-4">
                {combinedShoppingList.filter(item => !deferredItems[item.name.toLowerCase()]).map(item => (
                  <li key={item.id} className={`${CARD} p-4 flex flex-col gap-3 transition-opacity ${item.checked ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-3 w-full">
                      <button 
                        onClick={() => toggleShoppingItem(item.id, item.isGenerated, item.name)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border mt-0.5 transition-all active:scale-[0.98] ${item.checked ? 'bg-[#FC5200]/100/100 border-[#FC5200] text-white' : 'border-stone-300 text-transparent hover:border-[#FC5200]/40'}`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <div className="flex flex-col flex-1">
                        <span className={`font-medium ${item.checked ? 'text-stone-400 line-through' : 'text-white'}`}>
                          {item.name}
                          {item.isGenerated && <span className="ml-2 text-[10px] bg-[#FC5200]/100/20 text-[#FC5200] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Planned</span>}
                          {item.isStaple && <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-inline items-center gap-1"><Sparkles className="w-3 h-3 inline pb-[1px]"/> Suggested Staple</span>}
                        </span>
                        {item.amounts.length > 0 && (
                          <span className={`text-xs mt-0.5 ${item.checked ? 'text-stone-400' : 'text-stone-500'}`}>
                            {item.amounts.join(' + ')}
                          </span>
                        )}
                        {item.neededBy && (
                          <span className={`text-[10px] mt-0.5 ${item.isPerishable ? 'text-orange-500' : 'text-stone-400'}`}>
                            Needed by: {new Date(item.neededBy + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            {item.isPerishable && ' (Perishable)'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between ml-9">
                      <div className={`${STEPPER} ${item.isGenerated ? 'opacity-50 pointer-events-none' : ''}`}>
                        <button 
                          onClick={() => updateShoppingItemQuantity(item.id, -1, item.isGenerated)}
                          className="p-1 text-stone-400 hover:text-white transition-all active:scale-[0.98]"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-stone-300">{item.quantity}</span>
                        <button 
                          onClick={() => updateShoppingItemQuantity(item.id, 1, item.isGenerated)}
                          className="p-1 text-stone-400 hover:text-white transition-all active:scale-[0.98]"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleDefer(item.name)}
                          className={`${ICON_BUTTON} !w-[28px] !h-[28px] !p-0`}
                          title="Buy Later"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        {!item.isGenerated && (
                          <button 
                            onClick={() => removeShoppingItem(item.id, item.isGenerated)}
                            className={`${ICON_BUTTON} !w-[28px] !h-[28px] !p-0 hover:text-red-400`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Buy Later List */}
            {combinedShoppingList.some(item => deferredItems[item.name.toLowerCase()]) && (
              <div>
                <h2 className="text-sm font-display font-bold text-stone-400 uppercase tracking-widest mb-4">Buy Later</h2>
                <ul className="space-y-4 opacity-75">
                  {combinedShoppingList.filter(item => deferredItems[item.name.toLowerCase()]).map(item => (
                    <li key={item.id} className={`${CARD} p-4 flex flex-col gap-3`}>
                      <div className="flex items-start w-full">
                        <div className="flex flex-col flex-1">
                          <span className="font-medium text-stone-400">
                            {item.name}
                            {item.isGenerated && <span className="ml-2 text-[10px] bg-[#FC5200]/100/20 text-[#FC5200] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Planned</span>}
                            {item.isStaple && <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-inline items-center gap-1"><Sparkles className="w-3 h-3 inline pb-[1px]"/> Suggested Staple</span>}
                          </span>
                          {item.amounts.length > 0 && (
                            <span className="text-xs mt-0.5 text-stone-400">
                              {item.amounts.join(' + ')}
                            </span>
                          )}
                          {item.neededBy && (
                            <span className={`text-[10px] mt-0.5 ${item.isPerishable ? 'text-orange-500' : 'text-stone-400'}`}>
                              Needed by: {new Date(item.neededBy + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                              {item.isPerishable && ' (Perishable)'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => toggleDefer(item.name)}
                          className="p-1.5 px-3 text-[#FC5200] hover:bg-[#FC5200]/10 rounded-lg transition-all active:scale-[0.98] text-xs font-medium border border-[#FC5200]/20"
                        >
                          Move to Current
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {combinedShoppingList.some(item => item.checked) && (
        <div className="absolute bottom-0 inset-x-0 px-6 pt-12 pb-4 bg-gradient-to-t from-[#17181C] via-[#17181C] to-transparent pointer-events-none flex justify-center">
          <button 
            onClick={onMoveCheckedToPantry}
            className={`${PRIMARY_BUTTON} pointer-events-auto w-full max-w-sm py-3 flex items-center justify-center gap-2 text-sm font-semibold`}
          >
            <Package className="w-4 h-4" />
            Move Checked to Pantry
          </button>
        </div>
      )}

      {/* Modals */}
      {isDeferModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#FC5200]" />
                Smart Defer
              </h3>
              <button onClick={() => setIsDeferModalOpen(false)} className="text-stone-500 hover:text-white">
                <Minus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              When do you need these items? We'll hide them until it's time to shop.
            </p>
            <div className="flex items-center gap-3">
              <input 
                type="date" 
                value={shoppingEndDate}
                onChange={(e) => setShoppingEndDate(e.target.value)}
                className="flex-1 bg-black/20 border border-[#FC5200]/30 rounded-xl px-3 py-2 text-sm text-[#FC5200] outline-none focus:ring-2 focus:ring-[#FC5200]/50"
              />
              <button 
                onClick={() => {
                  handleSmartDefer();
                  setIsDeferModalOpen(false);
                }}
                className="bg-[#FC5200] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#FC5200] transition-colors active:scale-95"
              >
                Defer
              </button>
            </div>
          </div>
        </div>
      )}

      {isStaplesModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-xl max-h-[80vh]">
             <div className="flex items-center justify-between shrink-0">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Suggest Staples
              </h3>
              <button onClick={() => setIsStaplesModalOpen(false)} className="text-stone-500 hover:text-white">
                <Minus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            {isGeneratingStaples ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                <p className="text-sm text-stone-400">Analyzing your taste profile...</p>
              </div>
            ) : stapleSuggestions.length > 0 ? (
              <>
                <div className="flex items-center justify-between mt-2 shrink-0">
                  <span className="text-xs font-medium text-stone-400">
                    {stapleSuggestions.filter(s => s.selected).length} selected
                  </span>
                  <button 
                    onClick={() => {
                      const allSelected = stapleSuggestions.every(s => s.selected);
                      setStapleSuggestions(stapleSuggestions.map(s => ({ ...s, selected: !allSelected })));
                    }}
                    className="text-xs font-bold text-stone-400 uppercase tracking-wider hover:text-amber-500 transition-colors"
                  >
                    {stapleSuggestions.every(s => s.selected) ? 'Select None' : 'Select All'}
                  </button>
                </div>
                
                <div className="overflow-y-auto pr-2 space-y-2 flex-1 min-h-0">
                  {stapleSuggestions.map((staple, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const newSuggestions = [...stapleSuggestions];
                        newSuggestions[index].selected = !newSuggestions[index].selected;
                        setStapleSuggestions(newSuggestions);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${staple.selected ? 'bg-amber-500/10 border-amber-500/50' : 'bg-stone-900 border-stone-800 hover:border-stone-700'}`}
                    >
                      <span className={`font-medium text-sm ${staple.selected ? 'text-amber-400' : 'text-stone-300'}`}>{staple.name}</span>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${staple.selected ? 'bg-amber-500 border-amber-500 text-stone-900' : 'border-stone-600 text-transparent'}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 shrink-0">
                  <button 
                    disabled={stapleSuggestions.filter(s => s.selected).length === 0}
                    onClick={async () => {
                      for (const staple of stapleSuggestions.filter(s => s.selected)) {
                        await shoppingListProps.addShoppingItemDirectly(staple.name, 1, true);
                      }
                      setIsStaplesModalOpen(false);
                    }}
                    className="w-full bg-[#FC5200] disabled:opacity-50 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#FC5200] transition-colors active:scale-95"
                  >
                    Add Selected ({stapleSuggestions.filter(s => s.selected).length})
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                 <p className="text-sm text-stone-400">Ready to suggest staples?</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
