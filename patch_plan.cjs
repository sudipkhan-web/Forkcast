const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// Add static imports for firebase
if (!code.includes("import { auth, db }")) {
  code = code.replace(
    "import { useToast } from '../components/Toast';",
    "import { useToast } from '../components/Toast';\nimport { auth, db } from '../firebase';"
  );
}

// Ensure updateDoc, getDoc, deleteDoc are imported from firestore
if (code.includes("import { doc, setDoc, arrayUnion } from 'firebase/firestore';")) {
  code = code.replace(
    "import { doc, setDoc, arrayUnion } from 'firebase/firestore';",
    "import { doc, setDoc, arrayUnion, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';"
  );
}

// Remove react-hot-toast import
code = code.replace(/import toast from 'react-hot-toast';\n/g, "");

// Replace handleDeleteLoggedMeal
const oldHandleDelete = `  const handleDeleteLoggedMeal = async (dateKey: string, mealToRemove: any) => {
    import('../firebase').then(({ auth, db }) => {
      if (!auth.currentUser) return;
      import('firebase/firestore').then(({ doc, updateDoc, getDoc }) => {
        try {
          const logRef = doc(db, \`users/\${auth.currentUser!.uid}/trainingLog\`, dateKey);
          getDoc(logRef).then(snap => {
            if (snap.exists()) {
              const data = snap.data();
              const meals = data.acceptedMeals || [];
              // Remove exactly one matching meal
              const index = meals.findIndex((m: any) => 
                m.name === mealToRemove.name && 
                m.calories === mealToRemove.calories && 
                m.mealType === mealToRemove.mealType
              );
              if (index > -1) {
                meals.splice(index, 1);
                updateDoc(logRef, { acceptedMeals: meals }).then(() => {
                  import('react-hot-toast').then(toast => toast.default.success("Meal removed from log"));
                });
              }
            }
          });
        } catch (err: any) {
          console.error(err);
        }
      });
    });
  };`;

const newHandleDelete = `  const handleDeleteLoggedMeal = async (dateKey: string, mealToRemove: any) => {
    if (!auth.currentUser) return;
    try {
      const logRef = doc(db, \`users/\${auth.currentUser.uid}/trainingLog\`, dateKey);
      const snap = await getDoc(logRef);
      if (snap.exists()) {
        const data = snap.data();
        const meals = data.acceptedMeals || [];
        // Remove exactly one matching meal
        const index = meals.findIndex((m: any) => 
          m.name === mealToRemove.name && 
          m.calories === mealToRemove.calories && 
          m.mealType === mealToRemove.mealType
        );
        if (index > -1) {
          meals.splice(index, 1);
          await updateDoc(logRef, { acceptedMeals: meals });
          showToast("Meal removed from log", "success");
        }
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to remove meal", "error");
    }
  };`;

code = code.replace(oldHandleDelete, newHandleDelete);

// Replace handleConfirmManualMeal
const oldHandleConfirm = `  const handleConfirmManualMeal = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; date: string }) => {
    import('../firebase').then(({ auth, db }) => {
      if (!auth.currentUser) return;
      import('firebase/firestore').then(({ doc, setDoc, arrayUnion }) => {
        try {
          const logRef = doc(db, \`users/\${auth.currentUser!.uid}/trainingLog\`, data.date);
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
          setDoc(logRef, {
            acceptedMeals: arrayUnion(newMeal)
          }, { merge: true }).then(() => {
            import('react-hot-toast').then(toast => toast.default.success("Meal logged successfully!"));
            setManualMealDate(null);
          });
        } catch (err: any) {
          console.error(err);
        }
      });
    });
  };`;

const newHandleConfirm = `  const handleConfirmManualMeal = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; date: string }) => {
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

code = code.replace(oldHandleConfirm, newHandleConfirm);

// Replace the inline trash handler around line 301
// We can use regex to find and replace that specific onClick handler
const oldInlineHandler = `                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    setPlannedMeals(prev => prev.filter(m => m.id !== meal.id));
                                    import('../firebase').then(({ auth, db }) => {
                                      if (auth.currentUser) {
                                        import('firebase/firestore').then(({ doc, deleteDoc }) => {
                                          deleteDoc(doc(db, \`users/\${auth.currentUser!.uid}/plannedMeals\`, meal.id));
                                        });
                                      }
                                    });
                                  }}
                                  className={\`opacity-0 group-hover:opacity-100 \${ICON_BUTTON} hover:text-red-500 hover:border-red-900/50\`}
                                >`;

const newInlineHandler = `                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    setPlannedMeals(prev => prev.filter(m => m.id !== meal.id));
                                    if (auth.currentUser) {
                                      try {
                                        await deleteDoc(doc(db, \`users/\${auth.currentUser.uid}/plannedMeals\`, meal.id));
                                      } catch (err: any) {
                                        console.error(err);
                                        showToast(err.message || "Failed to delete meal", "error");
                                      }
                                    }
                                  }}
                                  className={\`opacity-0 group-hover:opacity-100 \${ICON_BUTTON} hover:text-red-500 hover:border-red-900/50\`}
                                >`;

code = code.replace(oldInlineHandler, newInlineHandler);

fs.writeFileSync('src/views/PlanView.tsx', code);
