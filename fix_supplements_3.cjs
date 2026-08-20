const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const targetStr = `                  </div>

                  <div className="mt-8 mb-4">
                    <h2 className="text-xs text-[#FC5200] uppercase tracking-widest font-bold">Training & Fueling</h2>`;

const suppBlock = `              {/* Supplements */}
              <div className={\`\${CARD} overflow-hidden\`}>
                <button
                  onClick={() => {
                    const newSet = new Set(expandedCards);
                    if (newSet.has('supplements')) newSet.delete('supplements');
                    else newSet.add('supplements');
                    setExpandedCards(newSet);
                  }}
                  className="w-full flex items-center justify-between p-6 focus:outline-none text-left"
                >
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-purple-500" />
                    <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Supplements</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-stone-400">{person.trackedSupplements?.length > 0 ? \`\${person.trackedSupplements.length} tracked\` : "None"}</span>
                    <ChevronRight className={\`w-4 h-4 text-stone-500 transition-transform duration-200 \${expandedCards.has('supplements') ? 'rotate-90' : ''}\`} />
                  </div>
                </button>
                <AnimatePresence>
                  {expandedCards.has('supplements') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t border-stone-800/50 mt-2 space-y-4">
                        <p className="text-xs text-stone-500 mb-2">Track daily supplements on your Home tab.</p>
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            const el = e.currentTarget.elements.namedItem('supp') as HTMLInputElement;
                            const val = el.value.trim();
                            if (!val) return;
                            const current = person.trackedSupplements || [];
                            if (!current.includes(val)) {
                              updateHouseholdMember({ ...person, trackedSupplements: [...current, val] });
                            }
                            el.value = '';
                          }}
                          className="flex gap-2"
                        >
                          <input
                            name="supp"
                            type="text"
                            placeholder="Add supplement (e.g. Fish Oil)..."
                            className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC5200]/20 focus:border-[#FC5200] text-white transition-all"
                          />
                          <button type="submit" className={\`\${PRIMARY_BUTTON} px-5 py-2.5 text-sm\`}>Add</button>
                        </form>
                        <div className="flex flex-wrap gap-2">
                          {(person.trackedSupplements || []).map(supp => (
                            <button
                              key={supp}
                              onClick={() => {
                                updateHouseholdMember({
                                  ...person,
                                  trackedSupplements: person.trackedSupplements.filter(s => s !== supp)
                                });
                              }}
                              type="button"
                              className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors flex items-center gap-1 group"
                            >
                              {supp}
                              <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
`;

let targetIdx = code.indexOf(targetStr);
if (targetIdx !== -1) {
  code = code.slice(0, targetIdx) + suppBlock + code.slice(targetIdx);
  fs.writeFileSync('src/views/ProfileView.tsx', code);
  console.log("Supplements inserted!");
} else {
  console.log("Could not find targetStr");
  
  // try fallback target
  const targetStr2 = `                  <div className="mt-8 mb-4">
                    <h2 className="text-xs text-[#FC5200] uppercase tracking-widest font-bold">Training & Fueling</h2>`;
  const targetIdx2 = code.indexOf(targetStr2);
  if (targetIdx2 !== -1) {
     const lastDivIdx = code.lastIndexOf('</div>', targetIdx2);
     if (lastDivIdx !== -1) {
       code = code.slice(0, lastDivIdx) + suppBlock + code.slice(lastDivIdx);
       fs.writeFileSync('src/views/ProfileView.tsx', code);
       console.log("Supplements inserted via fallback!");
     }
  } else {
    console.log("Total failure.");
  }
}

