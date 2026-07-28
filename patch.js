const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        // Fetch training day type for background generation
        let trainingDayType: string | undefined = undefined;
        if (auth.currentUser) {
          const today = new Date().toISOString().split('T')[0];
          try {
            const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
            const docSnap = await getDoc(logRef);
            if (docSnap.exists()) {
              trainingDayType = docSnap.data().dayType || undefined;
            }
          } catch (e) {
            console.error("Error fetching training day type:", e);
          }
        }

        generateRecipes(12, liked, disliked, dietary, dislikedIngredients, favoriteCuisines, goals, seenNames, favorites, inventoryNames, healthConditions, undefined, trainingDayType)
          .then(newMeals => {
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
          })
          .catch(console.error)
          .finally(() => {
            window.isGeneratingBg = false;
          });`;

const replacement = `        // Fetch training day type for background generation
        const fetchAndGenerate = async () => {
          let trainingDayType: string | undefined = undefined;
          if (auth.currentUser) {
            const today = new Date().toISOString().split('T')[0];
            try {
              const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
              const docSnap = await getDoc(logRef);
              if (docSnap.exists()) {
                trainingDayType = docSnap.data().dayType || undefined;
              }
            } catch (e) {
              console.error("Error fetching training day type:", e);
            }
          }

          try {
            const newMeals = await generateRecipes(12, liked, disliked, dietary, dislikedIngredients, favoriteCuisines, goals, seenNames, favorites, inventoryNames, healthConditions, undefined, trainingDayType);
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
        fetchAndGenerate();`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Success");
} else {
  console.log("Target not found");
}
