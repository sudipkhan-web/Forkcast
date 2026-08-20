import React, { useState, useRef, useContext, useMemo, useEffect } from 'react';
import { CARD, ICON_BUTTON, PRIMARY_BUTTON, PILL, STEPPER } from '../styles/designTokens';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Share, Camera, Scan, Receipt, Plus, Minus, Trash2, Archive, ChevronDown, Loader2 } from 'lucide-react';
import { InventoryItem, PantryLog } from '../types';
import { Meal } from '../data/recipes';
import { analyzePantryImage } from '../services/inventoryScanner';
import { ScannedItemsModal } from '../components/ScannedItemsModal';
import { NotificationBell } from '../components/NotificationBell';
import { AppContext } from '../context/AppContext';
import { estimateExpirationDate } from '../utils/expiration';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

interface InventoryViewProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  pantryLogs: PantryLog[];
  favorites: Meal[];
  setActiveTab: (tab: any) => void;
  setIsShareModalOpen: (open: boolean) => void;
}

export function InventoryView({ inventory, setInventory, pantryLogs, favorites, setActiveTab, setIsShareModalOpen }: InventoryViewProps) {
  const [scanningState, setScanningState] = useState<'fridge' | 'pantry' | 'receipt' | null>(null);
  const [scanningCount, setScanningCount] = useState<number>(0);
  const [scannedItemsPreview, setScannedItemsPreview] = useState<{ id: string; name: string; quantity: number, location: 'fridge' | 'pantry', category: string }[] | null>(null);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientExpiresAt, setNewIngredientExpiresAt] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'log'>('inventory');
  
  const [activeLocationTab, setActiveLocationTab] = useState<'fridge' | 'pantry'>('fridge');
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState(false);
  const [isAddSectionExpanded, setIsAddSectionExpanded] = useState(false);
  
  const [newIngredientLocation, setNewIngredientLocation] = useState<'fridge' | 'pantry'>('pantry');
  const [newIngredientCategory, setNewIngredientCategory] = useState<string>('Other');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isClassifying, setIsClassifying] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const { customIngredientRules, updateCustomIngredientRule, userId } = useContext(AppContext)!;

  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const name = newIngredientName.trim();
    if (!name) {
      setSuggestions([]);
      return;
    }
    
    const norm = name.toLowerCase();
    const rules = Object.keys(customIngredientRules || {});
    const matches = rules.filter(r => r.includes(norm)).slice(0, 5);
    setSuggestions(matches);
    
    if (customIngredientRules && customIngredientRules[norm]) {
      setNewIngredientLocation(customIngredientRules[norm].location as 'fridge' | 'pantry');
      setNewIngredientCategory(customIngredientRules[norm].category);
      return;
    }
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsClassifying(true);
      try {
        const res = await fetch("/api/inventory/classify-ingredient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        if (res.ok) {
          const data = await res.json();
          setNewIngredientLocation(data.location || 'pantry');
          setNewIngredientCategory(data.category || 'Other');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsClassifying(false);
      }
    }, 250);
    
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [newIngredientName, customIngredientRules]);

  const syncInventoryItem = async (item: InventoryItem) => {
    if (!userId) return;
    try {
      await setDoc(doc(db, `users/${userId}/inventory`, item.id), item, { merge: true });
    } catch (err) {
      console.error("Failed to sync inventory item", err);
    }
  };

  const removeInventoryItemDb = async (id: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, `users/${userId}/inventory`, id));
    } catch (err) {
      console.error("Failed to delete inventory item", err);
    }
  };

  const addInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim() || !userId) return;
    
    let updatedItem: InventoryItem | null = null;

    setInventory(prev => {
      const existing = prev.find(i => i.name.toLowerCase() === newIngredientName.trim().toLowerCase());
      if (existing) {
        const newExpiresAt = newIngredientExpiresAt ? newIngredientExpiresAt : existing.expiresAt;
        updatedItem = { ...existing, quantity: existing.quantity + 1, expiresAt: newExpiresAt };
        return prev.map(item => item.id === existing.id ? updatedItem! : item);
      } else {
        const expiresAtValue = newIngredientExpiresAt || estimateExpirationDate(newIngredientCategory, newIngredientLocation);
        
        updatedItem = { 
          id: Date.now().toString(), 
          name: newIngredientName.trim(), 
          quantity: 1,
          location: newIngredientLocation,
          category: newIngredientCategory,
          expiresAt: expiresAtValue,
          uid: userId
        };
        return [updatedItem!, ...prev];
      }
    });

    if (updatedItem) await syncInventoryItem(updatedItem!);
    
    updateCustomIngredientRule(newIngredientName.trim().toLowerCase(), newIngredientLocation, newIngredientCategory);
    
    setNewIngredientName('');
    setNewIngredientExpiresAt('');
    setNewIngredientLocation('pantry');
    setNewIngredientCategory('Other');
    setSuggestions([]);
  };

  const updateInventoryQuantity = async (id: string, delta: number) => {
    if (!userId) return;
    let updatedItem: InventoryItem | null = null;

    setInventory(prev => {
      return prev.map(item => {
        if (item.id === id) {
          updatedItem = { ...item, quantity: Math.max(0, item.quantity + delta) };
          return updatedItem;
        }
        return item;
      });
    });
    
    if (updatedItem) await syncInventoryItem(updatedItem!);
  };

  const removeInventoryItem = async (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    await removeInventoryItemDb(id);
  };

  useMemo(() => {}, []); // keep formatting logic aligned

  const dynamicQuickAddItems = React.useMemo(() => {
    const frequencyMap: Record<string, number> = {};
    const originalCasing: Record<string, string> = {};

    pantryLogs.forEach(log => {
      if (log.action === 'add') {
        const lowerName = log.itemName.toLowerCase();
        frequencyMap[lowerName] = (frequencyMap[lowerName] || 0) + 1;
        if (!originalCasing[lowerName]) {
          originalCasing[lowerName] = log.itemName;
        }
      }
    });

    const sortedFrequentItems = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .map(([lowerName]) => originalCasing[lowerName]);

    // If there is no history, fall back to defaults
    if (sortedFrequentItems.length === 0) {
        return [
          'Eggs', 'Milk', 'Butter', 'Pasta', 'Rice', 'Garlic', 
          'Onion', 'Olive Oil', 'Chicken Breast', 'Tomatoes', 'Cheese', 
          'Bread'
        ];
    }

    return sortedFrequentItems.slice(0, 12);
  }, [pantryLogs]);

  const handleQuickAdd = async (item: string) => {
    if (!userId) return;
    let newItem: InventoryItem | null = null;
    
    setInventory(prev => {
      const existing = prev.find(i => i.name.toLowerCase() === item.toLowerCase());
      if (existing) return prev;
      
      const normalizedName = item.toLowerCase();
      const rule = customIngredientRules[normalizedName] || { location: 'pantry', category: 'Other' };
      const expiresAtValue = estimateExpirationDate(rule.category, rule.location);
      
      newItem = { 
        id: Date.now().toString() + Math.random(), 
        name: item, 
        quantity: 1, 
        location: rule.location, 
        category: rule.category, 
        expiresAt: expiresAtValue,
        uid: userId
      };
      return [newItem, ...prev];
    });
    
    if (newItem) await syncInventoryItem(newItem);
  };

  const getRelativeDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const processSingleImage = async (file: File): Promise<Array<{ name: string; quantity: number; location: 'fridge' | 'pantry'; category: string }>> => {
    try {
      const rawDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (err) => reject(err);
        img.src = rawDataUrl;
      });

      // Resize so longest side is at most 1600px preserving aspect ratio
      const maxDim = 1600;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas 2D context');
      }
      ctx.drawImage(img, 0, 0, width, height);

      const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const base64Data = jpegDataUrl.split(',')[1];
      const mimeType = 'image/jpeg';

      const items = await analyzePantryImage(base64Data, mimeType);
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error(`Failed to process image ${file.name}:`, error);
      return [];
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setScanningState('pantry'); // We use "pantry" just to show the loading state
    setScanningCount(files.length);
    
    try {
      const allResults: Array<{ name: string; quantity: number; location: 'fridge' | 'pantry'; category: string }> = [];
      const BATCH_SIZE = 3;

      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(batch.map((file) => processSingleImage(file)));
        for (const res of batchResults) {
          allResults.push(...res);
        }
      }

      if (allResults.length === 0) {
        alert("No items could be recognized from the image(s). Please try again with clear photos.");
      } else {
        // Merge the combined results: group by item name (case-insensitive, trimmed), summing quantity
        const mergedMap = new Map<string, { id: string; name: string; quantity: number; location: 'fridge' | 'pantry'; category: string }>();

        for (let idx = 0; idx < allResults.length; idx++) {
          const item = allResults[idx];
          const rawName = (item.name || '').trim();
          if (!rawName) continue;
          const key = rawName.toLowerCase();

          if (mergedMap.has(key)) {
            const existing = mergedMap.get(key)!;
            existing.quantity = Math.round(((existing.quantity || 1) + (item.quantity || 1)) * 100) / 100;
          } else {
            mergedMap.set(key, {
              id: `scanned-${Date.now()}-${idx}`,
              name: rawName,
              quantity: item.quantity || 1,
              location: item.location || 'pantry',
              category: item.category || 'Other'
            });
          }
        }

        setScannedItemsPreview(Array.from(mergedMap.values()));
      }
    } catch (error) {
      console.error("Error during image scan process:", error);
      alert("Failed to analyze images. Please try again.");
    } finally {
      setScanningState(null);
      setScanningCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmScanned = async (itemsToConfirm: { id: string; name: string; quantity: number, location: 'fridge' | 'pantry', category: string }[]) => {
    if (!userId) return;
    const syncedItems: InventoryItem[] = [];
    
    setInventory(prev => {
      const newItems = [...prev];
      itemsToConfirm.forEach(scannedItem => {
        // Automatically save their categorization for the future
        updateCustomIngredientRule(scannedItem.name, { location: scannedItem.location, category: scannedItem.category });

        const existingIndex = newItems.findIndex(i => i.name.toLowerCase() === scannedItem.name.toLowerCase());
        if (existingIndex > -1) {
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + scannedItem.quantity,
            location: scannedItem.location,
            category: scannedItem.category
          };
          syncedItems.push(newItems[existingIndex]);
        } else {
          const newItem: InventoryItem = {
            id: Date.now().toString() + Math.random(),
            name: scannedItem.name,
            quantity: scannedItem.quantity,
            location: scannedItem.location,
            category: scannedItem.category,
            expiresAt: estimateExpirationDate(scannedItem.category, scannedItem.location),
            uid: userId
          };
          newItems.unshift(newItem);
          syncedItems.push(newItem);
        }
      });
      return newItems;
    });
    
    for (const item of syncedItems) {
      await syncInventoryItem(item);
    }
    
    setScannedItemsPreview(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 bg-[#17181C] flex flex-col z-10"
    >
      <header className="px-6 py-4 flex items-center justify-between bg-[#17181C]/80 backdrop-blur-xl border-b border-stone-800 shrink-0 z-20">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Pantry & Fridge</h1>
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

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-6 bg-stone-900 border-b border-stone-800 space-y-5">
          <div>
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-1 flex relative">
              {scanningState && (
                <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl border border-emerald-500/20">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full mr-2"
                  />
                  <span className="text-xs font-medium text-[#FC5200]">
                    {scanningCount > 1 ? `Analyzing ${scanningCount} photos...` : 'Scanning...'}
                  </span>
                </div>
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={!!scanningState}
                title="Open camera to scan items"
                aria-label="Open camera to scan items"
                className="w-full flex items-center justify-center gap-2 py-3 bg-stone-900 text-stone-300 rounded-lg hover:bg-emerald-50 hover:text-[#FC5200] transition-all font-semibold active:scale-[0.98] shadow-sm"
              >
                <Camera className="w-5 h-5" />
                Smart Scan
              </button>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                capture="environment" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden mt-2">
            <button 
              onClick={() => setIsAddSectionExpanded(!isAddSectionExpanded)}
              className="flex items-center justify-between w-full p-4 text-white active:bg-stone-900 transition-colors"
            >
              <h2 className="text-xs font-display font-bold uppercase tracking-widest flex items-center gap-2 text-stone-500">
                <Plus className="w-4 h-4 text-[#FC5200]" />
                Add Items Manually
              </h2>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isAddSectionExpanded ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isAddSectionExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-stone-800 space-y-5 bg-stone-900/50">
                    <div>
                      <button 
                        onClick={() => setIsQuickAddExpanded(!isQuickAddExpanded)}
                        className="flex items-center gap-2 mb-2 w-full active:scale-[0.99] transition-transform"
                      >
                        <h2 className="text-xs font-display font-bold text-stone-400 uppercase tracking-widest">Quick Add</h2>
                        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isQuickAddExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isQuickAddExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-wrap gap-2 pb-2">
                              {dynamicQuickAddItems.map(item => {
                                const isSelected = inventory.some(i => i.name.toLowerCase() === item.toLowerCase());
                                return (
                                  <button
                                    key={item}
                                    onClick={() => handleQuickAdd(item)}
                                    disabled={isSelected}
                                    className={isSelected ? 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 border bg-[#FC5200]/15 border-[#FC5200]/40 text-[#FC5200] opacity-50 cursor-not-allowed' : `${PILL}`}
                                  >
                                    {item}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="relative pt-1">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-stone-800" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-stone-900/50 px-3 text-xs font-display font-medium text-stone-400 uppercase tracking-wider">Or type item</span>
                      </div>
                    </div>

                    <form onSubmit={addInventoryItem} className="flex flex-col gap-2 pb-2 relative">
                      <div className="flex gap-2 relative">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value={newIngredientName}
                            onChange={e => setNewIngredientName(e.target.value)}
                            placeholder="Add ingredient (e.g. Tomatoes)"
                            className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-white placeholder:text-stone-400"
                          />
                          {isClassifying && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                            </div>
                          )}
                          {suggestions.length > 0 && newIngredientName.trim() && (!customIngredientRules || !customIngredientRules[newIngredientName.trim().toLowerCase()]) && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-stone-800 border border-stone-700 rounded-lg shadow-xl overflow-hidden z-20">
                              {suggestions.map(s => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => {
                                    setNewIngredientName(s);
                                    if (customIngredientRules && customIngredientRules[s]) {
                                      setNewIngredientLocation(customIngredientRules[s].location as 'fridge' | 'pantry');
                                      setNewIngredientCategory(customIngredientRules[s].category);
                                    }
                                    setSuggestions([]);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 transition-colors capitalize"
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <button 
                          type="submit"
                          disabled={!newIngredientName.trim()}
                          className={`${PRIMARY_BUTTON} p-3 disabled:opacity-50`}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1 overflow-visible pb-1">
                        <div className="flex bg-stone-900 p-1 rounded-lg shrink-0">
                          <button
                            type="button"
                            onClick={() => setNewIngredientLocation('fridge')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${newIngredientLocation === 'fridge' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-stone-300'}`}
                          >
                            Fridge
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewIngredientLocation('pantry')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${newIngredientLocation === 'pantry' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-stone-300'}`}
                          >
                            Pantry
                          </button>
                        </div>
                        <select
                          value={newIngredientCategory}
                          onChange={(e) => setNewIngredientCategory(e.target.value)}
                          className="bg-stone-900 border border-stone-800 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 shrink-0"
                        >
                          {['Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Pantry Staples', 'Snacks', 'Beverages', 'Frozen', 'Spices & Seasonings', 'Other'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-2 shrink-0">
                          <label htmlFor="expiresAt" className="text-xs font-display font-medium text-stone-500 uppercase tracking-wider">Expires:</label>
                          <input
                            id="expiresAt"
                            type="date"
                            value={newIngredientExpiresAt}
                            onChange={e => setNewIngredientExpiresAt(e.target.value)}
                            className="bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="px-6 py-3 bg-[#17181C]/90 backdrop-blur-md border-b border-stone-800 flex gap-4 sticky top-0 z-10 shadow-sm">
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeSubTab === 'inventory' ? 'border-[#FC5200] text-[#FC5200]' : 'border-transparent text-stone-400 hover:text-white'}`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveSubTab('log')}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeSubTab === 'log' ? 'border-[#FC5200] text-[#FC5200]' : 'border-transparent text-stone-400 hover:text-white'}`}
          >
            Activity Log
          </button>
        </div>

        <div className="p-6">
        {activeSubTab === 'inventory' ? (
          <>
            <div className="flex gap-2 mb-6 bg-stone-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveLocationTab('fridge')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeLocationTab === 'fridge' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-300'}`}
              >
                Fridge
              </button>
              <button
                onClick={() => setActiveLocationTab('pantry')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeLocationTab === 'pantry' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-300'}`}
              >
                Pantry
              </button>
            </div>

            {inventory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
                <Archive className="w-12 h-12 opacity-20" />
                <p className="text-sm">Your inventory is empty.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {(() => {
                  const locationItems = inventory.filter(i => (i.location || 'pantry') === activeLocationTab);
                  if (locationItems.length === 0) {
                    return (
                      <div className="text-center text-stone-400 py-8 text-sm">
                        No items in your {activeLocationTab}.
                      </div>
                    );
                  }

                  const grouped = locationItems.reduce((acc, item) => {
                    const cat = item.category || 'Other';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(item);
                    return acc;
                  }, {} as Record<string, typeof locationItems>);

                  return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-sm font-display font-medium text-stone-400 uppercase tracking-wider">{category}</h3>
                      <ul className="space-y-3">
                        {items.sort((a, b) => {
                          if (!a.expiresAt && !b.expiresAt) return 0;
                          if (!a.expiresAt) return 1;
                          if (!b.expiresAt) return -1;
                          const aDate = new Date(a.expiresAt).getTime();
                          const bDate = new Date(b.expiresAt).getTime();
                          return aDate - bDate;
                        }).map(item => {
                          const isExpiringSoon = item.expiresAt && (() => {
                            const now = new Date();
                            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                            const [year, month, day] = item.expiresAt.split('-').map(Number);
                            const expDate = new Date(year, month - 1, day);
                            const diffTime = expDate.getTime() - today.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            return diffDays >= 0 && diffDays <= 3;
                          })();
                          const isExpired = item.expiresAt && (() => {
                            const now = new Date();
                            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                            const [year, month, day] = item.expiresAt.split('-').map(Number);
                            const expDate = new Date(year, month - 1, day);
                            return expDate < today;
                          })();

                          return (
                            <li key={item.id} className={`${CARD} p-4 flex flex-col gap-2`}>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="font-medium text-white text-sm">{item.name}</span>
                                  {item.expiresAt && (
                                    <span className={`text-[11px] mt-0.5 ${isExpired ? 'text-red-600 font-bold' : isExpiringSoon ? 'text-emerald-500 font-medium' : 'text-stone-400'}`}>
                                      {isExpired ? 'Expired: ' : 'Expires: '} {(() => {
                                        const [year, month, day] = item.expiresAt.split('-').map(Number);
                                        return new Date(year, month - 1, day).toLocaleDateString();
                                      })()}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center bg-stone-900 rounded-lg border border-stone-800 p-0.5">
                                    <button 
                                      onClick={() => updateInventoryQuantity(item.id, -1)}
                                      className="p-1 text-stone-400 hover:text-white transition-all active:scale-[0.98]"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-6 text-center text-xs font-semibold text-stone-300">{item.quantity}</span>
                                    <button 
                                      onClick={() => updateInventoryQuantity(item.id, 1)}
                                      className="p-1 text-stone-400 hover:text-white transition-all active:scale-[0.98]"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <button 
                                    onClick={() => removeInventoryItem(item.id)}
                                    className={`${ICON_BUTTON} hover:text-red-600 hover:bg-red-500/10`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <select
                                  value={item.location || 'pantry'}
                                  onChange={(e) => {
                                    const newLoc = e.target.value as 'fridge' | 'pantry';
                                    const updatedItem = { ...item, location: newLoc };
                                    setInventory(prev => prev.map(i => i.id === item.id ? updatedItem : i));
                                    updateCustomIngredientRule(item.name, { location: newLoc, category: item.category || 'Other' });
                                    syncInventoryItem(updatedItem);
                                  }}
                                  className="text-[10px] uppercase font-bold tracking-wider bg-stone-900 border border-stone-800 rounded-md py-1 px-1.5 text-stone-500 focus:outline-none focus:border-emerald-500"
                                >
                                  <option value="pantry">Pantry</option>
                                  <option value="fridge">Fridge</option>
                                </select>
                                <select
                                  value={item.category || 'Other'}
                                  onChange={(e) => {
                                    const newCat = e.target.value;
                                    const updatedItem = { ...item, category: newCat };
                                    setInventory(prev => prev.map(i => i.id === item.id ? updatedItem : i));
                                    updateCustomIngredientRule(item.name, { location: item.location || 'pantry', category: newCat });
                                    syncInventoryItem(updatedItem);
                                  }}
                                  className="text-[10px] uppercase font-bold tracking-wider bg-stone-900 border border-stone-800 rounded-md py-1 px-1.5 text-stone-500 focus:outline-none focus:border-emerald-500"
                                >
                                  {['Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Pantry Staples', 'Snacks', 'Beverages', 'Frozen', 'Spices & Seasonings', 'Other'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ));
                })()}
              </div>
            )}
          </>
        ) : (
          pantryLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
              <Archive className="w-12 h-12 opacity-20" />
              <p className="text-sm">No activity yet.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {pantryLogs.map(log => (
                <li key={log.id} className={`${CARD} p-3.5 flex items-start gap-2.5`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    log.action === 'add' ? 'bg-[#FC5200]/15 text-[#FC7A33]' :
                    (log.action === 'consume' || log.action === 'subtract') ? 'bg-white/[0.06] text-stone-300' :
                    'bg-red-500/15 text-red-400'
                  }`}>
                    {log.action === 'add' ? <Plus className="w-3.5 h-3.5" /> :
                     log.action === 'consume' ? <Minus className="w-3.5 h-3.5" /> :
                     log.action === 'subtract' ? <Minus className="w-3.5 h-3.5" /> :
                     <Archive className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">
                        {log.action === 'add' ? 'Added' : log.action === 'consume' ? 'Cooked' : log.action === 'subtract' ? 'Removed' : 'Expired'} {Math.abs(log.quantityChange)} {log.itemName}
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {log.reason && (
                      <span className="text-sm text-stone-500 mt-1">{log.reason}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
      </div>
      
      {scannedItemsPreview && (
        <ScannedItemsModal
          isOpen={true}
          onClose={() => setScannedItemsPreview(null)}
          scannedItems={scannedItemsPreview}
          onConfirm={handleConfirmScanned}
        />
      )}
    </motion.div>
  );
}
