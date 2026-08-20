const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const stateVars = `
  const [newHealthCondition, setNewHealthCondition] = useState('');
  const [newFavoriteCuisine, setNewFavoriteCuisine] = useState('');
  const [newSupplement, setNewSupplement] = useState('');
`;

const newStateVars = `
  const [newHealthCondition, setNewHealthCondition] = useState('');
  const [newFavoriteCuisine, setNewFavoriteCuisine] = useState('');
  const [newSupplement, setNewSupplement] = useState('');

  const [cuisineSuggestions, setCuisineSuggestions] = useState<string[]>([]);
  const [dietarySuggestions, setDietarySuggestions] = useState<string[]>([]);
  const [dislikedSuggestions, setDislikedSuggestions] = useState<string[]>([]);
  const [healthConditionSuggestions, setHealthConditionSuggestions] = useState<string[]>([]);
  
  const cuisineDebounceRef = useRef<NodeJS.Timeout>();
  const dietaryDebounceRef = useRef<NodeJS.Timeout>();
  const dislikedDebounceRef = useRef<NodeJS.Timeout>();
  const healthDebounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const term = newFavoriteCuisine.trim().toLowerCase();
    if (!term) { setCuisineSuggestions([]); return; }
    if (cuisineDebounceRef.current) clearTimeout(cuisineDebounceRef.current);
    cuisineDebounceRef.current = setTimeout(() => {
      setCuisineSuggestions(CUISINE_OPTIONS.filter(o => o.toLowerCase().includes(term)).slice(0, 5));
    }, 250);
    return () => { if (cuisineDebounceRef.current) clearTimeout(cuisineDebounceRef.current); };
  }, [newFavoriteCuisine]);

  useEffect(() => {
    const term = newDietary.trim().toLowerCase();
    if (!term) { setDietarySuggestions([]); return; }
    if (dietaryDebounceRef.current) clearTimeout(dietaryDebounceRef.current);
    dietaryDebounceRef.current = setTimeout(() => {
      setDietarySuggestions(DIETARY_OPTIONS.filter(o => o.toLowerCase().includes(term)).slice(0, 5));
    }, 250);
    return () => { if (dietaryDebounceRef.current) clearTimeout(dietaryDebounceRef.current); };
  }, [newDietary]);

  useEffect(() => {
    const term = newDislikedIngredient.trim().toLowerCase();
    if (!term) { setDislikedSuggestions([]); return; }
    if (dislikedDebounceRef.current) clearTimeout(dislikedDebounceRef.current);
    dislikedDebounceRef.current = setTimeout(() => {
      const allDisliked = Array.from(new Set([...COMMON_DISLIKED_INGREDIENTS, ...Object.keys(customIngredientRules || {})]));
      setDislikedSuggestions(allDisliked.filter(o => o.toLowerCase().includes(term)).slice(0, 5));
    }, 250);
    return () => { if (dislikedDebounceRef.current) clearTimeout(dislikedDebounceRef.current); };
  }, [newDislikedIngredient, customIngredientRules]);

  useEffect(() => {
    const term = newHealthCondition.trim().toLowerCase();
    if (!term) { setHealthConditionSuggestions([]); return; }
    if (healthDebounceRef.current) clearTimeout(healthDebounceRef.current);
    healthDebounceRef.current = setTimeout(() => {
      setHealthConditionSuggestions(HEALTH_CONDITIONS.filter(o => o.toLowerCase().includes(term)).slice(0, 5));
    }, 250);
    return () => { if (healthDebounceRef.current) clearTimeout(healthDebounceRef.current); };
  }, [newHealthCondition]);
`;

code = code.replace(stateVars, newStateVars);
fs.writeFileSync('src/views/ProfileView.tsx', code);
