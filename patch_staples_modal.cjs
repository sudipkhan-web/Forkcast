const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');

// 1. Add state for stapleSuggestions
code = code.replace(
  "  const [isStaplesModalOpen, setIsStaplesModalOpen] = useState(false);",
  "  const [isStaplesModalOpen, setIsStaplesModalOpen] = useState(false);\n  const [stapleSuggestions, setStapleSuggestions] = useState<{name: string, selected: boolean}[]>([]);"
);

// 2. Rewrite handleSmartSuggest
const oldHandleSmartSuggest = `  const handleSmartSuggest = async () => {
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
  };`;

const newHandleSmartSuggest = `  const handleSmartSuggest = async () => {
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
    } finally {
      setIsGeneratingStaples(false);
    }
  };`;

code = code.replace(oldHandleSmartSuggest, newHandleSmartSuggest);

// 3. Update the Suggest Staples button to use handleSmartSuggest
code = code.replace(
  "onClick={() => setIsStaplesModalOpen(true)}",
  "onClick={handleSmartSuggest}"
);

// 4. Build out the modal UI
const oldModal = `      {isStaplesModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-xl">
             <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Suggest Staples
              </h3>
              <button onClick={() => setIsStaplesModalOpen(false)} className="text-stone-500 hover:text-white">
                <Minus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Placeholder for staples logic...
            </p>
            <button 
                onClick={() => setIsStaplesModalOpen(false)}
                className="w-full bg-[#FC5200] text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#FC5200] transition-colors active:scale-95"
              >
                Close
            </button>
          </div>
        </div>
      )}`;

const newModal = `      {isStaplesModalOpen && (
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
            ) : (
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
                      className={\`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left \${staple.selected ? 'bg-amber-500/10 border-amber-500/50' : 'bg-stone-900 border-stone-800 hover:border-stone-700'}\`}
                    >
                      <span className={\`font-medium text-sm \${staple.selected ? 'text-amber-400' : 'text-stone-300'}\`}>{staple.name}</span>
                      <div className={\`w-5 h-5 rounded flex items-center justify-center border transition-all \${staple.selected ? 'bg-amber-500 border-amber-500 text-stone-900' : 'border-stone-600 text-transparent'}\`}>
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
            )}
          </div>
        </div>
      )}`;

if (code.includes(oldModal)) {
  code = code.replace(oldModal, newModal);
} else {
  console.log("Could not find old modal code block. Attempting alternative replacement.");
}

fs.writeFileSync('src/views/ShopView.tsx', code);
