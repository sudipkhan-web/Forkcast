const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const regex = /useEffect\(\(\) => \{\s*const term = newDislikedIngredient\.trim\(\)\.toLowerCase\(\)[\s\S]*?\}, \[newDislikedIngredient, customIngredientRules\]\);/;

const newEffect = `useEffect(() => {
    const term = newDislikedIngredient.trim().toLowerCase();
    if (!term) { setDislikedSuggestions([]); return; }
    if (dislikedDebounceRef.current) clearTimeout(dislikedDebounceRef.current);
    dislikedDebounceRef.current = setTimeout(async () => {
      const allDisliked = Array.from(new Set([...COMMON_DISLIKED_INGREDIENTS, ...COMMON_INGREDIENTS, ...Object.keys(customIngredientRules || {})]));
      let local = allDisliked.filter(o => o.toLowerCase().includes(term)).slice(0, 5);
      if (local.length > 0) {
        setDislikedSuggestions(local.map(text => ({ text })));
      } else if (term.length >= 3) {
        const aiOptions = await suggestFreeTextOptions('ingredient', term);
        setDislikedSuggestions(aiOptions.map(text => ({ text, isAi: true })));
      } else {
        setDislikedSuggestions([]);
      }
    }, 600);
    return () => { if (dislikedDebounceRef.current) clearTimeout(dislikedDebounceRef.current); };
  }, [newDislikedIngredient, customIngredientRules]);`;

code = code.replace(regex, newEffect);
fs.writeFileSync('src/views/ProfileView.tsx', code);
