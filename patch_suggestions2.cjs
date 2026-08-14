const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldEffect = `  const [suggestions, setSuggestions] = useState<(Meal & { dynamicReason: string, groupReason?: string })[]>([]);
  const [hasLoadedSuggestions, setHasLoadedSuggestions] = useState(false);

  useEffect(() => {
    if (userId && isAuthReady) {
      if (!hasLoadedSuggestions) {
        if (queuedSuggestions !== null) {
          setSuggestions(queuedSuggestions);
          setHasLoadedSuggestions(true);
        } else if (queuedSuggestions === null && isAuthReady) {
           // We might need to handle the case where the user profile exists but no queuedSuggestions field yet
           // But since queuedSuggestions comes from AppContext, if it's null it could mean not loaded OR doesn't exist.
           // Let's actually check how AppContext initializes.
        }
      }
    } else if (!userId && isAuthReady) {
      if (!hasLoadedSuggestions) {
        setSuggestions([]);
        setHasLoadedSuggestions(true);
      }
    }
  }, [userId, isAuthReady, hasLoadedSuggestions, queuedSuggestions]);`;

const newEffect = `  const [suggestions, setSuggestions] = useState<(Meal & { dynamicReason: string, groupReason?: string })[]>([]);
  const [hasLoadedSuggestions, setHasLoadedSuggestions] = useState(false);

  useEffect(() => {
    if (userId && isAuthReady) {
      if (!hasLoadedSuggestions && queuedSuggestions !== null) {
        setSuggestions(queuedSuggestions);
        setHasLoadedSuggestions(true);
      }
    } else if (!userId && isAuthReady) {
      if (!hasLoadedSuggestions) {
        setSuggestions([]);
        setHasLoadedSuggestions(true);
      }
    }
  }, [userId, isAuthReady, hasLoadedSuggestions, queuedSuggestions]);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/App.tsx', code);
