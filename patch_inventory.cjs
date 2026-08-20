const fs = require('fs');
let code = fs.readFileSync('src/views/InventoryView.tsx', 'utf8');

// Add Loader2 and useEffect to imports
code = code.replace(
  "import { Star, Share, Camera, Scan, Receipt, Plus, Minus, Trash2, Archive, ChevronDown } from 'lucide-react';",
  "import { Star, Share, Camera, Scan, Receipt, Plus, Minus, Trash2, Archive, ChevronDown, Loader2 } from 'lucide-react';"
);
if (!code.includes("useEffect")) {
  code = code.replace(
    "import React, { useState, useRef, useContext, useMemo } from 'react';",
    "import React, { useState, useRef, useContext, useMemo, useEffect } from 'react';"
  );
} else {
  code = code.replace(
    "import React, { useState, useRef, useContext, useMemo } from 'react';",
    "import React, { useState, useRef, useContext, useMemo, useEffect } from 'react';"
  );
}

// Ensure useEffect is in the import if it was destructured differently
// Oh wait, `useEffect` was just added in the replacement above!

const stateVars = `
  const [activeLocationTab, setActiveLocationTab] = useState<'fridge' | 'pantry'>('fridge');
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState(false);
  const [isAddSectionExpanded, setIsAddSectionExpanded] = useState(false);
  
  const [newIngredientLocation, setNewIngredientLocation] = useState<'fridge' | 'pantry'>('pantry');
  const [newIngredientCategory, setNewIngredientCategory] = useState<string>('Other');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isClassifying, setIsClassifying] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const { customIngredientRules, updateCustomIngredientRule, userId } = useContext(AppContext)!;
`;

code = code.replace(
  /const \[activeLocationTab, setActiveLocationTab\] = useState\<'fridge' \| 'pantry'\>\('fridge'\);\n  const \[isQuickAddExpanded, setIsQuickAddExpanded\] = useState\(false\);\n  const \[isAddSectionExpanded, setIsAddSectionExpanded\] = useState\(false\);\n  \n  const \{ customIngredientRules, updateCustomIngredientRule, userId \} = useContext\(AppContext\)!(;)?/,
  stateVars
);

const useEffectCode = `
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

  const syncInventoryItem`;

code = code.replace("  const syncInventoryItem", useEffectCode);


const addInventoryRegex = /const addInventoryItem = async \(e: React\.FormEvent\) => \{[\s\S]*?setNewIngredientExpiresAt\(''\);\n  \};/;

const newAddInventoryItem = `const addInventoryItem = async (e: React.FormEvent) => {
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
  };`;

code = code.replace(addInventoryRegex, newAddInventoryItem);

const formRegex = /<form onSubmit=\{addInventoryItem\} className="flex flex-col gap-2 pb-2">[\s\S]*?<\/form>/;

const newForm = `<form onSubmit={addInventoryItem} className="flex flex-col gap-2 pb-2 relative">
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
                          className={\`\${PRIMARY_BUTTON} p-3 disabled:opacity-50\`}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1 overflow-visible pb-1">
                        <div className="flex bg-stone-900 p-1 rounded-lg shrink-0">
                          <button
                            type="button"
                            onClick={() => setNewIngredientLocation('fridge')}
                            className={\`px-3 py-1.5 text-xs font-medium rounded-md transition-colors \${newIngredientLocation === 'fridge' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-stone-300'}\`}
                          >
                            Fridge
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewIngredientLocation('pantry')}
                            className={\`px-3 py-1.5 text-xs font-medium rounded-md transition-colors \${newIngredientLocation === 'pantry' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-stone-300'}\`}
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
                    </form>`;

code = code.replace(formRegex, newForm);

fs.writeFileSync('src/views/InventoryView.tsx', code);
