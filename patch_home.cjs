const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// I will insert state variables for the new modals if they aren't there.
if (!code.includes('const [isWaterModalOpen, setIsWaterModalOpen] = React.useState(false);')) {
  code = code.replace(
    "const [scannedMealPreview, setScannedMealPreview] = React.useState<any | null>(null);",
    "const [scannedMealPreview, setScannedMealPreview] = React.useState<any | null>(null);\n  const [isWaterModalOpen, setIsWaterModalOpen] = React.useState(false);\n  const [isSupplementsModalOpen, setIsSupplementsModalOpen] = React.useState(false);"
  );
}

// 1. "Today's Training" Block (lines 327-388)
// 2. "Fuel Targets" Block (lines 443-470)
// 3. "Daily Log" Block (lines 392-418, 420-441, 472-495)

const originalBlockRegex = /<div className=\{\`\$\{CARD\} mx-6 mt-3 p-\[14px\] flex flex-col gap-3\`\}>([\s\S]*?)<\/div>\s*<div className="px-6 mt-3 flex gap-2 w-full pb-2 shrink-0">/m;

const match = code.match(originalBlockRegex);
if (!match) {
    console.error("Could not find the block");
    process.exit(1);
}

// The inner contents of the block are extracted.
// Let's reconstruct it.
const reconstructed = `
      {primaryPerson?.raceType && primaryPerson.raceType !== 'Not training for a race' && (
        <div className={\`\${CARD} mx-6 mt-3 p-[14px] flex flex-col gap-3\`}>
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide mb-1.5">Today's Training</span>
            <div className="relative">
              <select
                value={trainingDayType || ''}
                onChange={async (e) => {
                  const next = e.target.value || null;
                  setTrainingDayType(next);
                  if (auth.currentUser) {
                    const today = new Date().toISOString().split('T')[0];
                    const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
                    setDoc(logRef, { dayType: next }, { merge: true });
                  }
                  setIsGeneratingMeals(true);
                  try {
                    await regenerateSuggestions(true, next);
                  } finally {
                    setIsGeneratingMeals(false);
                  }
                }}
                className="w-full appearance-none bg-stone-800 border border-stone-700 rounded-[10px] px-3 py-[9px] pl-9 pr-9 text-sm font-medium text-white focus:outline-none focus:border-[#FC5200] cursor-pointer"
              >
                <option value="">No training today</option>
                {TRAINING_DAY_OPTIONS.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
              <Flame className="w-4 h-4 text-[#FC5200] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {trainingDayType && trainingDayType !== 'Rest' && !trainingFeeling && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3 bg-stone-800/50 border border-stone-700 rounded-xl flex flex-col gap-2"
              >
                <span className="text-xs font-semibold text-stone-300">How did that session feel?</span>
                <div className="flex gap-2">
                  {[
                    { value: 'strong', label: 'Strong' },
                    { value: 'ok', label: 'OK' },
                    { value: 'rough', label: 'Rough' },
                    { value: 'dnf', label: 'Didn\\'t finish' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleUpdateFeeling(opt.value as any)}
                      className="flex-1 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg text-[10px] font-medium text-stone-300 hover:text-white transition-colors active:scale-95"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {trainingDayType && trainingDayType !== 'Rest' && trainingFeeling && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-stone-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Session marked as: <span className="text-stone-300 capitalize">{trainingFeeling === 'dnf' ? "Didn't finish" : trainingFeeling}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={\`\${CARD} mx-6 mt-3 p-[14px] flex flex-col gap-3\`}>
        <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide mb-1.5">Fuel Targets</span>
        <div className="flex gap-[14px] w-full">
          {[
            { label: 'CARBS', data: todayMacros.carbs },
            { label: 'PROTEIN', data: todayMacros.protein },
            { label: 'FAT', data: todayMacros.fat }
          ].map(macro => {
            const [, max] = macro.data.target;
            const current = macro.data.current;
            const percentage = Math.min((current / max) * 100, 100);
            const isOver = current > max;
            const isUnder = current < macro.data.target[0];
            let activeColor = 'bg-[#FC5200]';
            if (isUnder) activeColor = 'bg-stone-500';
            if (isOver) activeColor = 'bg-red-500';
            
            return (
              <div key={macro.label} className="flex-1 flex flex-col">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[9px] font-medium text-stone-400 uppercase tracking-wide">{macro.label}</span>
                  <span className="text-[9px] font-mono text-stone-300">{current}/{max}g</span>
                </div>
                <div className="h-[5px] w-full bg-stone-800 rounded-full overflow-hidden">
                  <div className={\`h-full rounded-full transition-all duration-500 \${activeColor}\`} style={{ width: \`\${percentage}%\` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={\`\${CARD} mx-6 mt-3 p-[14px] flex flex-col gap-3\`}>
        <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide mb-1.5">Daily Log</span>
        
        <div className="flex gap-2">
          {/* Water Chip */}
          <button 
            onClick={() => setIsWaterModalOpen(true)}
            className={\`flex-1 flex flex-col items-center gap-1 border rounded-xl py-2.5 px-1 transition-colors active:scale-95 \${waterMl > 0 ? 'bg-[#FC5200]/10 border-[#FC5200]/40' : 'bg-stone-800 border-stone-700'}\`}
          >
            <Droplet className={\`w-5 h-5 \${waterMl > 0 ? 'text-[#FC5200]' : 'text-blue-400'}\`} />
            <span className="text-sm font-semibold text-stone-200">{waterMl}ml</span>
            <span className="text-[9px] font-medium text-stone-400 uppercase tracking-wide">Water</span>
          </button>

          {/* Supplements Chip (Conditional) */}
          {primaryPerson?.trackedSupplements && primaryPerson.trackedSupplements.length > 0 && (
            <button
              onClick={() => setIsSupplementsModalOpen(true)}
              className={\`flex-1 flex flex-col items-center gap-1 border rounded-xl py-2.5 px-1 transition-colors active:scale-95 \${supplementsTaken.length > 0 ? 'bg-[#FC5200]/10 border-[#FC5200]/40' : 'bg-stone-800 border-stone-700'}\`}
            >
              <CheckCircle2 className={\`w-5 h-5 \${supplementsTaken.length > 0 ? 'text-[#FC5200]' : 'text-stone-400'}\`} />
              <span className="text-sm font-semibold text-stone-200">{supplementsTaken.length}/{primaryPerson.trackedSupplements.length}</span>
              <span className="text-[9px] font-medium text-stone-400 uppercase tracking-wide">Supplements</span>
            </button>
          )}

          {/* Log Meal Chip */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanningMeal}
            className={\`flex-1 flex flex-col items-center gap-1 border rounded-xl py-2.5 px-1 transition-colors active:scale-95 \${isScanningMeal ? 'opacity-50 pointer-events-none' : ''} bg-stone-800 border-stone-700\`}
          >
            {isScanningMeal ? <Loader2 className="w-5 h-5 animate-spin text-stone-400" /> : <Camera className="w-5 h-5 text-stone-400" />}
            <span className="text-sm font-semibold text-stone-200">+</span>
            <span className="text-[9px] font-medium text-stone-400 uppercase tracking-wide">Log Meal</span>
          </button>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleMealPhotoUpload} 
          />
        </div>
      </div>

      <div className="px-6 mt-3 flex gap-2 w-full pb-2 shrink-0">`;

code = code.replace(match[0], reconstructed);

// Also need to add the two modals somewhere at the bottom of the component (before the final </motion.div>)
const modals = `
      {/* Water Popover/Modal */}
      <AnimatePresence>
        {isWaterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsWaterModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={\`\${CARD} relative w-full max-w-[280px] z-10 flex flex-col p-4\`}
            >
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4 text-center">Log Water</h3>
              
              <div className="flex items-center justify-between bg-stone-900 border border-stone-800 rounded-xl p-3">
                <span className="text-lg font-bold text-stone-200">{waterMl} ml</span>
                <div className="flex items-center gap-1.5 p-1 bg-stone-950 border border-stone-800 rounded-lg">
                  <button
                    onClick={() => handleUpdateWater(-250)}
                    className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-stone-800 text-stone-400 hover:text-white transition-colors active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-stone-800" />
                  <button
                    onClick={() => handleUpdateWater(250)}
                    className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-stone-800 text-stone-400 hover:text-white transition-colors active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setIsWaterModalOpen(false)}
                className="mt-4 w-full py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-xs font-bold text-white transition-colors"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Supplements Popover/Modal */}
      <AnimatePresence>
        {isSupplementsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSupplementsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={\`\${CARD} relative w-full max-w-[280px] z-10 flex flex-col p-4\`}
            >
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-3 text-center">Track Supplements</h3>
              
              <div className="flex flex-col gap-1 max-h-[40vh] overflow-y-auto pr-1">
                {primaryPerson?.trackedSupplements?.map(supp => {
                  const isTaken = supplementsTaken.includes(supp);
                  return (
                    <button
                      key={supp}
                      onClick={() => handleToggleSupplement(supp)}
                      className="flex items-center gap-3 text-left active:scale-[0.98] transition-transform p-3 rounded-lg hover:bg-stone-800"
                    >
                      {isTaken ? (
                        <CheckCircle2 className="w-5 h-5 text-[#FC5200] shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-600 shrink-0" />
                      )}
                      <span className={\`text-sm font-medium transition-colors truncate \${isTaken ? 'text-stone-200' : 'text-stone-400'}\`}>
                        {supp}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setIsSupplementsModalOpen(false)}
                className="mt-3 w-full py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-xs font-bold text-white transition-colors"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
`;

code = code.replace("    </motion.div>\n  );\n}", modals + "\n    </motion.div>\n  );\n}");

fs.writeFileSync('src/views/HomeView.tsx', code);
