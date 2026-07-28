const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  const handleSelectMeal = (meal: Meal | null) => {
    if (meal) {
      const group = groups.find(g => g.id === selectedGroupId) || groups[0];
      const groupName = group ? group.name : 'Just Me';
      trackBehavior(TrackingAction.SELECTED_RECIPE, meal.id, meal.name, undefined, meal.tags, selectedGroupId, groupName);
    }
    setSelectedMeal(meal);
  };`;

const replacementStr = `  const handleSelectMeal = async (meal: Meal | null) => {
    if (meal) {
      const group = groups.find(g => g.id === selectedGroupId) || groups[0];
      const groupName = group ? group.name : 'Just Me';
      trackBehavior(TrackingAction.SELECTED_RECIPE, meal.id, meal.name, undefined, meal.tags, selectedGroupId, groupName);

      if (userId) {
        const todayStr = new Date().toISOString().split('T')[0];
        try {
          const docRef = doc(db, 'users', userId, 'trainingLog', todayStr);
          await setDoc(docRef, {
            acceptedMeals: arrayUnion({
              recipeId: meal.id,
              name: meal.name,
              calories: meal.calories || 0,
              carbsGrams: meal.carbsGrams || 0,
              proteinGrams: meal.proteinGrams || 0,
              loggedAt: new Date().toISOString()
            })
          }, { merge: true });
        } catch (error) {
          console.error("Error logging selected recipe:", error);
        }
      }
    }
    setSelectedMeal(meal);
  };`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', content);
