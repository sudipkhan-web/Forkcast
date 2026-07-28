const fs = require('fs');
let content = fs.readFileSync('src/views/ProgressView.tsx', 'utf8');

content = content.replace(
  "const { weeklyCoverage, currentStreak, carbTrend } = getProgressStats(trainingLogs);",
  "const { weeklyCoverage, currentStreak, carbTrend } = getProgressStats(trainingLogs, profile.weightKg);"
);

fs.writeFileSync('src/views/ProgressView.tsx', content);
