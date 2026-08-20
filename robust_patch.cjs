const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const suppCommentIdx = code.indexOf('{/* Supplements */}');
if (suppCommentIdx === -1) {
  console.log("Could not find {/* Supplements */}!");
  process.exit(1);
}

// Backtrack to the `</div>` that is before `{/* Supplements */}`. 
// Actually, we can just start replacing exactly AT `{/* Supplements */}`.
const startIdx = suppCommentIdx;

// We need to find where the broken section ends.
// The broken section contains the "Groups" logic, ending with `</AnimatePresence>\n            </div>`
const groupSearchStr = `Create groups like "Family" or "Friends"`;
const groupIdx = code.indexOf(groupSearchStr);
if (groupIdx === -1) {
  console.log("Could not find group string!");
  process.exit(1);
}

// Search forward from groupIdx to find the end of that broken div:
const endStr = `</AnimatePresence>`;
const endAnimatePresenceIdx = code.indexOf(endStr, groupIdx);
if (endAnimatePresenceIdx === -1) {
  console.log("Could not find </AnimatePresence> after groups!");
  process.exit(1);
}

const finalEndIdx = code.indexOf('</div>', endAnimatePresenceIdx) + '</div>'.length;

const replacementStr = `{/* Supplements */}
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
                            const el = e.currentTarget.elements.namedItem('supp');
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

              <div className={\`\${CARD} overflow-hidden\`}>
                <button
                  onClick={() => {
                    const newSet = new Set(expandedCards);
                    if (newSet.has('fueling')) newSet.delete('fueling');
                    else newSet.add('fueling');
                    setExpandedCards(newSet);
                  }}
                  className="w-full flex items-center justify-between p-6 focus:outline-none text-left"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Fine-tune your fueling</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-stone-400">{(person.age || person.weightKg || person.heightCm) ? "Configured" : "None"}</span>
                    <ChevronRight className={\`w-4 h-4 text-stone-500 transition-transform duration-200 \${expandedCards.has('fueling') ? 'rotate-90' : ''}\`} />
                  </div>
                </button>
                <AnimatePresence>
                  {expandedCards.has('fueling') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-4 border-t border-stone-800/50 mt-2">
                        <p className="text-xs text-stone-400 mb-4 font-medium">Optional — helps us personalize carb and calorie targets to your body.</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-stone-300 mb-1 block">Age</label>
                            <input 
                              type="number"
                              className="w-full bg-stone-950 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5 outline-none transition-colors"
                              value={person.age || ''}
                              onChange={(e) => {
                                const value = e.target.value ? Number(e.target.value) : undefined;
                                updateHouseholdMember({ ...person, age: value });
                              }}
                              placeholder="e.g. 30"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-stone-300 mb-1 block">Biological Sex</label>
                            <div className="flex gap-2">
                              {BIOLOGICAL_SEX_OPTIONS.map(sex => (
                                <button
                                  key={sex}
                                  onClick={() => {
                                    updateHouseholdMember({ ...person, biologicalSex: sex });
                                  }}
                                  className={\`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all active:scale-[0.98] border \${
                                    person.biologicalSex === sex
                                      ? 'bg-orange-500/10 border-[#FC5200] text-[#FC5200]'
                                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-white'
                                  }\`}
                                >
                                  {sex}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-stone-300 mb-1 block">Height (cm)</label>
                            <input 
                              type="number"
                              className="w-full bg-stone-950 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5 outline-none transition-colors"
                              value={person.heightCm || ''}
                              onChange={(e) => {
                                const value = e.target.value ? Number(e.target.value) : undefined;
                                updateHouseholdMember({ ...person, heightCm: value });
                              }}
                              placeholder="e.g. 175"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-stone-300 mb-1 block">Weight (kg)</label>
                            <input 
                              type="number"
                              className="w-full bg-stone-950 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-[#FC5200] focus:border-[#FC5200] block p-2.5 outline-none transition-colors"
                              value={person.weightKg || ''}
                              onChange={(e) => {
                                const value = e.target.value ? Number(e.target.value) : undefined;
                                updateHouseholdMember({ ...person, weightKg: value });
                              }}
                              placeholder="e.g. 70"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {household.length > 1 && (
              <div className="pt-4">
                <button
                  onClick={() => {
                    deleteHouseholdMember(person.id);
                    setEditingPersonId(null);
                  }}
                  className="w-full py-4 bg-red-500/10 text-red-600 rounded-2xl font-semibold text-sm hover:bg-red-500/20 transition-all active:scale-[0.98] border border-red-500/20"
                >
                  Delete Member
                </button>
              </div>
            )}
          </>
        );
      })()}
    </div>
  </motion.div>
</AnimatePresence>
)}

  <div className="flex items-center justify-between mb-4 mt-8">
    <div className="flex items-center gap-2">
      <Users className="w-5 h-5 text-[#FC5200]" />
      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Cooking Groups</h2>
    </div>
    <button 
      onClick={() => {
        const newId = \`g\${Date.now()}\`;
        const newGroup: Group = { id: newId, name: 'New Group', memberIds: [] };
        updateGroup(newGroup);
        setEditingGroupId(newId);
      }}
      className="text-[#FC5200] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-all active:scale-[0.98]"
    >
      <Plus className="w-4 h-4" /> Add
    </button>
  </div>
  <p className="text-sm text-stone-500 mb-4">
    Create groups like "Family" or "Friends" to quickly select who you are cooking for.
  </p>
  <div className="space-y-4">
    {groups.map(group => (
      <div key={group.id} className={\`\${CARD} p-5 flex items-center justify-between\`}>
        <div>
          <h3 className="font-display font-bold text-white">{group.name}</h3>
          <p className="text-xs text-stone-500 mt-1">
            {group.memberIds.length} member{group.memberIds.length !== 1 ? 's' : ''}
            {group.memberIds.length > 0 && \` • \${group.memberIds.map(id => household.find(h => h.id === id)?.name).filter(Boolean).join(', ')}\`}
          </p>
        </div>
        <button 
          onClick={() => setEditingGroupId(group.id)}
          className={\`\${ICON_BUTTON}\`}>
          <Settings className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>`;

const newCode = code.substring(0, startIdx) + replacementStr + code.substring(finalEndIdx);
fs.writeFileSync('src/views/ProfileView.tsx', newCode);
console.log("SUCCESS!");
