const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const regex = /const handleConfirmMealPhoto[\s\S]*?const handleUpdateFeeling/m;

const replacement = `const handleConfirmMealPhoto = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number }) => {
    if (!auth.currentUser || !scannedMealPreview) return;
        
    try {
      const today = new Date().toISOString().split('T')[0];
      const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
            
      const newMeal = {
        id: crypto.randomUUID(),
        name: data.name,
        calories: data.calories,
        carbsGrams: data.carbsGrams,
        proteinGrams: data.proteinGrams,
        fatGrams: data.fatGrams,
        mealType: 'Snack', // Default to snack
        image: scannedMealPreview.imageBase64,
        source: 'photo-log'
      };
            
      await setDoc(logRef, {
        acceptedMeals: arrayUnion(newMeal)
      }, { merge: true });
            
      showToast(\`Meal logged! Added \${data.name} (\${data.calories} kcal)\`, "success");
      setScannedMealPreview(null);
    } catch (err: any) {
      console.error(err);
      showToast("Failed to save meal log.", "error");
    }
  };

  const handleUpdateFeeling`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/views/HomeView.tsx', code);
