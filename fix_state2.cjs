const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// I'll add it directly inside the ProfileView component
const componentRootStr = 'export function ProfileView() {\n';
code = code.replace(
  componentRootStr, 
  componentRootStr + "  const [isTrainingExpanded, setIsTrainingExpanded] = React.useState(false);\n"
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
