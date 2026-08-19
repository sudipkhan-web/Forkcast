const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// The issue seems to be that trainingLogs isn't defined inside PlanView because useAppContext isn't 
// actually returning it or it's not being destructured there.
// Let's verify exactly what PlanView destructured from useAppContext.
const destructureMatch = code.match(/const \{[\s\S]*?\} = useAppContext\(\);/);
if (destructureMatch) {
  let destructure = destructureMatch[0];
  if (!destructure.includes('trainingLogs')) {
    const newDestructure = destructure.replace(/const \{/, "const { trainingLogs,");
    code = code.replace(destructureMatch[0], newDestructure);
  }
} else {
  // Add it if completely missing
  code = code.replace(
    /const \[viewMode, setViewMode\]/,
    "const { trainingLogs } = useAppContext();\n  const [viewMode, setViewMode]"
  );
}

fs.writeFileSync('src/views/PlanView.tsx', code);
console.log("Fixed trainingLogs destructuring");
