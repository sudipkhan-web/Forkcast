const fs = require('fs');
let code = fs.readFileSync('src/views/ShopView.tsx', 'utf8');

// 1. Add state
code = code.replace(
  "  const [isGeneratingStaples, setIsGeneratingStaples] = useState(false);",
  "  const [isGeneratingStaples, setIsGeneratingStaples] = useState(false);\n  const [isDeferModalOpen, setIsDeferModalOpen] = useState(false);\n  const [isStaplesModalOpen, setIsStaplesModalOpen] = useState(false);"
);

// 2. Add buttons and remove old blocks
const oldStart = `<div className="px-6 py-4 bg-emerald-500/10 border-b border-emerald-500/20 flex flex-col gap-3 shrink-0">`;
const oldEnd = `      <div className="flex-1 overflow-y-auto p-6 pb-32">`;

const parts = code.split(oldStart);
const beforeOld = parts[0];
const afterOldStart = parts[1];
const innerParts = afterOldStart.split(oldEnd);
const afterOldEnd = innerParts.slice(1).join(oldEnd);

const buttonsBlock = `
        <div className="flex items-center gap-2 mt-4">
          <button 
            onClick={() => setIsDeferModalOpen(true)}
            className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-full px-4 py-2 text-xs font-medium text-stone-300 hover:border-stone-700 hover:text-white transition-all active:scale-[0.98]"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Defer Perishables
          </button>
          <button 
            onClick={() => setIsStaplesModalOpen(true)}
            className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-full px-4 py-2 text-xs font-medium text-stone-300 hover:border-stone-700 hover:text-white transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Suggest Staples
          </button>
        </div>
`;

// we need to insert buttonsBlock right after the </form> in beforeOld.
let newBeforeOld = beforeOld.replace('        </form>', '        </form>' + buttonsBlock);

// 3. Add modals at the bottom of the component
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
      )}
`;

let newAfterOldEnd = oldEnd + afterOldEnd;
newAfterOldEnd = newAfterOldEnd.replace('    </div>\n  );\n}', modals + '    </div>\n  );\n}');

code = newBeforeOld + newAfterOldEnd;
fs.writeFileSync('src/views/ShopView.tsx', code);
