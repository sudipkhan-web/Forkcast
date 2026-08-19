const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// Notice that the previous rewrite matched 'const activeMembers' but this component
// doesn't have 'const activeMembers' at the top level of the component body!
// That was inside ProgressView maybe.
// Let's insert the state and handler right after `const [viewMode, setViewMode] = useState<'upcoming' | 'history'>('upcoming');`

const stateAndHandler = `
  const [manualMealDate, setManualMealDate] = React.useState<string | null>(null);

  const handleConfirmManualMeal = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; date: string }) => {
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
  };
`;

code = code.replace(
  /const \[viewMode, setViewMode\] = useState<'upcoming' \| 'history'>\('upcoming'\);/,
  "const [viewMode, setViewMode] = useState<'upcoming' | 'history'>('upcoming');\n" + stateAndHandler
);

fs.writeFileSync('src/views/PlanView.tsx', code);
