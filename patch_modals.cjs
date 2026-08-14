const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');

const modals = `
      {/* Modals */}
      {isDeferModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-400" />
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
                className="flex-1 bg-black/20 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500/50"
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
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                 <p className="text-sm text-stone-400">Ready to suggest staples?</p>
              </div>
            )}
          </div>
        </div>
      )}`;

code = code.replace("    </motion.div>\n  );\n}", modals + "\n    </motion.div>\n  );\n}");
fs.writeFileSync('src/views/ShopView.tsx', code);
