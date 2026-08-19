const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// I accidentally stripped useAppContext during one of the previous fixes because it was apparently never there!
// PlanView did not have useAppContext! I need to add it.
if (!code.includes("import { useAppContext } from '../context/AppContext';")) {
  code = "import { useAppContext } from '../context/AppContext';\n" + code;
}

if (!code.includes("trainingLogs: any[];")) {
  code = code.replace(
    /interface PlanViewProps \{/,
    "interface PlanViewProps {\n  trainingLogs?: any;\n  household?: any;"
  );
}

// Ensure the props are destructured properly
code = code.replace(
  /export function PlanView\(\{\n\s*plannedMeals,\n\s*globalRecipes,/,
  "export function PlanView({\n  plannedMeals,\n  globalRecipes,\n  trainingLogs,\n  household,"
);

// Add state if it's missing
if (!code.includes("const [manualMealDate, setManualMealDate]")) {
  code = code.replace(
    /const \[activeCategory, setActiveCategory\] = React\.useState<'all' \| 'meal' \| 'snack'>\('all'\);/,
    "const [activeCategory, setActiveCategory] = React.useState<'all' | 'meal' | 'snack'>('all');\n  const [manualMealDate, setManualMealDate] = React.useState<string | null>(null);"
  );
}

// Add handler if missing
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
if (!code.includes("handleConfirmManualMeal")) {
  code = code.replace(/const activeMembers = React\.useMemo/, handlerCode + "\n  const activeMembers = React.useMemo");
}

// Ensure icons are imported
if (!code.includes("Plus")) {
  code = code.replace(/import \{ Star, Share, PlusCircle, Trash2, Calendar, Clock, RotateCcw \} from 'lucide-react';/, "import { Star, Share, PlusCircle, Trash2, Calendar, Clock, RotateCcw, Droplet, Activity, Plus } from 'lucide-react';");
}

fs.writeFileSync('src/views/PlanView.tsx', code);
console.log("Fixed PlanView props and imports");
