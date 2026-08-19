const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// 1. Imports
code = code.replace(
  "import { getTodayMacros } from '../utils/progressUtils';",
  "import { getTodayMacros } from '../utils/progressUtils';\nimport { arrayUnion } from 'firebase/firestore';\nimport { MealPhotoConfirmModal } from '../components/MealPhotoConfirmModal';"
);

// 2. Add state for modal preview
const stateLine = "  const [isScanningMeal, setIsScanningMeal] = React.useState(false);";
code = code.replace(
  stateLine,
  stateLine + "\n  const [scannedMealPreview, setScannedMealPreview] = React.useState<any | null>(null);"
);

// 3. Update handleMealPhotoUpload to use state instead of writing immediately
const targetUpload = `      if (result && result.name) {
        // Save to today's log
        if (auth.currentUser) {
          const today = new Date().toISOString().split('T')[0];
          const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, today);
          
          const newMeal = {
            id: \`ai-scan-\${Date.now()}\`,
            name: result.name,
            calories: result.calories || 0,
            carbsGrams: result.carbsGrams || 0,
            proteinGrams: result.proteinGrams || 0,
            fatGrams: result.fatGrams || 0,
            mealType: 'Snack', // Default to snack
            image: resizedDataUrl
          };
          
          const currentLog = await getDoc(logRef);
          const currentMeals = currentLog.exists() ? (currentLog.data().acceptedMeals || []) : [];
          await setDoc(logRef, { acceptedMeals: [...currentMeals, newMeal] }, { merge: true });
          
          showToast(\`Meal logged! Added \${result.name} (\${result.calories} kcal)\`, "success");
        }
      } else {
        throw new Error("Could not identify meal");
      }
    } catch (err: any) {
      console.error(err);
      showToast(\`Error: \${err.message || "Failed to analyze photo."}\`, "error");
    } finally {
      setIsScanningMeal(false);
      if (e.target) e.target.value = '';
    }`;

const newHandlerLogic = `      if (result && result.name) {
        setScannedMealPreview({
          ...result,
          imageBase64: resizedDataUrl
        });
      } else {
        throw new Error("Could not identify meal");
      }
    } catch (err: any) {
      console.error(err);
      showToast(\`Error: \${err.message || "Failed to analyze photo."}\`, "error");
    } finally {
      setIsScanningMeal(false);
      if (e.target) e.target.value = '';
    }`;

if(code.includes(targetUpload)) {
  code = code.replace(targetUpload, newHandlerLogic);
} else {
  console.log("Could not find upload replacement target!");
}

// 4. Add handleConfirmMealPhoto
const handleConfirmStr = `
  const handleConfirmMealPhoto = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number }) => {
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
`;

code = code.replace(
  "  const handleUpdateFeeling = async",
  handleConfirmStr + "\n  const handleUpdateFeeling = async"
);

// 5. Add Modal to JSX
const modalJSX = `
      {scannedMealPreview && (
        <MealPhotoConfirmModal
          isOpen={!!scannedMealPreview}
          initialData={scannedMealPreview}
          onConfirm={handleConfirmMealPhoto}
          onCancel={() => setScannedMealPreview(null)}
        />
      )}
`;

code = code.replace(
  "    </motion.div>\n  );\n}",
  modalJSX + "\n    </motion.div>\n  );\n}"
);

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("Updated HomeView.tsx to use MealPhotoConfirmModal safely");
