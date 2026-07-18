import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, CalendarDays, ClipboardList, Check, Minus, Plus, Clock, Trash2, Package, Sparkles, Loader2 } from 'lucide-react';
import { Meal } from '../data/recipes';
import { useShoppingList } from '../hooks/useShoppingList';
import { generateSmartStaples } from '../services/recipeGenerator';
import { InventoryItem, PersonProfile, UserProfile } from '../types';
import { NotificationBell } from '../components/NotificationBell';

interface ShopViewProps {
  setActiveTab: (tab: any) => void;
  favorites: Meal[];
  shoppingListProps: ReturnType<typeof useShoppingList>;
  onMoveCheckedToPantry: () => void;
  onMoveItemToPantry: (item: any) => void;
  inventory: InventoryItem[];
  profile: UserProfile;
  likedTags: Record<string, number>;
}

export function ShopView({ 
  setActiveTab, 
  favorites, 
  shoppingListProps, 
  onMoveCheckedToPantry,
  onMoveItemToPantry,
  inventory,
  profile,
  likedTags
}: ShopViewProps) {
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

  const [isGeneratingStaples, setIsGeneratingStaples] = useState(false);

  const handleSmartSuggest = async () => {
    setIsGeneratingStaples(true);
    try {
      const inventoryNames = inventory.map(i => i.name);
      
      const staples = await generateSmartStaples(
        inventoryNames,
        profile.favoriteCuisines || [],
        Object.keys(likedTags)
      );

      for (const item of staples) {
        await shoppingListProps.addShoppingItemDirectly(item, 1, true);
      }
    } catch (error) {
      console.error("Failed to suggest staples:", error);
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
      className="absolute inset-0 bg-[#fdfbf7] flex flex-col z-10"
    >
      <header className="px-6 py-4 flex items-center justify-between bg-[#fdfbf7]/80 backdrop-blur-xl border-b border-stone-200/60 shrink-0 z-20 sticky top-0">
        <h1 className="text-2xl font-display font-bold text-stone-900 tracking-tight">My Cart</h1>
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

      <div className="p-6 shrink-0 border-b border-stone-200/60 bg-white">
        <form onSubmit={handleAddShoppingItem} className="flex gap-2">
          <input
            type="text"
            value={newShoppingItemName}
            onChange={(e) => setNewShoppingItemName(e.target.value)}
            placeholder="Add an item..."
            className="flex-1 bg-stone-50 border border-stone-200/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <button 
            type="submit"
            disabled={!newShoppingItemName.trim()}
            className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 text-sm"
          >
            Add
          </button>
        </form>
        {combinedShoppingList.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <button 
              onClick={() => {
                const allChecked = combinedShoppingList.every(i => i.checked);
                combinedShoppingList.forEach(i => {
                  if (i.checked === allChecked) toggleShoppingItem(i.id, i.isGenerated, i.name);
                });
              }}
              className="text-xs font-bold text-stone-400 uppercase tracking-wider hover:text-emerald-600 transition-colors"
            >
              {combinedShoppingList.every(i => i.checked) ? 'Unselect All' : 'Select All'}
            </button>
            <span className="text-xs font-medium text-stone-400">
              {combinedShoppingList.filter(i => i.checked).length} selected
            </span>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800 font-medium text-sm">
            <CalendarDays className="w-4 h-4" />
            <span>Smart Defer Perishables</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-700">Needed after:</span>
          <input 
            type="date" 
            value={shoppingEndDate}
            onChange={(e) => setShoppingEndDate(e.target.value)}
            className="bg-white border border-emerald-200 rounded-lg px-2 py-1 text-xs text-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <button 
            onClick={handleSmartDefer}
            className="ml-auto bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
          >
            Defer
          </button>
        </div>
      </div>

      <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-medium text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Pantry Staples Suggester</span>
          </div>
          <button 
            onClick={handleSmartSuggest}
            disabled={isGeneratingStaples}
            className="ml-auto bg-amber-600 text-white flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {isGeneratingStaples ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              'Suggest'
            )}
          </button>
        </div>
        <p className="text-[11px] text-amber-700/80 leading-relaxed">
          Running low on ideas? We'll suggest long-lasting spices, sauces, or dry goods based on what you like to cook.
        </p>
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
              <h2 className="text-sm font-display font-bold text-stone-400 uppercase tracking-widest mb-4">Current List</h2>
              <ul className="space-y-4">
                {combinedShoppingList.filter(item => !deferredItems[item.name.toLowerCase()]).map(item => (
                  <li key={item.id} className={`bg-white border border-stone-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm transition-opacity ${item.checked ? 'opacity-60' : ''}`}>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleShoppingItem(item.id, item.isGenerated, item.name)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all active:scale-[0.98] ${item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300 text-transparent hover:border-emerald-500'}`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <div className="flex flex-col">
                        <span className={`font-medium ${item.checked ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                          {item.name}
                          {item.isGenerated && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Planned</span>}
                          {item.isStaple && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-inline items-center gap-1"><Sparkles className="w-3 h-3 inline pb-[1px]"/> Suggested Staple</span>}
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
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onMoveItemToPantry(item)}
                        className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-[0.98]"
                        title="Purchased & move to pantry"
                      >
                        <Package className="w-5 h-5" />
                      </button>
                      <div className={`flex items-center bg-stone-50 rounded-lg border border-stone-200/60 p-1 ${item.isGenerated ? 'opacity-50 pointer-events-none' : ''}`}>
                        <button 
                          onClick={() => updateShoppingItemQuantity(item.id, -1, item.isGenerated)}
                          className="p-1 text-stone-400 hover:text-stone-900 transition-all active:scale-[0.98]"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-stone-700">{item.quantity}</span>
                        <button 
                          onClick={() => updateShoppingItemQuantity(item.id, 1, item.isGenerated)}
                          className="p-1 text-stone-400 hover:text-stone-900 transition-all active:scale-[0.98]"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => toggleDefer(item.name)}
                        className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-[0.98]"
                        title="Buy Later"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      {!item.isGenerated && (
                        <button 
                          onClick={() => removeShoppingItem(item.id, item.isGenerated)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-[0.98]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
                    <li key={item.id} className="bg-stone-50 border border-stone-200/60 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-stone-600">
                            {item.name}
                            {item.isGenerated && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Planned</span>}
                            {item.isStaple && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-inline items-center gap-1"><Sparkles className="w-3 h-3 inline pb-[1px]"/> Suggested Staple</span>}
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
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleDefer(item.name)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-[0.98] text-xs font-medium"
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
        <div className="absolute bottom-0 inset-x-0 px-6 pt-12 pb-4 bg-gradient-to-t from-[#fdfbf7] via-[#fdfbf7] to-transparent pointer-events-none flex justify-center">
          <button 
            onClick={onMoveCheckedToPantry}
            className="pointer-events-auto w-full max-w-sm py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            Move Checked to Pantry
          </button>
        </div>
      )}
    </motion.div>
  );
}
