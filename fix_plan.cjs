const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// Replace the incorrect closing div at around line 344 (which is after `})}` and before `{manualMealDate`)
code = code.replace(/}\)}\n\s*<\/div>\n\s*\{manualMealDate && \(/, '})}\n\n      {manualMealDate && (');

fs.writeFileSync('src/views/PlanView.tsx', code);
