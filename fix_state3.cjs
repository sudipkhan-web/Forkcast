const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// I also need to add the useEffect to auto-expand it when a person is edited.
// I will just add it below `const [editingPersonId, setEditingPersonId] = React.useState<string | null>(null);`
const target = "const [editingPersonId, setEditingPersonId] = React.useState<string | null>(null);";
code = code.replace(
  target, 
  target + `\n  const { household } = useApp();\n  React.useEffect(() => {\n    const person = household.find(p => p.id === editingPersonId);\n    if (person && person.raceType && person.raceType !== 'Not training for a race') {\n      setIsTrainingExpanded(true);\n    } else {\n      setIsTrainingExpanded(false);\n    }\n  }, [editingPersonId, household]);`
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
