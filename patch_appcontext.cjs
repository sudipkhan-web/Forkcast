const fs = require('fs');

let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Add queuedSuggestions to AppContextType
code = code.replace(
  "  trainingLogs: any[];",
  "  queuedSuggestions: any[] | null;\n  setQueuedSuggestions: React.Dispatch<React.SetStateAction<any[] | null>>;\n  trainingLogs: any[];"
);

// Add queuedSuggestions state
code = code.replace(
  "  const [profile, setProfile] = useState<UserProfile>({",
  "  const [queuedSuggestions, setQueuedSuggestions] = useState<any[] | null>(null);\n  const [profile, setProfile] = useState<UserProfile>({"
);

// Read from data in unsubProfile
code = code.replace(
  "        setDislikedMealIds(prev => JSON.stringify(prev) === JSON.stringify(data.dislikedMealIds || []) ? prev : (data.dislikedMealIds || []));",
  "        setDislikedMealIds(prev => JSON.stringify(prev) === JSON.stringify(data.dislikedMealIds || []) ? prev : (data.dislikedMealIds || []));\n        setQueuedSuggestions(prev => JSON.stringify(prev) === JSON.stringify(data.queuedSuggestions || null) ? prev : (data.queuedSuggestions || null));"
);

// Expose in Provider value
code = code.replace(
  "        profile,",
  "        queuedSuggestions,\n        setQueuedSuggestions,\n        profile,"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
