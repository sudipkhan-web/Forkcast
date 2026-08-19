const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

code = code.replace(
  "import { Star, RefreshCw, Sparkles, Share, Target, User, ChevronDown, Flame } from 'lucide-react';",
  "import { Star, RefreshCw, Sparkles, Share, Target, User, ChevronDown, Flame, Droplet, Plus, Minus } from 'lucide-react';"
);

code = code.replace(
  "import { CARD, ICON_BUTTON, PRIMARY_BUTTON } from '../styles/designTokens';",
  "import { CARD, ICON_BUTTON, PRIMARY_BUTTON, STEPPER } from '../styles/designTokens';"
);

// Add waterMl state
const stateLine = "  const [trainingDayType, setTrainingDayType] = React.useState<string | null>(null);";
code = code.replace(
  stateLine,
  stateLine + "\n  const [waterMl, setWaterMl] = React.useState<number>(0);"
);

// Add water update handler
const handleUpdateWater = `
  const handleUpdateWater = async (delta: number) => {
    const nextWater = Math.max(0, Math.min(10000, waterMl + delta));
    setWaterMl(nextWater);
    if (auth.currentUser) {
      const today = new Date().toISOString().split('T')[0];
      const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
      setDoc(logRef, { waterMl: nextWater }, { merge: true });
    }
  };
`;

code = code.replace(
  "  React.useEffect(() => {",
  handleUpdateWater + "\n  React.useEffect(() => {"
);

// Read waterMl on mount
code = code.replace(
  "setTrainingDayType(docSnap.data().dayType);",
  "setTrainingDayType(docSnap.data().dayType);\n          setWaterMl(docSnap.data().waterMl || 0);"
);

// Add water tracker UI
const macroDiv = '<div className="flex gap-[14px] w-full">';
const waterUI = `
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-stone-300">Water</span>
            <span className="text-xs font-medium text-stone-500 ml-1">{waterMl} ml</span>
          </div>
          <div className={STEPPER}>
            <button
              onClick={() => handleUpdateWater(-250)}
              className="w-[26px] h-[26px] flex items-center justify-center rounded-[8px] hover:bg-[#303136] text-stone-400 hover:text-white transition-colors active:scale-95"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3 bg-[#303136]" />
            <button
              onClick={() => handleUpdateWater(250)}
              className="w-[26px] h-[26px] flex items-center justify-center rounded-[8px] hover:bg-[#303136] text-stone-400 hover:text-white transition-colors active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
`;

code = code.replace(macroDiv, waterUI + "\n        " + macroDiv);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Updated HomeView.tsx successfully");
