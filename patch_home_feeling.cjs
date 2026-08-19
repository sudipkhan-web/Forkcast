const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// 1. Add state
const stateLine = "  const [trainingDayType, setTrainingDayType] = React.useState<string | null>(null);";
code = code.replace(
  stateLine,
  stateLine + "\n  const [trainingFeeling, setTrainingFeeling] = React.useState<'strong' | 'ok' | 'rough' | 'dnf' | null>(null);"
);

// 2. Read on mount
code = code.replace(
  "setTrainingDayType(docSnap.data().dayType);",
  "setTrainingDayType(docSnap.data().dayType);\n          setTrainingFeeling(docSnap.data().trainingFeeling || null);"
);

// 3. Add handler
const feelingHandler = `
  const handleUpdateFeeling = async (feeling: 'strong' | 'ok' | 'rough' | 'dnf') => {
    setTrainingFeeling(feeling);
    if (auth.currentUser) {
      const today = new Date().toISOString().split('T')[0];
      const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
      setDoc(logRef, { trainingFeeling: feeling }, { merge: true });
    }
  };
`;
code = code.replace(
  "  const handleUpdateWater = async",
  feelingHandler + "\n  const handleUpdateWater = async"
);

// 4. Add UI below training day selector
const trainingDiv = `
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
`;

const feelingUI = `
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
`;

if (code.includes(trainingDiv)) {
  code = code.replace(trainingDiv, trainingDiv + feelingUI);
  fs.writeFileSync('src/views/HomeView.tsx', code);
  console.log("Updated HomeView.tsx successfully");
} else {
  console.log("trainingDiv not found! Retrying with regex...");
  code = code.replace(
    /(<select[\s\S]*?<\/select>\s*<Flame[^>]*\/>\s*<ChevronDown[^>]*\/>\s*<\/div>)/,
    "$1" + feelingUI
  );
  fs.writeFileSync('src/views/HomeView.tsx', code);
  console.log("Updated HomeView.tsx via regex");
}
