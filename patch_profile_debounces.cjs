const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// We need to import suggestFreeTextOptions
code = code.replace(
  'import { checkTestNotifications } from "../services/notificationService";',
  'import { checkTestNotifications } from "../services/notificationService";\nimport { suggestFreeTextOptions } from "../services/mealPhotoAnalyzer";'
);

// Change the state types
code = code.replace(
  'const [cuisineSuggestions, setCuisineSuggestions] = useState<string[]>([]);',
  'const [cuisineSuggestions, setCuisineSuggestions] = useState<{text: string, isAi?: boolean}[]>([]);'
);
code = code.replace(
  'const [dietarySuggestions, setDietarySuggestions] = useState<string[]>([]);',
  'const [dietarySuggestions, setDietarySuggestions] = useState<{text: string, isAi?: boolean}[]>([]);'
);
code = code.replace(
  'const [healthConditionSuggestions, setHealthConditionSuggestions] = useState<string[]>([]);',
  'const [healthConditionSuggestions, setHealthConditionSuggestions] = useState<{text: string, isAi?: boolean}[]>([]);'
);
// We also have to change dislikedSuggestions, but user only asked for "Favorite Cuisines, Dietary Preferences, and Medical & Health Conditions fields". Oh wait: "and Disliked Ingredients too, for consistency, even though it may already be working". Okay, let's change disliked too, but we need to implement suggestFreeTextOptions for 'disliked' or maybe the prompt only mentioned 'cuisine' | 'dietary' | 'medical'.
// The prompt said: "category: 'cuisine' | 'dietary' | 'medical'".
// So for disliked, it just keeps its existing logic but returns {text, isAi: false}.
code = code.replace(
  'const [dislikedSuggestions, setDislikedSuggestions] = useState<string[]>([]);',
  'const [dislikedSuggestions, setDislikedSuggestions] = useState<{text: string, isAi?: boolean}[]>([]);'
);

// Replace the effect for cuisine
code = code.replace(
  /useEffect\(\(\) => \{\s*const term = newFavoriteCuisine\.trim\(\)\.toLowerCase\(\)[\s\S]*?\}, \[newFavoriteCuisine\]\);/,
  `useEffect(() => {
    const term = newFavoriteCuisine.trim().toLowerCase();
    if (!term) { setCuisineSuggestions([]); return; }
    if (cuisineDebounceRef.current) clearTimeout(cuisineDebounceRef.current);
    cuisineDebounceRef.current = setTimeout(async () => {
      let local = CUISINE_OPTIONS.filter(o => o.toLowerCase().includes(term)).slice(0, 5);
      if (local.length > 0) {
        setCuisineSuggestions(local.map(text => ({ text })));
      } else if (term.length >= 3) {
        const aiOptions = await suggestFreeTextOptions('cuisine', term);
        setCuisineSuggestions(aiOptions.map(text => ({ text, isAi: true })));
      } else {
        setCuisineSuggestions([]);
      }
    }, 600);
    return () => { if (cuisineDebounceRef.current) clearTimeout(cuisineDebounceRef.current); };
  }, [newFavoriteCuisine]);`
);

// Replace the effect for dietary
code = code.replace(
  /useEffect\(\(\) => \{\s*const term = newDietary\.trim\(\)\.toLowerCase\(\)[\s\S]*?\}, \[newDietary\]\);/,
  `useEffect(() => {
    const term = newDietary.trim().toLowerCase();
    if (!term) { setDietarySuggestions([]); return; }
    if (dietaryDebounceRef.current) clearTimeout(dietaryDebounceRef.current);
    dietaryDebounceRef.current = setTimeout(async () => {
      let local = DIETARY_OPTIONS.filter(o => o.toLowerCase().includes(term)).slice(0, 5);
      if (local.length > 0) {
        setDietarySuggestions(local.map(text => ({ text })));
      } else if (term.length >= 3) {
        const aiOptions = await suggestFreeTextOptions('dietary', term);
        setDietarySuggestions(aiOptions.map(text => ({ text, isAi: true })));
      } else {
        setDietarySuggestions([]);
      }
    }, 600);
    return () => { if (dietaryDebounceRef.current) clearTimeout(dietaryDebounceRef.current); };
  }, [newDietary]);`
);

// Replace the effect for medical
code = code.replace(
  /useEffect\(\(\) => \{\s*const term = newHealthCondition\.trim\(\)\.toLowerCase\(\)[\s\S]*?\}, \[newHealthCondition\]\);/,
  `useEffect(() => {
    const term = newHealthCondition.trim().toLowerCase();
    if (!term) { setHealthConditionSuggestions([]); return; }
    if (healthDebounceRef.current) clearTimeout(healthDebounceRef.current);
    healthDebounceRef.current = setTimeout(async () => {
      let local = HEALTH_CONDITIONS.filter(o => o.toLowerCase().includes(term)).slice(0, 5);
      if (local.length > 0) {
        setHealthConditionSuggestions(local.map(text => ({ text })));
      } else if (term.length >= 3) {
        const aiOptions = await suggestFreeTextOptions('medical', term);
        setHealthConditionSuggestions(aiOptions.map(text => ({ text, isAi: true })));
      } else {
        setHealthConditionSuggestions([]);
      }
    }, 600);
    return () => { if (healthDebounceRef.current) clearTimeout(healthDebounceRef.current); };
  }, [newHealthCondition]);`
);

// Replace the effect for disliked
code = code.replace(
  /useEffect\(\(\) => \{\s*const term = newDislikedIngredient\.trim\(\)\.toLowerCase\(\)[\s\S]*?\}, \[newDislikedIngredient, customIngredientRules\]\);/,
  `useEffect(() => {
    const term = newDislikedIngredient.trim().toLowerCase();
    if (!term) { setDislikedSuggestions([]); return; }
    if (dislikedDebounceRef.current) clearTimeout(dislikedDebounceRef.current);
    dislikedDebounceRef.current = setTimeout(() => {
      const allDisliked = Array.from(new Set([...COMMON_DISLIKED_INGREDIENTS, ...COMMON_INGREDIENTS, ...Object.keys(customIngredientRules || {})]));
      let local = allDisliked.filter(o => o.toLowerCase().includes(term)).slice(0, 5);
      setDislikedSuggestions(local.map(text => ({ text })));
    }, 250);
    return () => { if (dislikedDebounceRef.current) clearTimeout(dislikedDebounceRef.current); };
  }, [newDislikedIngredient, customIngredientRules]);`
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
console.log("Patched ProfileView debounces");
