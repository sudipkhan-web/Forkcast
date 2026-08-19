const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// Fix 1: scannedMealPreview wasn't capturing the regex right because of the React.useState inside
code = code.replace(
  /const \[scannedMealPreview, setScannedMealPreview\] = React\.useState<any \| null>\(null\);/,
  "const [scannedMealPreview, setScannedMealPreview] = React.useState<any | null>(null);\n  const [showManualMealModal, setShowManualMealModal] = React.useState(false);"
);

// Fix 2: handleConfirmMealPhoto is rejecting because I missed replacing the `today` usage correctly previously, 
// AND the `if (!auth.currentUser || !scannedMealPreview) return;` needs fixing to allow manual mode.

const fixedConfirmHandler = `
  const handleConfirmMealPhoto = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; date: string }) => {
    if (!auth.currentUser) return;
    // Allow either scanned photo OR manual entry
    if (!scannedMealPreview && !showManualMealModal) return;
        
    try {
      // Use data.date instead of hardcoded today
      const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, data.date);
            
      const newMeal = {
        id: crypto.randomUUID(),
        name: data.name,
        calories: data.calories,
        carbsGrams: data.carbsGrams,
        proteinGrams: data.proteinGrams,
        fatGrams: data.fatGrams,
        mealType: data.mealType,
        image: scannedMealPreview?.imageBase64 || null, // Optional chaining here
        source: scannedMealPreview ? 'photo-log' : 'manual-log',
        loggedAt: new Date().toISOString()
      };
            
      await setDoc(logRef, {
        acceptedMeals: arrayUnion(newMeal)
      }, { merge: true });
            
      showToast(\`Meal logged! Added \${data.name} (\${data.calories} kcal)\`, "success");
      setScannedMealPreview(null);
      setShowManualMealModal(false);
    } catch (err: any) {
      console.error(err);
      showToast("Failed to save meal log.", "error");
    }
  };
`;

code = code.replace(/const handleConfirmMealPhoto = async[\s\S]*?setShowManualMealModal\(false\);\n\s*\} catch \(err: any\) \{\n\s*console\.error\(err\);\n\s*showToast\("Failed to save meal log\.", "error"\);\n\s*\}\n\s*\};\n/, fixedConfirmHandler + '\n');

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Fixed HomeView errors");
