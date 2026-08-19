const fs = require('fs');

// --- 1. Fix PlanView.tsx ---
let planCode = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// Remove from interface
planCode = planCode.replace(/\s*trainingLogs\?:\s*any;/, "");

// Remove from destructured props
planCode = planCode.replace(/\s*trainingLogs,/, "");

// Replace the history map logic
const mapRegex = /\{Object\.keys\(trainingLogs \|\| \{\}\)\s*\.sort\(\(a, b\) => new Date\(b\)\.getTime\(\) - new Date\(a\)\.getTime\(\)\)\s*\.slice\(0, 14\)\s*\.map\(dateKey => \{\s*const log = trainingLogs\[dateKey\];/;

const newMapLogic = `{(trainingLogs || [])
                    .slice()
                    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 14)
                    .map((log: any) => {
                      const dateKey = log.date;`;

planCode = planCode.replace(mapRegex, newMapLogic);

fs.writeFileSync('src/views/PlanView.tsx', planCode);
console.log("Fixed PlanView.tsx");

// --- 2. Fix App.tsx ---
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Match trainingLogs={...} safely (even if it spans lines, though it probably doesn't anymore)
appCode = appCode.replace(/\n\s*trainingLogs=\{.*?\}/g, "");
appCode = appCode.replace(/\n\s*trainingLogs=\{[\s\S]*?\|\| \{\}\}/, ""); 
// The previous run might have left something behind if regex failed.

fs.writeFileSync('src/App.tsx', appCode);
console.log("Fixed App.tsx");

