const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// I need to add `const [isTrainingExpanded, setIsTrainingExpanded] = useState(false);`
// and the useEffect to the component root.

const target = "  const [newDietary, setNewDietary] = useState('');";

code = code.replace(
  target, 
  target + `
  const [isTrainingExpanded, setIsTrainingExpanded] = useState(false);

  React.useEffect(() => {
    const person = household.find(p => p.id === editingPersonId);
    if (person && person.raceType && person.raceType !== 'Not training for a race') {
      setIsTrainingExpanded(true);
    } else {
      setIsTrainingExpanded(false);
    }
  }, [editingPersonId, household]);
`
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
