const fs = require('fs');
let code = fs.readFileSync('src/views/ProgressView.tsx', 'utf8');

const targetStr = `{/* Race Countdown */}
        {daysRemaining !== null ? (
          <div className={\`\${CARD} flex flex-col items-center justify-center py-6\`}>
            <span className="text-6xl font-mono font-bold text-[#FC5200]">{daysRemaining}</span>
            <span className="text-sm font-display font-bold text-stone-400 uppercase tracking-widest mt-2">Days to Race</span>
            {primaryPerson?.raceType && (
              <span className="text-xs text-stone-500 mt-1">{primaryPerson?.raceType}</span>
            )}
          </div>
        ) : (
          <div className={\`\${CARD} flex flex-col items-center justify-center py-10 text-center px-6\`}>
            <Target className="w-12 h-12 text-stone-600 mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">No Race Date Set</h2>
            <p className="text-sm text-stone-400 mb-6">Complete your profile to track your countdown and daily fueling goals.</p>
            <button 
              onClick={() => setActiveTab('profile')}
              className="bg-[#FC5200] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-[#FC5200]/20 hover:bg-orange-600 transition-all active:scale-95"
            >
              Update Profile
            </button>
          </div>
        )}`;

const replacementStr = `{/* Race Countdown */}
        {primaryPerson?.raceType && primaryPerson.raceType !== 'Not training for a race' && (
          <>
            {daysRemaining !== null ? (
              <div className={\`\${CARD} flex flex-col items-center justify-center py-6\`}>
                <span className="text-6xl font-mono font-bold text-[#FC5200]">{daysRemaining}</span>
                <span className="text-sm font-display font-bold text-stone-400 uppercase tracking-widest mt-2">Days to Race</span>
                {primaryPerson?.raceType && (
                  <span className="text-xs text-stone-500 mt-1">{primaryPerson?.raceType}</span>
                )}
              </div>
            ) : (
              <div className={\`\${CARD} flex flex-col items-center justify-center py-10 text-center px-6\`}>
                <Target className="w-12 h-12 text-stone-600 mb-4" />
                <h2 className="text-lg font-bold text-white mb-2">No Race Date Set</h2>
                <p className="text-sm text-stone-400 mb-6">Complete your profile to track your countdown and daily fueling goals.</p>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="bg-[#FC5200] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-[#FC5200]/20 hover:bg-orange-600 transition-all active:scale-95"
                >
                  Update Profile
                </button>
              </div>
            )}
          </>
        )}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync('src/views/ProgressView.tsx', code);
  console.log("Success");
} else {
  console.log("Could not find string. Using regex fallback.");
  const blockRegex = /\{\/\* Race Countdown \*\/\}[\s\S]*?<\/div>\s*\)\}/m;
  const match = code.match(blockRegex);
  if (match) {
    code = code.replace(match[0], replacementStr);
    fs.writeFileSync('src/views/ProgressView.tsx', code);
    console.log("Regex replacement success");
  } else {
    console.log("Regex fallback failed");
  }
}
