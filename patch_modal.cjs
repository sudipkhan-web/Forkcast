const fs = require('fs');
let code = fs.readFileSync('src/components/MealPhotoConfirmModal.tsx', 'utf8');

// Update interface
code = code.replace(
  /initialData: \{/,
  "initialDate?: string;\n  initialData: {"
);

code = code.replace(
  /onConfirm: \(data: \{ name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' \| 'Lunch' \| 'Dinner' \| 'Snack' \}\) => void;/,
  "onConfirm: (data: { name: string; calories: number; carbsGrams: number; proteinGrams: number; fatGrams: number; mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; date: string }) => void;"
);

// Destructure initialDate
code = code.replace(
  /export function MealPhotoConfirmModal\(\{ isOpen, initialData, onConfirm, onCancel \}: MealPhotoConfirmModalProps\) \{/,
  "export function MealPhotoConfirmModal({ isOpen, initialData, initialDate, onConfirm, onCancel }: MealPhotoConfirmModalProps) {"
);

// Add date state
code = code.replace(
  /const \[mealType, setMealType\] = useState<'Breakfast' \| 'Lunch' \| 'Dinner' \| 'Snack'>\(getDefaultMealType\(\)\);/,
  "const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>(getDefaultMealType());\n  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);"
);

// Update useEffect
const newUseEffect = `
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setCalories(initialData.calories ?? '');
        setCarbsGrams(initialData.carbsGrams ?? '');
        setProteinGrams(initialData.proteinGrams ?? '');
        setFatGrams(initialData.fatGrams ?? '');
        setMealType(getDefaultMealType());
      } else {
        setName('');
        setCalories('');
        setCarbsGrams('');
        setProteinGrams('');
        setFatGrams('');
        setMealType(getDefaultMealType());
      }
      setDate(initialDate || new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, initialData, initialDate]);
`;
code = code.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[initialData\]\);/, newUseEffect);

// Change early return
code = code.replace(/if \(!isOpen \|\| !initialData\) return null;/, "if (!isOpen) return null;");

// Make rendering of image conditional on initialData existing
code = code.replace(/\{initialData\.imageBase64 && \(/g, "{initialData?.imageBase64 && (");
code = code.replace(/\{initialData\.confidence === 'low' && \(/g, "{initialData?.confidence === 'low' && (");

// Add Date picker
const datePickerHTML = `
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                />
              </div>
`;

code = code.replace(
  /<div className="space-y-4">/,
  "<div className=\"space-y-4\">\n" + datePickerHTML
);

// Update onConfirm
code = code.replace(
  /mealType \n\s*\}\)/,
  "mealType,\n                date\n              })"
);

fs.writeFileSync('src/components/MealPhotoConfirmModal.tsx', code);
console.log("Updated MealPhotoConfirmModal.tsx");
