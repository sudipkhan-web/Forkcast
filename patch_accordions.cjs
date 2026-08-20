const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const cuisineStart = `                    <section className={\`\${CARD} p-6\`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Favorite Cuisines</h2>
                    </div>`;

const cuisineNewStart = `              <div className={\`\${CARD} overflow-hidden\`}>
              <button
                onClick={() => {
                  const newSet = new Set(expandedCards);
                  if (newSet.has('cuisines')) newSet.delete('cuisines');
                  else newSet.add('cuisines');
                  setExpandedCards(newSet);
                }}
                className="w-full flex items-center justify-between p-6 focus:outline-none text-left"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Favorite Cuisines</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-stone-400">{person.favoriteCuisines?.length > 0 ? \`\${person.favoriteCuisines.length} selected\` : "None"}</span>
                  <ChevronRight className={\`w-4 h-4 text-stone-500 transition-transform duration-200 \${expandedCards.has('cuisines') ? 'rotate-90' : ''}\`} />
                </div>
              </button>
              <AnimatePresence>
                {expandedCards.has('cuisines') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 border-t border-stone-800/50 mt-2 space-y-4">`;

if (code.includes(cuisineStart)) {
  code = code.replace(cuisineStart, cuisineNewStart);
  console.log("Replaced Cuisines start");
} else {
  console.log("Failed to find Cuisines start");
}

const cuisineEnd = `                      ))}
                    </div>
                  </section>`;

const cuisineNewEnd = `                      ))}
                    </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>`;

if (code.includes(cuisineEnd)) {
  code = code.replace(cuisineEnd, cuisineNewEnd);
  console.log("Replaced Cuisines end");
} else {
  console.log("Failed to find Cuisines end");
}

const medicalStart = `                    <section className={\`\${CARD} p-6 relative overflow-hidden\`}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="flex items-center gap-2 mb-4 pl-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Medical & Health Conditions</h2>
                    </div>
                    <p className="text-xs text-stone-500 mb-4 pl-2">Tap to select any conditions you have. We'll strict-filter recipes to accommodate your needs.</p>
                    <div className="pl-2">`;

const medicalNewStart = `              <div className={\`\${CARD} relative overflow-hidden\`}>
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <button
                onClick={() => {
                  const newSet = new Set(expandedCards);
                  if (newSet.has('medical')) newSet.delete('medical');
                  else newSet.add('medical');
                  setExpandedCards(newSet);
                }}
                className="w-full flex items-center justify-between p-6 pl-8 focus:outline-none text-left"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Medical & Health Conditions</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-stone-400">{(person.healthConditions || [])?.length > 0 ? \`\${person.healthConditions.length} selected\` : "None"}</span>
                  <ChevronRight className={\`w-4 h-4 text-stone-500 transition-transform duration-200 \${expandedCards.has('medical') ? 'rotate-90' : ''}\`} />
                </div>
              </button>
              <AnimatePresence>
                {expandedCards.has('medical') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pl-8 pt-0 border-t border-stone-800/50 mt-2 space-y-4">
                      <p className="text-xs text-stone-500 mb-2">Tap to select any conditions you have. We'll strict-filter recipes to accommodate your needs.</p>`;

if (code.includes(medicalStart)) {
  code = code.replace(medicalStart, medicalNewStart);
  console.log("Replaced Medical start");
} else {
  console.log("Failed to find Medical start");
}

const medicalEnd = `                          </button>
                        ))}
                      </div>
                    </div>
                  </section>`;

const medicalNewEnd = `                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>`;

if (code.includes(medicalEnd)) {
  code = code.replace(medicalEnd, medicalNewEnd);
  console.log("Replaced Medical end");
} else {
  console.log("Failed to find Medical end");
}

fs.writeFileSync('src/views/ProfileView.tsx', code);
console.log("Done.");
