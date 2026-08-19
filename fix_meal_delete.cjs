const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// Add the handler
const handlerCode = `
  const handleDeleteLoggedMeal = async (dateKey: string, mealToRemove: any) => {
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
  };

  const handleConfirmManualMeal`;

code = code.replace(/const handleConfirmManualMeal/, handlerCode);

// Update the render block
const oldRender = `{typeMeals.map((meal, idx) => (
                                    <div key={idx} className="flex flex-col bg-stone-900/50 rounded-lg p-3 border border-stone-800/50">
                                      <span className="text-sm font-medium text-stone-200 mb-1">{meal.name}</span>
                                      <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                                        {meal.calories}kcal • {meal.proteinGrams}g P • {meal.carbsGrams}g C • {meal.fatGrams}g F
                                      </span>
                                    </div>
                                  ))}`;

const newRender = `{typeMeals.map((meal, idx) => (
                                    <div key={idx} className="flex items-center justify-between group bg-stone-900/50 rounded-lg p-3 border border-stone-800/50">
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium text-stone-200 mb-1">{meal.name}</span>
                                        <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                                          {meal.calories}kcal • {meal.proteinGrams}g P • {meal.carbsGrams}g C • {meal.fatGrams}g F
                                        </span>
                                      </div>
                                      <button 
                                        onClick={() => handleDeleteLoggedMeal(dateKey, meal)}
                                        className={\`\${ICON_BUTTON} opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:border-red-900/50 shrink-0\`}
                                        title="Remove meal"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}`;

code = code.replace(oldRender, newRender);

fs.writeFileSync('src/views/PlanView.tsx', code);
