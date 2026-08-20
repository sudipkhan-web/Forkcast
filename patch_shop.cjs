const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');

const target = `<form onSubmit={handleAddShoppingItem} className="flex gap-2">
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

const replacement = `<div className="relative">
          <form onSubmit={handleAddShoppingItem} className="flex gap-2">
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
          </form>
          {suggestions.length > 0 && newShoppingItemName.trim() && (
            <div className={\`absolute left-0 right-0 top-full mt-2 z-20 \${CARD} overflow-hidden\`}>
              {suggestions.map(s => (
                <button 
                  key={s} 
                  onClick={() => { setNewShoppingItemName(s); setSuggestions([]); }} 
                  className="w-full text-left px-4 py-2.5 text-sm text-stone-200 hover:bg-stone-800 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/views/ShopView.tsx', code);
console.log("Patched ShopView.tsx");
