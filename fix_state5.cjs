const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// I'll add the state at the top of the ProfileView component, line 20.
// Let's find `export function ProfileView({`
const target = "export function ProfileView({\n  household,";
code = code.replace(
  target, 
  target + "\n  isTrainingExpanded, setIsTrainingExpanded,"
);

// Wait, ProfileView receives props! Let's check its definition.
