const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// The remaining handleConfirmManualMeal that wasn't replaced:
const handleConfirmRegex = /const handleConfirmManualMeal = async \(data[\s\S]*?import\('\.\.\/firebase'\)\.then\(\(\{ auth, db \}\) => \{[\s\S]*?if \(!auth\.currentUser\) return;[\s\S]*?import\('firebase\/firestore'\)\.then\(\(\{ doc, setDoc, arrayUnion \}\) => \{[\s\S]*?try \{[\s\S]*?const logRef = doc\(db, \`users\/\$\{auth\.currentUser!\.uid\}\/trainingLog\`, data\.date\);[\s\S]*?const newMeal = \{[\s\S]*?recipeId: crypto\.randomUUID\(\),[\s\S]*?name: data\.name,[\s\S]*?calories: data\.calories,[\s\S]*?carbsGrams: data\.carbsGrams,[\s\S]*?proteinGrams: data\.proteinGrams,[\s\S]*?fatGrams: data\.fatGrams,[\s\S]*?mealType: data\.mealType,[\s\S]*?image: scannedMealPreview\?\.imageBase64 \|\| null,[\s\S]*?source: scannedMealPreview \? 'photo-log' : 'manual-log',[\s\S]*?loggedAt: new Date\(\)\.toISOString\(\)[\s\S]*?\};[\s\S]*?setDoc\(logRef, \{[\s\S]*?acceptedMeals: arrayUnion\(newMeal\)[\s\S]*?\}, \{ merge: true \}\)\.then\(\(\) => \{[\s\S]*?import\('react-hot-toast'\)\.then\(toast => toast\.default\.success\("Meal logged successfully!"\)\);[\s\S]*?setManualMealDate\(null\);[\s\S]*?\}\);[\s\S]*?\} catch \(err: any\) \{[\s\S]*?console\.error\(err\);[\s\S]*?\}[\s\S]*?\}\);[\s\S]*?\}\);[\s\S]*?\};/m;

const newHandleConfirm = `const handleConfirmManualMeal = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; date: string }) => {
    if (!auth.currentUser) return;
    try {
      const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, data.date);
      const newMeal = {
        recipeId: crypto.randomUUID(),
        name: data.name,
        calories: data.calories,
        carbsGrams: data.carbsGrams,
        proteinGrams: data.proteinGrams,
        fatGrams: data.fatGrams,
        mealType: data.mealType,
        image: scannedMealPreview?.imageBase64 || null,
        source: scannedMealPreview ? 'photo-log' : 'manual-log',
        loggedAt: new Date().toISOString()
      };
      await setDoc(logRef, {
        acceptedMeals: arrayUnion(newMeal)
      }, { merge: true });
      showToast("Meal logged successfully!", "success");
      setManualMealDate(null);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to log meal", "error");
    }
  };`;

code = code.replace(handleConfirmRegex, newHandleConfirm);
fs.writeFileSync('src/views/PlanView.tsx', code);
