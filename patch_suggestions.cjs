const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add refine state near seenMealIds
code = code.replace(
  "  const [seenMealIds, setSeenMealIds] = useState<string[]>([]);",
  "  const [seenMealIds, setSeenMealIds] = useState<string[]>([]);\n  const [seenRefineMealIds, setSeenRefineMealIds] = useState<string[]>([]);\n  const [refineSuggestions, setRefineSuggestions] = useState<(Meal & { dynamicReason: string, groupReason?: string })[]>([]);"
);

// 2. Add the refine background queue
// Find the suggestions background queue and insert our new one right after it
const oldQueue = `  // Declaratively maintain the 50-item background queue
  React.useEffect(() => {
    if (!hasLoadedSuggestions) return; // Only process when fully loaded
    
    const shortfall = 50 - suggestions.length;
    if (shortfall > 0) {
      const group = groups.find(g => g.id === selectedGroupId) || groups[0];
      const memberIds = group ? group.memberIds : [];
      const groupName = group ? group.name : 'Just Me';

      // First, try to pull compatible existing recipes from the master database (globalRecipes + ALL_MEALS)
      const compatibleExisting = getTopMeals(
        shortfall,
        [...suggestions.map(s => s.id), ...seenMealIds, ...dislikedMealIds],
        memberIds,
        globalRecipes,
        household,
        dislikedTags,
        likedTags,
        profile,
        inventory,
        favorites
      );

      if (compatibleExisting.length > 0) {
        setSuggestions(prev => {
          const newItems = compatibleExisting.map(s => ({
            ...s,
            dynamicReason: generateDynamicReason(s, profile, likedTags, household, memberIds, inventory),
            groupReason: generateGroupReason(s, groupName)
          }));
          return [...prev, ...newItems].slice(0, 50);
        });
        return; // We added items, let the effect re-evaluate
      }

      // If we still have a shortfall and we've run out of existing matching recipes in the database,
      // and suggestions is low (e.g. fewer than 20 suggestions available), we generate new ones using Gemini.
      if (suggestions.length < 20 && !window.isGeneratingBg) {
        window.isGeneratingBg = true;

        const liked = Object.entries(likedTags).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
        const disliked = Object.entries(dislikedTags).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
        const { dietary, dislikedIngredients, favoriteCuisines, healthConditions } = getActiveConstraints(memberIds, household);
        
        const goals: string[] = [];
        
        const seenNames = [...ALL_MEALS, ...globalRecipes, ...suggestions].map(m => m.name);
        const inventoryNames = inventory.map(i => i.name);
        
        // Fetch training day type for background generation
        const fetchAndGenerate = async () => {
          let trainingDayType: string | undefined = undefined;
          let acceptedMeals: any[] = [];
          if (auth.currentUser) {
            const today = new Date().toISOString().split('T')[0];
            try {
              const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
              const docSnap = await getDoc(logRef);
              if (docSnap.exists()) {
                trainingDayType = docSnap.data().dayType || undefined;
                acceptedMeals = docSnap.data().acceptedMeals || [];
              }
            } catch (e) {
              console.error("Error fetching training day type:", e);
            }
          }

          try {
            const primaryPerson = getPrimaryPerson(household);
            const todayMacros = getTodayMacros(acceptedMeals, primaryPerson || {}, trainingDayType);
            const remainingCarbsGrams = Math.max(0, todayMacros.carbs.target[1] - todayMacros.carbs.current);
            const remainingProteinGrams = Math.max(0, todayMacros.protein.target[1] - todayMacros.protein.current);
            const remainingFatGrams = Math.max(0, todayMacros.fat.target[1] - todayMacros.fat.current);
            
            const newMeals = await generateRecipes(12, liked, disliked, dietary, dislikedIngredients, favoriteCuisines, goals, seenNames, favorites, inventoryNames, healthConditions, undefined, trainingDayType, primaryPerson?.weightKg, remainingCarbsGrams, remainingProteinGrams, remainingFatGrams);
            if (newMeals.length > 0) {
              setSuggestions(prev => {
                const updated = [...prev];
                newMeals.forEach((generatedMeal, idx) => {
                  updated.push({
                    ...generatedMeal,
                    id: generatedMeal.id || \`ai-\${Date.now()}-\${idx}-\${Math.random().toString(36).substring(2, 6)}\`,
                    dynamicReason: 'Freshly generated from your recent swipes!',
                    groupReason: 'AI Recommended'
                  });
                });
                return updated.slice(0, 50);
              });
            }
          } catch (err) {
            console.error(err);
          } finally {
            window.isGeneratingBg = false;
          }
        };
        fetchAndGenerate();
      }
    }
  }, [suggestions.length, hasLoadedSuggestions, selectedGroupId, likedTags, dislikedTags, household, groups, inventory, favorites, globalRecipes, seenMealIds, dislikedMealIds]);`;

