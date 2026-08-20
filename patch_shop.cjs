const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');

// Update imports
code = code.replace(
  "import React, { useState } from 'react';",
  "import React, { useState, useEffect, useRef } from 'react';"
);

// Update interface
code = code.replace(
  "likedTags: Record<string, number>;\n}",
  "likedTags: Record<string, number>;\n  customIngredientRules: Record<string, any>;\n}"
);

// Update function signature
code = code.replace(
  "likedTags\n}: ShopViewProps) {",
  "likedTags,\n  customIngredientRules\n}: ShopViewProps) {"
);

// Add state and effect right after `const { showToast } = useToast();`
const stateCode = `  const { showToast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const name = newShoppingItemName.trim();
    if (!name) {
      setSuggestions([]);
      return;
    }
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const norm = name.toLowerCase();
      const rules = Object.keys(customIngredientRules || {});
      const matches = rules.filter(r => r.includes(norm)).slice(0, 5);
      setSuggestions(matches);
    }, 250);
    
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [newShoppingItemName, customIngredientRules]);`;

code = code.replace("  const { showToast } = useToast();", stateCode);

// Update form input
const oldForm = `<form onSubmit={handleAddShoppingItem} className="flex gap-2">
          <input
            type="text"
            value={newShoppingItemName}
            onChange={(e) => setNewShoppingItemName(e.target.value)}
            placeholder="Add an item..."
            className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <button 
             type="submit"
            disabled={!newShoppingItemName.trim()}
            className={\`\${PRIMARY_BUTTON} px-5 py-3 disabled:opacity-50 text-sm\`}
          >
            Add
          </button>
        </form>`;

const newForm = `<form onSubmit={(e) => { setSuggestions([]); handleAddShoppingItem(e); }} className="flex gap-2 relative">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newShoppingItemName}
              onChange={(e) => setNewShoppingItemName(e.target.value)}
              placeholder="Add an item..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC5200]/20 focus:border-[#FC5200] transition-all text-white placeholder:text-stone-400"
            />
            {suggestions.length > 0 && newShoppingItemName.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-stone-800 border border-stone-700 rounded-lg shadow-xl overflow-hidden z-20">
                {suggestions.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setNewShoppingItemName(s);
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
            disabled={!newShoppingItemName.trim()}
            className={\`\${PRIMARY_BUTTON} px-5 py-3 disabled:opacity-50 text-sm\`}
          >
            Add
          </button>
        </form>`;

code = code.replace(oldForm, newForm);

fs.writeFileSync('src/views/ShopView.tsx', code);
