const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// We need to find the `editingPersonId && (` block
// The block currently looks like:
/*
            {editingPersonId && (
              <div className="pt-6 border-t border-stone-800 space-y-8 animate-in fade-in slide-in-from-bottom-4" id="member-settings">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-bold text-white">
                    Editing Member
                  </h2>
                  <button onClick={() => setEditingPersonId(null)} className={`${PRIMARY_BUTTON} px-4 py-2 text-sm`}>
                    Close
                  </button>
                </div>
                {(() => {
*/

// And we want to replace it with an overlay.
const targetStart = '{editingPersonId && (\n              <div className="pt-6 border-t border-stone-800 space-y-8 animate-in fade-in slide-in-from-bottom-4" id="member-settings">\n                <div className="flex items-center justify-between">\n                  <h2 className="text-xl font-display font-bold text-white">\n                    Editing Member\n                  </h2>\n                  <button onClick={() => setEditingPersonId(null)} className={`${PRIMARY_BUTTON} px-4 py-2 text-sm`}>\n                    Close\n                  </button>\n                </div>';

const replaceStart = `{editingPersonId && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 bg-[#17181C] overflow-y-auto"
            >
              <div className="sticky top-0 z-10 bg-[#17181C]/95 backdrop-blur-xl border-b border-stone-800 px-6 py-4 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-display font-bold text-white">
                  Editing Member
                </h2>
                <button onClick={() => setEditingPersonId(null)} className={\`\${PRIMARY_BUTTON} px-4 py-2 text-sm\`}>
                  Close
                </button>
              </div>
              <div className="p-6 space-y-8">`;

// And we need to close the AnimatePresence and motion.div at the bottom of the block
// At the end of the block, there is:
/*
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
            )}
*/

code = code.replace(targetStart, replaceStart);

const targetEnd = `                  )}
                </>
              );
            })()}
              </div>
            )}`;

const replaceEnd = `                  )}
                </>
              );
            })()}
              </div>
            </motion.div>
          </AnimatePresence>
        )}`;

code = code.replace(targetEnd, replaceEnd);
fs.writeFileSync('src/views/ProfileView.tsx', code);
