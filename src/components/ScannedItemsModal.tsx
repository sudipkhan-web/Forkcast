import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { InventoryItem } from '../types';

interface ScannedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scannedItems: { id: string; name: string; quantity: number, location: 'fridge' | 'pantry', category: string }[];
  onConfirm: (items: { id: string; name: string; quantity: number, location: 'fridge' | 'pantry', category: string }[]) => void;
}

const CATEGORIES = [
  'Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Pantry Staples', 
  'Snacks', 'Beverages', 'Frozen', 'Spices & Seasonings', 'Other'
];

export function ScannedItemsModal({ isOpen, onClose, scannedItems, onConfirm }: ScannedItemsModalProps) {
  const [items, setItems] = useState<{ id: string; name: string; quantity: number, location: 'fridge'|'pantry', category: string }[]>(scannedItems);
  const [newItemName, setNewItemName] = useState('');

  // Reset items when modal opens with new scanned items
  React.useEffect(() => {
    if (isOpen) {
      setItems(scannedItems);
    }
  }, [isOpen, scannedItems]);

  const handleQuantityChange = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleLocationChange = (id: string, location: 'fridge' | 'pantry') => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, location } : item));
  };

  const handleCategoryChange = (id: string, category: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, category } : item));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setItems([{
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: 1,
      location: 'pantry',
      category: 'Other'
    }, ...items]);
    setNewItemName('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-6"
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-[#fdfbf7] w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-6 py-4 border-b border-stone-200/60 flex items-center justify-between bg-white shrink-0">
              <div>
                <h2 className="text-xl font-display font-bold text-stone-900">Review Items</h2>
                <p className="text-xs text-stone-500 mt-1">These were found in your scan.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center text-stone-500 py-8 text-sm">
                  No items recognized or all removed. Add some manually below!
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="bg-white border border-stone-200/60 rounded-xl p-3 flex flex-col gap-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-stone-800 text-sm flex-1">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-stone-50 rounded-lg border border-stone-200/60 p-1">
                            <button 
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="p-1 text-stone-400 hover:text-stone-900 transition-all active:scale-[0.98]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold text-stone-700">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="p-1 text-stone-400 hover:text-stone-900 transition-all active:scale-[0.98]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={item.location}
                          onChange={(e) => handleLocationChange(item.id, e.target.value as 'fridge' | 'pantry')}
                          className="text-xs bg-stone-50 border border-stone-200/60 rounded-lg py-1 px-2 text-stone-600 focus:outline-none focus:border-emerald-500 flex-1"
                        >
                          <option value="pantry">Pantry</option>
                          <option value="fridge">Fridge</option>
                        </select>
                        <select
                          value={item.category}
                          onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                          className="text-xs bg-stone-50 border border-stone-200/60 rounded-lg py-1 px-2 text-stone-600 focus:outline-none focus:border-emerald-500 flex-1"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-stone-200/60 mt-4">
                <form onSubmit={handleAddNewItem} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    placeholder="Missing something? Add it here"
                    className="flex-1 bg-white border border-stone-200/60 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-stone-900 placeholder:text-stone-400"
                  />
                  <button 
                    type="submit"
                    disabled={!newItemName.trim()}
                    className="bg-stone-800 text-white p-2 px-3 rounded-xl disabled:opacity-50 hover:bg-stone-900 flex items-center justify-center transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-stone-200/60 shrink-0">
              <button
                onClick={() => {
                  onConfirm(items);
                  onClose();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Confirm & Add {items.length} Items
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
