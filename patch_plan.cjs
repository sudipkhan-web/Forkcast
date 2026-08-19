const fs = require('fs');
let code = fs.readFileSync('src/views/PlanView.tsx', 'utf8');

// The first patch didn't take fully because I matched the `const { profile, household } = useAppContext();`
// but PlanView doesn't have `household` in `useAppContext` by default! Let's check what it uses.

if (!code.includes("trainingLogs")) {
  code = code.replace(
    /const \{\s*profile\s*\}\s*=\s*useAppContext\(\);/,
    "const { profile, trainingLogs } = useAppContext();"
  );
  // Just in case it's something else:
  if (!code.includes("trainingLogs")) {
    code = code.replace(
      /export function PlanView.*\{/,
      "export function PlanView(props: any) {\n  const { trainingLogs } = useAppContext();"
    );
  }
}

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
  code = code.replace(/import \{ Calendar, Clock, Trash2, CheckCircle2, RotateCcw, AlertTriangle \} from 'lucide-react';/, "import { Calendar, Clock, Trash2, CheckCircle2, RotateCcw, AlertTriangle, Droplet, Activity, Plus } from 'lucide-react';");
}

// Ensure Modal is imported
if (!code.includes("MealPhotoConfirmModal")) {
  code = "import { MealPhotoConfirmModal } from '../components/MealPhotoConfirmModal';\n" + code;
}

fs.writeFileSync('src/views/PlanView.tsx', code);
console.log("Patched PlanView.tsx imports and state");
