const fs = require('fs');
let code = fs.readFileSync('src/views/ProgressView.tsx', 'utf8');

// 1. Update import
code = code.replace(
  "import { getProgressStats } from '../utils/progressUtils';",
  "import { getProgressStats, getFuelingPerformanceCorrelation } from '../utils/progressUtils';"
);

// 2. Add correlation calculation
code = code.replace(
  "const activeTrend = activeMacro === 'carbs' ? carbTrend : activeMacro === 'protein' ? proteinTrend : fatTrend;",
  "const activeTrend = activeMacro === 'carbs' ? carbTrend : activeMacro === 'protein' ? proteinTrend : fatTrend;\n  const correlation = getFuelingPerformanceCorrelation(trainingLogs, primaryPerson?.weightKg);"
);

// 3. Add UI below the legend
const legendEndStr = '          </div>\n        </div>';
const uiStr = `
        <div className={\`\${CARD} p-6\`}>
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4">Fueling & Performance</h3>
          <p className="text-xs text-stone-400 mb-4">How hitting your carb targets correlates with how strong you feel during training.</p>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center bg-stone-800/30 p-3 rounded-lg border border-stone-800">
              <span className="text-sm font-medium text-stone-300">Days you hit carb target:</span>
              <span className="text-sm font-bold text-emerald-400">{correlation.hitCarbTotal > 0 ? \`\${correlation.hitCarbStrong}/\${correlation.hitCarbTotal} Strong\` : 'No data'}</span>
            </div>
            <div className="flex justify-between items-center bg-stone-800/30 p-3 rounded-lg border border-stone-800">
              <span className="text-sm font-medium text-stone-300">Days you didn't:</span>
              <span className="text-sm font-bold text-rose-400">{correlation.missCarbTotal > 0 ? \`\${correlation.missCarbStrong}/\${correlation.missCarbTotal} Strong\` : 'No data'}</span>
            </div>
          </div>
        </div>
`;

code = code.replace(legendEndStr, legendEndStr + "\n" + uiStr);

fs.writeFileSync('src/views/ProgressView.tsx', code);
console.log("Updated ProgressView.tsx");
