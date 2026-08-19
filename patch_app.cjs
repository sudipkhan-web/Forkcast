const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<PlanView\n\s*plannedMeals=\{plannedMeals\}/,
  "<PlanView\n            trainingLogs={trainingLogs?.reduce((acc: any, log: any) => ({...acc, [log.date]: log}), {}) || {}}\n            household={household}\n            plannedMeals={plannedMeals}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx to pass new PlanView props");