const refineQueue = `

  // Declaratively maintain the 50-item refine queue (TasteLearningScreen)
  React.useEffect(() => {
    if (!hasLoadedSuggestions) return;
    
    const shortfall = 50 - refineSuggestions.length;
    if (shortfall > 0) {
      const group = groups.find(g => g.id === selectedGroupId) || groups[0];
      const memberIds = group ? group.memberIds : [];
      const groupName = group ? group.name : 'Just Me';

      // First, try to pull compatible existing recipes from the master database
      const compatibleExisting = getTopMeals(
        shortfall,
        [...refineSuggestions.map(s => s.id), ...seenRefineMealIds, ...dislikedMealIds],
        memberIds,
        globalRecipes,
        household,
        dislikedTags,
        likedTags,
        profile,
        inventory,
        favorites
      );

      if (compatibleExisting.length > 0) {
        setRefineSuggestions(prev => {
          const newItems = compatibleExisting.map(s => ({
            ...s,
            dynamicReason: generateDynamicReason(s, profile, likedTags, household, memberIds, inventory),
            groupReason: generateGroupReason(s, groupName)
          }));
          return [...prev, ...newItems].slice(0, 50);
        });
        return;
      }

      if (refineSuggestions.length < 20 && !window.isGeneratingBg) {
        window.isGeneratingBg = true;

        const liked = Object.entries(likedTags).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
        const disliked = Object.entries(dislikedTags).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);
        const { dietary, dislikedIngredients, favoriteCuisines, healthConditions } = getActiveConstraints(memberIds, household);
        const goals: string[] = [];
        
        const seenNames = [...ALL_MEALS, ...globalRecipes, ...refineSuggestions].map(m => m.name);
        const inventoryNames = inventory.map(i => i.name);
        
        const fetchAndGenerate = async () => {
          let trainingDayType: string | undefined = undefined;
          let acceptedMeals: any[] = [];
          if (auth.currentUser) {
            const today = new Date().toISOString().split('T')[0];
            try {
              const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
              const docSnap = await getDoc(logRef);
              if (docSnap.exists()) {
                trainingDayType = docSnap.data().dayType || undefined;
                acceptedMeals = docSnap.data().acceptedMeals || [];
              }
            } catch (e) {
              console.error("Error fetching training day type:", e);
            }
          }

          try {
            const primaryPerson = getPrimaryPerson(household);
            const todayMacros = getTodayMacros(acceptedMeals, primaryPerson || {}, trainingDayType);
            const remainingCarbsGrams = Math.max(0, todayMacros.carbs.target[1] - todayMacros.carbs.current);
            const remainingProteinGrams = Math.max(0, todayMacros.protein.target[1] - todayMacros.protein.current);
            const remainingFatGrams = Math.max(0, todayMacros.fat.target[1] - todayMacros.fat.current);
            
            const newMeals = await generateRecipes(12, liked, disliked, dietary, dislikedIngredients, favoriteCuisines, goals, seenNames, favorites, inventoryNames, healthConditions, undefined, trainingDayType, primaryPerson?.weightKg, remainingCarbsGrams, remainingProteinGrams, remainingFatGrams);
            if (newMeals.length > 0) {
              setRefineSuggestions(prev => {
                const updated = [...prev];
                newMeals.forEach((generatedMeal, idx) => {
                  updated.push({
                    ...generatedMeal,
                    id: generatedMeal.id || \`ai-\${Date.now()}-\${idx}-\${Math.random().toString(36).substring(2, 6)}\`,
                    dynamicReason: 'Freshly generated from your recent swipes!',
                    groupReason: 'AI Recommended'
                  });
                });
                return updated.slice(0, 50);
              });
            }
          } catch (err) {
            console.error(err);
          } finally {
            window.isGeneratingBg = false;
          }
        };
        fetchAndGenerate();
      }
    }
  }, [refineSuggestions.length, hasLoadedSuggestions, selectedGroupId, likedTags, dislikedTags, household, groups, inventory, favorites, globalRecipes, seenRefineMealIds, dislikedMealIds]);`;

code = code.replace(oldQueue, oldQueue + refineQueue);

// 3. Update TasteLearningScreen usage
code = code.replace(
  "            seenMealIds={seenMealIds}\n            setSeenMealIds={setSeenMealIds}",
  "            seenMealIds={seenRefineMealIds}\n            setSeenMealIds={setSeenRefineMealIds}"
);
code = code.replace(
  "            suggestions={suggestions}\n            setSuggestions={setSuggestions}",
  "            suggestions={refineSuggestions}\n            setSuggestions={setRefineSuggestions}"
);

fs.writeFileSync('src/App.tsx', code);
