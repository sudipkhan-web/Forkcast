const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// I need to ensure PlanView has the state and handles defined properly inside the function scope, 
// and that it actually imports the icons. It seems my regex previously didn't apply properly if the 
// file was formatted slightly differently. Let's force rewrite it correctly.

// 1. Fix Imports
if (!code.includes("import { Droplet, Activity, Plus } from 'lucide-react';")) {
  code = "import { Droplet, Activity, Plus } from 'lucide-react';\n" + code;
}

// 2. Ensure state is INSIDE the component
if (!code.includes("const [manualMealDate, setManualMealDate] = React.useState<string | null>(null);")) {
  code = code.replace(
    /const \[activeCategory, setActiveCategory\] = React\.useState<'all' \| 'meal' \| 'snack'>\('all'\);/,
    "const [activeCategory, setActiveCategory] = React.useState<'all' | 'meal' | 'snack'>('all');\n  const [manualMealDate, setManualMealDate] = React.useState<string | null>(null);"
  );
}

// 3. Ensure handleConfirmManualMeal is INSIDE the component
const handlerCode = `
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
if (!code.includes("handleConfirmManualMeal = async")) {
  code = code.replace(/const activeMembers = React\.useMemo/, handlerCode + "\n  const activeMembers = React.useMemo");
}

fs.writeFileSync('src/views/PlanView.tsx', code);
