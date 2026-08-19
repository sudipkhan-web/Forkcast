const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// I will insert `const [isTrainingExpanded, setIsTrainingExpanded] = React.useState(false);`
// and a `React.useEffect` to set it based on the editing person.

code = code.replace(
  "  const { household, updateHouseholdMember, removeHouseholdMember, addHouseholdMember } = useApp();\n  const [activeTab, setActiveTab] = React.useState<'team' | 'preferences'>('team');",
  "  const { household, updateHouseholdMember, removeHouseholdMember, addHouseholdMember } = useApp();\n  const [activeTab, setActiveTab] = React.useState<'team' | 'preferences'>('team');\n  const [isTrainingExpanded, setIsTrainingExpanded] = React.useState(false);"
);

code = code.replace(
  "  const [newGroupDescription, setNewGroupDescription] = React.useState('');\n\n  const person = household.find(p => p.id === editingPersonId);",
  "  const [newGroupDescription, setNewGroupDescription] = React.useState('');\n\n  const person = household.find(p => p.id === editingPersonId);\n\n  React.useEffect(() => {\n    if (person && person.raceType && person.raceType !== 'Not training for a race') {\n      setIsTrainingExpanded(true);\n    } else {\n      setIsTrainingExpanded(false);\n    }\n  }, [editingPersonId]);"
);

// We need to wrap the sections in groups.
// Section 1: Cooking Preferences
// - Cooking Skill Level
// - Max Cooking Time
// - Favorite Cuisines

// Section 2: Dietary & Health
// - Dietary Preferences
// - Disliked Ingredients
// - Medical & Health Conditions

// Section 3: Training & Fueling
// - Race & Training Profile
// - Fine-tune your fueling
// - Supplements

fs.writeFileSync('src/views/ProfileView.tsx', code);
