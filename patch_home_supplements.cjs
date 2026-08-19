const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// 1. Add CheckCircle and Circle imports
code = code.replace(
  "Droplet, Plus, Minus } from 'lucide-react';",
  "Droplet, Plus, Minus, CheckCircle2, Circle } from 'lucide-react';"
);

// 2. Add state
const stateLine = "  const [waterMl, setWaterMl] = React.useState<number>(0);";
code = code.replace(
  stateLine,
  stateLine + "\n  const [supplementsTaken, setSupplementsTaken] = React.useState<string[]>([]);"
);

// 3. Add handleToggleSupplement
const toggleHandler = `
  const handleToggleSupplement = async (supp: string) => {
    const isTaken = supplementsTaken.includes(supp);
    const nextTaken = isTaken ? supplementsTaken.filter(s => s !== supp) : [...supplementsTaken, supp];
    setSupplementsTaken(nextTaken);
    if (auth.currentUser) {
      const today = new Date().toISOString().split('T')[0];
      const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
      setDoc(logRef, { supplementsTaken: nextTaken }, { merge: true });
    }
  };
`;
code = code.replace(
  "  const handleUpdateWater = async",
  toggleHandler + "\n  const handleUpdateWater = async"
);

// 4. Update mount effect to read supplementsTaken
code = code.replace(
  "setWaterMl(docSnap.data().waterMl || 0);",
  "setWaterMl(docSnap.data().waterMl || 0);\n          setSupplementsTaken(docSnap.data().supplementsTaken || []);"
);

// 5. Add UI block
const uiBlock = `
        {primaryPerson?.trackedSupplements && primaryPerson.trackedSupplements.length > 0 && (
          <div className="pt-3 mt-1 border-t border-stone-800 flex flex-col gap-2">
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide mb-0.5">Supplements</span>
            {primaryPerson.trackedSupplements.map(supp => {
              const isTaken = supplementsTaken.includes(supp);
              return (
                <button
                  key={supp}
                  onClick={() => handleToggleSupplement(supp)}
                  className="flex items-center gap-2 text-left active:scale-[0.98] transition-transform"
                >
                  {isTaken ? (
                    <CheckCircle2 className="w-4 h-4 text-[#FC5200]" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-600" />
                  )}
                  <span className={\`text-xs font-medium transition-colors \${isTaken ? 'text-stone-300' : 'text-stone-500'}\`}>
                    {supp}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
`;
code = code.replace(
  "        </div>\n      </div>",
  "        </div>\n" + uiBlock
);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Updated HomeView.tsx successfully");
