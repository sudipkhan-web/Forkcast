const fs = require('fs');
let code = fs.readFileSync('src/views/ProgressView.tsx', 'utf8');

// Ensure MealPhotoConfirmModal is imported
if (!code.includes("MealPhotoConfirmModal")) {
  code = "import { MealPhotoConfirmModal } from '../components/MealPhotoConfirmModal';\n" + code;
}

if (!code.includes("import { doc, setDoc, arrayUnion } from 'firebase/firestore';")) {
  code = "import { doc, setDoc, arrayUnion } from 'firebase/firestore';\n" + code;
}

if (!code.includes("import { auth, db } from '../firebase';")) {
  code = "import { auth, db } from '../firebase';\n" + code;
}

if (!code.includes("import toast from 'react-hot-toast';")) {
  code = "import toast from 'react-hot-toast';\n" + code;
}
if (!code.includes("import { Plus } from 'lucide-react';")) {
  code = code.replace(/import \{ Flame, Target, User, Droplet, Activity \} from 'lucide-react';/, "import { Flame, Target, User, Droplet, Activity, Plus } from 'lucide-react';");
}

// Add state for manualMealDate
if (!code.includes("manualMealDate")) {
  code = code.replace(
    /const \[activeMacro, setActiveMacro\] = React\.useState<'carbs' \| 'protein' \| 'fat'>\('carbs'\);/,
    "const [activeMacro, setActiveMacro] = React.useState<'carbs' | 'protein' | 'fat'>('carbs');\n  const [manualMealDate, setManualMealDate] = React.useState<string | null>(null);"
  );
}

// Add the manual entry handler
const handlerCode = `
  const handleConfirmManualMeal = async (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; date: string }) => {
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
        loggedAt: new Date().toISOString()
      };

      await setDoc(logRef, {
        acceptedMeals: arrayUnion(newMeal)
      }, { merge: true });
      
      toast.success("Meal logged successfully!");
      setManualMealDate(null);
    } catch (err: any) {
      console.error(err);
      toast.error(\`Error: \${err.message || "Failed to log meal."}\`);
    }
  };
`;
if (!code.includes("handleConfirmManualMeal")) {
  code = code.replace(/let daysRemaining:/, handlerCode + "\n  let daysRemaining:");
}

// Update the History card rendering to include the + button
code = code.replace(
  /<h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">\{dateString\}<\/h3>/g,
  `<div className="flex items-center justify-between">
    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">{dateString}</h3>
    <button 
      onClick={() => setManualMealDate(dateKey)}
      className="p-1 text-stone-400 hover:text-white transition-colors"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>`
);

// Add the modal at the end before </motion.div>
const modalHTML = `
      {manualMealDate && (
        <MealPhotoConfirmModal
          isOpen={!!manualMealDate}
          initialData={null}
          initialDate={manualMealDate}
          onConfirm={handleConfirmManualMeal}
          onCancel={() => setManualMealDate(null)}
        />
      )}
`;

code = code.replace(
  /<\/div>\n\s*<\/motion\.div>/,
  "</div>\n" + modalHTML + "\n      </motion.div>"
);

fs.writeFileSync('src/views/ProgressView.tsx', code);
console.log("Updated ProgressView.tsx");
