const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace(
  "  weeklyTrainingDays?: number;\n};",
  "  weeklyTrainingDays?: number;\n  age?: number;\n  heightCm?: number;\n  weightKg?: number;\n  biologicalSex?: 'male' | 'female';\n};"
);
fs.writeFileSync('src/types.ts', content);
